import type { components } from "./generated/schema";

import type { NdensiApiClient } from "./client";

import { normalizeApiError } from "./app-error";

import type { JsonRequestBody, PostOperation } from "./openapi-helpers";

export type CreateOrganizationRequest = JsonRequestBody<
  PostOperation<"/api/v2/organizations">
>;

export type AddOrganizationMemberRequest = JsonRequestBody<
  PostOperation<"/api/v2/organizations/{id}/members">
>;

export type OrganizationResponse =
  components["schemas"]["OrganizationResponse"];

export async function createOrganization(
  client: NdensiApiClient,
  body: CreateOrganizationRequest,
) {
  const { data, error, response } = await client.POST("/api/v2/organizations", {
    body,
  });

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}

export async function getOrganization(
  client: NdensiApiClient,
  organizationId: string,
) {
  const { data, error, response } = await client.GET(
    "/api/v2/organizations/{id}",
    {
      params: {
        path: {
          id: organizationId,
        },
      },
    },
  );

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}

export async function addOrganizationMember(
  client: NdensiApiClient,
  organizationId: string,
  body: AddOrganizationMemberRequest,
) {
  const { data, error, response } = await client.POST(
    "/api/v2/organizations/{id}/members",
    {
      params: {
        path: {
          id: organizationId,
        },
      },

      body,
    },
  );

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}

export async function removeOrganizationMember(
  client: NdensiApiClient,
  organizationId: string,
  userId: string,
) {
  const { data, error, response } = await client.DELETE(
    "/api/v2/organizations/{id}/members/{userId}",
    {
      params: {
        path: {
          id: organizationId,
          userId,
        },
      },
    },
  );

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}
