import type { components } from "./generated/schema";

import type { NdensiApiClient } from "./client";

import { normalizeApiError } from "./app-error";

import type { JsonRequestBody, PostOperation } from "./openapi-helpers";

export type CreateLocationRequest = JsonRequestBody<
  PostOperation<"/api/v2/locations">
>;

export type LocationResponse = components["schemas"]["LocationResponse"];

export async function createLocation(
  client: NdensiApiClient,
  body: CreateLocationRequest,
  idempotencyKey: string,
) {
  const { data, error, response } = await client.POST("/api/v2/locations", {
    body,

    headers: {
      "Idempotency-Key": idempotencyKey,
    },
  });

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}

export async function getLocation(client: NdensiApiClient, locationId: string) {
  const { data, error, response } = await client.GET(
    "/api/v2/locations/{locationId}",
    {
      params: {
        path: {
          locationId,
        },
      },
    },
  );

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}
