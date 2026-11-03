import type { components } from "./generated/schema";

export type UserResponse = components["schemas"]["UserResponse"];

export type ApiResponseUserResponse =
  components["schemas"]["ApiResponseUserResponse"];

export type ApiResponseAuthResponse =
  components["schemas"]["ApiResponseAuthResponse"];

export type PlatformRole =
  | "CUSTOMER"
  | "WATER_PROVIDER"
  | "WASTE_PRODUCER"
  | "RECYCLER"
  | "PROCESSOR"
  | "TRANSPORTER"
  | "KIOSK_AGENT"
  | "ORGANIZATION_ADMIN"
  | "ADMIN";

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  status: string | null;
  phoneVerified: boolean;
  emailVerified: boolean;
  roles: PlatformRole[];
  createdAt: string | null;
}

/**
 * IMPORTANT:
 * The current generated schema exposes only UserResponse.roles.
 * It does not expose organization memberships or current customer IDs.
 *
 * Therefore ActiveContext is intentionally PERSONAL-only here.
 * Do not fabricate organization contexts from ORGANIZATION_ADMIN.
 */
export interface ActiveContext {
  key: string;
  scope: "PERSONAL";
  role: PlatformRole;
  label: string;
  description: string;
}

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string | null;
  refreshTokenExpiresAt: string | null;
}

export interface NormalizedAuthExchange {
  tokens: SessionTokens | null;
  user: CurrentUser | null;
}

const KNOWN_ROLES = new Set<PlatformRole>([
  "CUSTOMER",
  "WATER_PROVIDER",
  "WASTE_PRODUCER",
  "RECYCLER",
  "PROCESSOR",
  "TRANSPORTER",
  "KIOSK_AGENT",
  "ORGANIZATION_ADMIN",
  "ADMIN",
]);

const PERSONAL_CONTEXT_ROLES = new Set<PlatformRole>([
  "CUSTOMER",
  "WATER_PROVIDER",
  "WASTE_PRODUCER",
  "RECYCLER",
  "PROCESSOR",
  "TRANSPORTER",
  "KIOSK_AGENT",
]);

export function normalizeCurrentUser(
  input: ApiResponseUserResponse | UserResponse | null | undefined,
): CurrentUser {
  const source = input && "data" in input ? input.data : input;

  if (!source?.id) {
    throw new Error("The current-user response did not contain a user ID.");
  }

  const roles = (source.roles ?? []).filter((role): role is PlatformRole =>
    KNOWN_ROLES.has(role as PlatformRole),
  );

  return {
    id: source.id,
    firstName: source.firstName ?? "",
    lastName: source.lastName ?? "",
    phone: source.phone ?? "",
    email: source.email ?? null,
    status: source.status ?? null,
    phoneVerified: source.phoneVerified ?? false,
    emailVerified: source.emailVerified ?? false,
    roles,
    createdAt: source.createdAt ?? null,
  };
}

export function normalizeAuthExchange(
  response: ApiResponseAuthResponse | null | undefined,
): NormalizedAuthExchange {
  const auth = response?.data;

  const tokens =
    auth?.accessToken && auth.refreshToken
      ? {
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
          accessTokenExpiresAt: auth.accessTokenExpiresAt ?? null,
          refreshTokenExpiresAt: auth.refreshTokenExpiresAt ?? null,
        }
      : null;

  const user = auth?.user?.id ? normalizeCurrentUser(auth.user) : null;

  return {
    tokens,
    user,
  };
}

export function buildActiveContexts(user: CurrentUser): ActiveContext[] {
  return user.roles
    .filter((role) => PERSONAL_CONTEXT_ROLES.has(role))
    .map((role) => ({
      key: `personal:${role}`,
      scope: "PERSONAL" as const,
      role,
      label:
        role === "CUSTOMER" ? "Personal" : `Personal · ${formatRole(role)}`,
      description: getRoleDescription(role),
    }));
}

function formatRole(role: PlatformRole) {
  return role
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getRoleDescription(role: PlatformRole) {
  switch (role) {
    case "CUSTOMER":
      return "Request water and use Ndensi services personally.";

    case "WATER_PROVIDER":
      return "Manage personal water-provider activity.";

    case "WASTE_PRODUCER":
      return "Manage personal waste-producer activity.";

    case "RECYCLER":
      return "Use Ndensi as a recycler.";

    case "PROCESSOR":
      return "Use Ndensi as a processor.";

    case "TRANSPORTER":
      return "Use Ndensi as a transporter.";

    case "KIOSK_AGENT":
      return "Open the kiosk-assisted service workspace.";

    default:
      return formatRole(role);
  }
}
