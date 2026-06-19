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

export async function validatePolarLicense(
  key: string
): Promise<ValidatedLicense> {
  const accessToken = process.env.POLAR_ACCESS_TOKEN;
  const organizationId = process.env.POLAR_ORGANIZATION_ID;

  if (!accessToken) {
    throw new Error("Polar access token not configured");
  }

  const res = await fetch("https://api.polar.sh/v1/users/license-keys/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      key,
      organization_id: organizationId,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 404 || res.status === 400) {
      throw new Error("Invalid license key");
    }
    throw new Error(
      (err as { detail?: string }).detail ?? "Failed to validate license"
    );
  }

  const data = (await res.json()) as {
    id: string;
    key: string;
    product_id: string;
    status: string;
    usage?: { activations?: number; limit?: number };
    activation_id?: string;
  };

  if (data.status !== "granted" && data.status !== "active") {
    throw new Error("License key is not active");
  }

  const productId = data.product_id;
  const duration = TIER_DURATIONS[productId];
  const tier = TIER_NAMES[productId];

  if (!duration || !tier) {
    throw new Error("Unrecognized product — contact support");
  }

  return {
    key: data.key,
    tier,
    durationMs: duration,
    activationId: data.activation_id ?? data.id,
    productId,
  };
}
