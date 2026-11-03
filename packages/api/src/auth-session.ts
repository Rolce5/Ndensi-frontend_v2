export interface TokenBundle {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

export interface OrganizationMembership {
  organizationId: string;
  organizationName: string | null;
  roleCodes: string[];
}

export interface CurrentUser {
  // id: string;
  // firstName: string | null;
  // lastName: string | null;
  // email: string | null;
  // phone: string | null;
  // roleCodes: string[];
  // memberships: OrganizationMembership[];
    id: string;

  firstName: string | null;

  lastName: string | null;

  phone: string | null;

  email: string | null;

  status: string;

  phoneVerified: boolean;

  emailVerified: boolean;

  roles: string[];

  createdAt: string;
}

export interface AuthExchange {
  tokens: TokenBundle | null;
  user: CurrentUser | null;
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null
  );
}

function unwrapData(
  value: unknown,
): unknown {
  if (
    isRecord(value) &&
    value.data !== undefined &&
    value.data !== null
  ) {
    return value.data;
  }

  return value;
}

function stringOrNull(
  value: unknown,
): string | null {
  return typeof value === "string"
    ? value
    : null;
}

function stringArray(
  value: unknown,
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string =>
      typeof item === "string",
  );
}

/* -------------------------------------------------------------------------- */
/*                              Current user                                  */
/* -------------------------------------------------------------------------- */

export function normalizeCurrentUser(
  value: unknown,
): CurrentUser {
  const data =
    isRecord(value) &&
    value.data !== undefined
      ? value.data
      : value;

  if (!isRecord(data)) {
    throw new Error(
      "Invalid current user response.",
    );
  }

  if (
    typeof data.id !==
    "string"
  ) {
    throw new Error(
      "Current user response has no id.",
    );
  }

  return data as unknown as CurrentUser;
}

function normalizeMemberships(
  value: unknown,
): OrganizationMembership[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const memberships:
    OrganizationMembership[] =
      [];

  for (const item of value) {
    if (!isRecord(item)) {
      continue;
    }

    const organization =
      isRecord(
        item.organization,
      )
        ? item.organization
        : item;

    const organizationId =
      stringOrNull(
        organization.id ??
          organization.organizationId,
      );

    if (!organizationId) {
      continue;
    }

    memberships.push({
      organizationId,

      organizationName:
        stringOrNull(
          organization.name ??
            organization.organizationName,
        ),

      roleCodes:
        stringArray(
          item.roles ??
            item.roleCodes,
        ),
    });
  }

  return memberships;
}
