export interface TokenBundle {
  accessToken: string;

  refreshToken: string;
}

export interface AuthExchange {
  tokens: TokenBundle | null;
}

export interface OrganizationMembership {
  organizationId: string;

  organizationName: string | null;

  roleCodes: string[];
}

export interface CurrentUser {
  id: string;

  firstName: string | null;

  lastName: string | null;

  email: string | null;

  phone: string | null;

  roleCodes: string[];

  memberships: OrganizationMembership[];
}

export interface ActiveContext {
  key: string;

  roleCode: string;

  organizationId: string | null;

  organizationName: string | null;
}

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringValue(
  object: Record<string, unknown>,

  ...keys: string[]
): string | null {
  for (const key of keys) {
    const value = object[key];

    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return null;
}

function extractRoleCodes(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const roles = new Set<string>();

  for (const item of value) {
    if (typeof item === "string") {
      roles.add(item);

      continue;
    }

    if (!isRecord(item)) {
      continue;
    }

    const code = stringValue(item, "code", "roleCode", "name");

    if (code) {
      roles.add(code);
    }
  }

  return [...roles];
}

/**
 * Supports endpoints that return:
 *
 * AuthResponse directly
 *
 * OR
 *
 * ApiResponse<AuthResponse>
 */
function unwrapData(value: unknown): unknown {
  if (!isRecord(value)) {
    return value;
  }

  if (value.data !== undefined && value.data !== null) {
    return value.data;
  }

  return value;
}

/* -------------------------------------------------------------------------- */
/*                          Authentication exchange                           */
/* -------------------------------------------------------------------------- */

export function normalizeAuthExchange(value: unknown): AuthExchange {
  const unwrapped = unwrapData(value);

  if (!isRecord(unwrapped)) {
    return {
      tokens: null,
    };
  }

  const tokensContainer = isRecord(unwrapped.tokens)
    ? unwrapped.tokens
    : unwrapped;

  const accessToken = stringValue(
    tokensContainer,
    "accessToken",
    "access_token",
  );

  const refreshToken = stringValue(
    tokensContainer,
    "refreshToken",
    "refresh_token",
  );

  return {
    tokens:
      accessToken && refreshToken
        ? {
            accessToken,
            refreshToken,
          }
        : null,
  };
}

/* -------------------------------------------------------------------------- */
/*                              Current user                                  */
/* -------------------------------------------------------------------------- */

export function normalizeCurrentUser(value: unknown): CurrentUser {
  const unwrapped = unwrapData(value);

  if (!isRecord(unwrapped)) {
    throw new Error("Invalid /users/me response.");
  }

  const id = stringValue(unwrapped, "id", "userId", "user_id");

  if (!id) {
    throw new Error("Current user response has no id.");
  }

  const roleCodes = extractRoleCodes(
    unwrapped.roles ?? unwrapped.roleCodes ?? unwrapped.authorities,
  );

  const memberships: OrganizationMembership[] = [];

  const rawMemberships =
    unwrapped.memberships ?? unwrapped.organizationMemberships;

  if (Array.isArray(rawMemberships)) {
    for (const membership of rawMemberships) {
      if (!isRecord(membership)) {
        continue;
      }

      const organization = isRecord(membership.organization)
        ? membership.organization
        : membership;

      const organizationId = stringValue(organization, "organizationId", "id");

      if (!organizationId) {
        continue;
      }

      memberships.push({
        organizationId,

        organizationName: stringValue(organization, "organizationName", "name"),

        roleCodes: extractRoleCodes(membership.roles ?? membership.roleCodes),
      });
    }
  }

  return {
    id,

    firstName: stringValue(unwrapped, "firstName", "first_name"),

    lastName: stringValue(unwrapped, "lastName", "last_name"),

    email: stringValue(unwrapped, "email"),

    phone: stringValue(unwrapped, "phone", "phoneNumber"),

    roleCodes,

    memberships,
  };
}

/* -------------------------------------------------------------------------- */
/*                             Active contexts                                */
/* -------------------------------------------------------------------------- */

export function buildActiveContexts(user: CurrentUser): ActiveContext[] {
  const contexts = new Map<string, ActiveContext>();

  for (const membership of user.memberships) {
    for (const roleCode of membership.roleCodes) {
      const key = `${membership.organizationId}:${roleCode}`;

      contexts.set(key, {
        key,

        roleCode,

        organizationId: membership.organizationId,

        organizationName: membership.organizationName,
      });
    }
  }

  for (const roleCode of user.roleCodes) {
    const alreadyRepresented = [...contexts.values()].some(
      (context) => context.roleCode === roleCode,
    );

    if (alreadyRepresented) {
      continue;
    }

    const key = `personal:${roleCode}`;

    contexts.set(key, {
      key,

      roleCode,

      organizationId: null,

      organizationName: null,
    });
  }

  return [...contexts.values()];
}
