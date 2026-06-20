import { spawn, execFileSync } from "child_process";

const SANDBOX_IMAGE = "hourly-sandbox:latest";
const SANDBOX_UID = "10000";

// In-memory state per process (single PM2 instance)
const containers = new Map<string, string>(); // sessionId -> containerId
const cwds = new Map<string, string>();        // sessionId -> current working dir

function safeContainerName(sessionId: string): string {
  return `hourly-${sessionId.replace(/[^a-z0-9]/gi, "").slice(0, 24).toLowerCase()}`;
}

function isContainerRunning(id: string): boolean {
  try {
    const out = execFileSync("docker", ["inspect", "-f", "{{.State.Running}}", id], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out === "true";
  } catch {
    return false;
  }
}

export async function getOrCreateContainer(
  sessionId: string,
  workspaceDir: string
): Promise<string> {
  const existing = containers.get(sessionId);
  if (existing && isContainerRunning(existing)) {
    return existing;
  }
  containers.delete(sessionId);

  // Make workspace writable by the sandbox user
  try {
    execFileSync("chown", ["-R", `${SANDBOX_UID}:${SANDBOX_UID}`, workspaceDir]);
  } catch {}

  const name = safeContainerName(sessionId);
  // Remove any stale container with this name
  try { execFileSync("docker", ["rm", "-f", name], { stdio: "ignore" }); } catch {}

  const id = await new Promise<string>((resolve, reject) => {
    let stdout = "";
    let stderr = "";

    const child = spawn("docker", [
      "run", "-d",
      "--name", name,
      // Resource limits
      "--memory", "512m",
      "--memory-swap", "512m",
      "--cpus", "0.5",
      "--pids-limit", "100",
      // Security hardening
      "--cap-drop", "ALL",
      "--security-opt", "no-new-privileges",
      "--user", `${SANDBOX_UID}:${SANDBOX_UID}`,
      // Workspace volume (only thing visible from host)
      "-v", `${workspaceDir}:/workspace:rw`,
      // Outbound internet allowed (npm install, pip install, etc.)
      // but no host env vars exposed
      "--env", `HOME=/home/sandbox`,
      "--env", `USER=sandbox`,
      "--env", `TERM=xterm-256color`,
      "--env", `PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/sandbox/.local/bin`,
      SANDBOX_IMAGE,
      "sleep", "infinity",
    ]);

    child.stdout.on("data", (d: Buffer) => (stdout += d.toString()));
    child.stderr.on("data", (d: Buffer) => (stderr += d.toString()));
    child.on("close", (code) => {
      const id = stdout.trim();
      if (code === 0 && id) resolve(id);
      else reject(new Error(`Failed to start sandbox: ${stderr.trim()}`));
    });
  });

  containers.set(sessionId, id);
  cwds.set(sessionId, "/workspace");
  return id;
}

export async function execInContainer(
  containerId: string,
  sessionId: string,
  command: string
): Promise<{ output: string; exitCode: number; cwd: string }> {
  const cwd = cwds.get(sessionId) ?? "/workspace";

  // Wrap command: navigate to cwd, run command, emit cwd marker at end
  const wrapped = [
    `cd ${JSON.stringify(cwd)} 2>/dev/null || cd /workspace`,
    command,
    `__exit=$?`,
    `printf '\\0::CWD::%s\\0' "$(pwd)"`,
    `exit $__exit`,
  ].join("; ");

  return new Promise((resolve) => {
    let output = "";
    let resolved = false;

    const child = spawn("docker", ["exec", containerId, "bash", "-c", wrapped]);

    child.stdout.on("data", (d: Buffer) => (output += d.toString()));
    child.stderr.on("data", (d: Buffer) => (output += d.toString()));

    const timer = setTimeout(() => {
      if (resolved) return;
      resolved = true;
      child.kill("SIGKILL");
      resolve({
        output: output + "\n[Timed out after 30s]\n",
        exitCode: -1,
        cwd,
      });
    }, 30000);

    child.on("close", (code) => {
      clearTimeout(timer);
      if (resolved) return;
      resolved = true;

      // Extract cwd marker (null-byte delimited to avoid collisions with output)
      const cwdMatch = output.match(/\0::CWD::([^\0]+)\0/);
      const newCwd = cwdMatch?.[1]?.trim() ?? cwd;
      cwds.set(sessionId, newCwd);

      const clean = output.replace(/\0::CWD::[^\0]*\0/, "").replace(/\n$/, "");
      resolve({ output: clean, exitCode: code ?? 0, cwd: newCwd });
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      if (!resolved) {
        resolved = true;
        resolve({ output: `Error: ${err.message}`, exitCode: 1, cwd });
      }
    });
  });
}

export function cleanupContainer(sessionId: string): void {
  const id = containers.get(sessionId);
  if (id) {
    spawn("docker", ["rm", "-f", id]).unref();
  }
  containers.delete(sessionId);
  cwds.delete(sessionId);
}
