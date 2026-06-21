import { isKeyUsed, claimKey } from "@/lib/key-store";

export type PolarTier = "1h" | "6h" | "24h" | "7d" | "30d";

export interface ValidatedLicense {
  key: string;
  tier: PolarTier;
  durationMs: number;
  activationId: string;
  productId: string;
}

const TIER_DURATIONS: Record<string, number> = {
  [process.env.POLAR_PRODUCT_1H ?? "prod_1h"]: 60 * 60 * 1000,
  [process.env.POLAR_PRODUCT_6H ?? "prod_6h"]: 6 * 60 * 60 * 1000,
  [process.env.POLAR_PRODUCT_24H ?? "prod_24h"]: 24 * 60 * 60 * 1000,
  [process.env.POLAR_PRODUCT_7D ?? "prod_7d"]: 7 * 24 * 60 * 60 * 1000,
  [process.env.POLAR_PRODUCT_30D ?? "prod_30d"]: 30 * 24 * 60 * 60 * 1000,
};

const TIER_NAMES: Record<string, PolarTier> = {
  [process.env.POLAR_PRODUCT_1H ?? "prod_1h"]: "1h",
  [process.env.POLAR_PRODUCT_6H ?? "prod_6h"]: "6h",
  [process.env.POLAR_PRODUCT_24H ?? "prod_24h"]: "24h",
  [process.env.POLAR_PRODUCT_7D ?? "prod_7d"]: "7d",
  [process.env.POLAR_PRODUCT_30D ?? "prod_30d"]: "30d",
};

const POLAR_BASE = "https://api.polar.sh/v1";

async function polarGet(path: string, accessToken: string) {
  const res = await fetch(`${POLAR_BASE}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? `Polar API error: ${res.status}`);
  }
  return res.json();
}

export async function validatePolarLicense(
  key: string,
  activationLabel: string
): Promise<ValidatedLicense> {
  const accessToken = process.env.POLAR_ACCESS_TOKEN;
  const organizationId = process.env.POLAR_ORGANIZATION_ID;

  if (!accessToken) throw new Error("Polar access token not configured");

  // Fast-path: reject immediately if we've already issued a session for this key
  if (await isKeyUsed(key)) {
    throw new Error(
      "This license key has already been activated. Each key can only be used once — purchase a new key at hourly.krl.kr/pricing to add more time."
    );
  }

  // Step 1: validate the license key
  const validateRes = await fetch(`${POLAR_BASE}/license-keys/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ key, organization_id: organizationId }),
  });

  if (!validateRes.ok) {
    const err = await validateRes.json().catch(() => ({}));
    if (validateRes.status === 404 || validateRes.status === 400) {
      throw new Error("Invalid license key");
    }
    throw new Error((err as { detail?: string }).detail ?? "Failed to validate license");
  }

  const licenseData = (await validateRes.json()) as {
    id: string;
    key: string;
    status: string;
    customer_id: string;
    usage: number;
    limit_usage: number | null;
  };

  if (licenseData.status !== "granted" && licenseData.status !== "active") {
    throw new Error(
      `This license key is ${licenseData.status === "revoked" ? "revoked" : "inactive"}. Each key can only be used once — purchase a new key at hourly.krl.kr/pricing.`
    );
  }

  // Reject if usage is at or over limit (key already activated)
  if (licenseData.limit_usage !== null && licenseData.usage >= licenseData.limit_usage) {
    throw new Error(
      "This license key has already been activated. Each key can only be used once — purchase a new key at hourly.krl.kr/pricing to add more time."
    );
  }

  // Step 2: find the benefit grant → order → product_id
  const grantsData = (await polarGet(
    `/benefit-grants/?customer_id=${licenseData.customer_id}&limit=50`,
    accessToken
  )) as { items: Array<{ order_id: string | null; properties?: { license_key_id?: string } }> };

  const grant = grantsData.items.find(
    (g) => g.properties?.license_key_id === licenseData.id && g.order_id
  );

  if (!grant?.order_id) {
    throw new Error("Could not find order for this license key — contact support");
  }

  const order = (await polarGet(`/orders/${grant.order_id}`, accessToken)) as {
    product_id: string;
  };

  const productId = order.product_id;
  const duration = TIER_DURATIONS[productId];
  const tier = TIER_NAMES[productId];

  if (!duration || !tier) {
    throw new Error("Unrecognized product — contact support");
  }

  // Step 3: atomically claim key in our store — prevents reuse even if Polar has no limit_usage
  const claimed = await claimKey(key);
  if (!claimed) {
    throw new Error(
      "This license key has already been activated. Each key can only be used once — purchase a new key at hourly.krl.kr/pricing to add more time."
    );
  }

  // Step 4: tell Polar to mark the key as used (for their records; non-fatal)
  fetch(`${POLAR_BASE}/license-keys/activate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ key, label: activationLabel }),
  }).catch(() => {});

  return {
    key: licenseData.key,
    tier,
    durationMs: duration,
    activationId: licenseData.id,
    productId,
  };
}
