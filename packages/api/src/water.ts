import type {
  paths,
} from "./generated/schema";

import type {
  NdensiApiClient,
} from "./client";

import {
  normalizeApiError,
} from "./app-error";

/* -------------------------------------------------------------------------- */
/*                            OpenAPI type helpers                            */
/* -------------------------------------------------------------------------- */

/**
 * Extract application/json request body from an
 * OpenAPI-generated operation.
 *
 * Supports both required and optional requestBody.
 */
type JsonRequestBody<
  Operation,
> =
  Operation extends {
    requestBody: infer RequestBody;
  }
    ? RequestBody extends {
        content: {
          "application/json": infer Body;
        };
      }
      ? Body
      : never
    : Operation extends {
          requestBody?: infer RequestBody;
        }
      ? NonNullable<RequestBody> extends {
          content: {
            "application/json": infer Body;
          };
        }
        ? Body
        : never
      : never;

type PostOperation<
  Path extends keyof paths,
> =
  paths[Path] extends {
    post?: infer Operation;
  }
    ? NonNullable<Operation>
    : never;

type GetOperation<
  Path extends keyof paths,
> =
  paths[Path] extends {
    get?: infer Operation;
  }
    ? NonNullable<Operation>
    : never;

/* -------------------------------------------------------------------------- */
/*                                Request types                               */
/* -------------------------------------------------------------------------- */

export type CreateWaterRequestRequest =
  JsonRequestBody<
    PostOperation<
      "/api/v2/water/requests"
    >
  >;

export type SelectWaterProviderRequest =
  JsonRequestBody<
    PostOperation<
      "/api/v2/water/requests/{id}/select-provider"
    >
  >;

/**
 * These aliases are useful when you want to refer
 * to the operations elsewhere without manually
 * duplicating backend DTOs.
 */
export type GetWaterRequestOperation =
  GetOperation<
    "/api/v2/water/requests/{id}"
  >;

export type GetWaterRequestMatchesOperation =
  GetOperation<
    "/api/v2/water/requests/{id}/matches"
  >;

/* -------------------------------------------------------------------------- */
/*                          Create water request                              */
/* -------------------------------------------------------------------------- */

export async function createWaterRequest(
  client: NdensiApiClient,
  body: CreateWaterRequestRequest,
  idempotencyKey: string,
) {
  const {
    data,
    error,
    response,
  } =
    await client.POST(
      "/api/v2/water/requests",
      {
        body,

        headers: {
          "Idempotency-Key":
            idempotencyKey,
        },
      },
    );

  if (error) {
    throw normalizeApiError(
      error,
      response,
    );
  }

  return data;
}

/* -------------------------------------------------------------------------- */
/*                           Get water request                                */
/* -------------------------------------------------------------------------- */

export async function getWaterRequest(
  client: NdensiApiClient,
  requestId: string,
) {
  const {
    data,
    error,
    response,
  } =
    await client.GET(
      "/api/v2/water/requests/{id}",
      {
        params: {
          path: {
            id: requestId,
          },
        },
      },
    );

  if (error) {
    throw normalizeApiError(
      error,
      response,
    );
  }

  return data;
}

/* -------------------------------------------------------------------------- */
/*                         Get request matches                                */
/* -------------------------------------------------------------------------- */

export async function getWaterRequestMatches(
  client: NdensiApiClient,
  requestId: string,
) {
  const {
    data,
    error,
    response,
  } =
    await client.GET(
      "/api/v2/water/requests/{id}/matches",
      {
        params: {
          path: {
            id: requestId,
          },
        },
      },
    );

  if (error) {
    throw normalizeApiError(
      error,
      response,
    );
  }

  return data;
}

/* -------------------------------------------------------------------------- */
/*                         Select matched provider                            */
/* -------------------------------------------------------------------------- */

export async function selectWaterProvider(
  client: NdensiApiClient,
  requestId: string,
  body: SelectWaterProviderRequest,
) {
  const {
    data,
    error,
    response,
  } =
    await client.POST(
      "/api/v2/water/requests/{id}/select-provider",
      {
        params: {
          path: {
            id: requestId,
          },
        },

        body,
      },
    );

  if (error) {
    throw normalizeApiError(
      error,
      response,
    );
  }

  return data;
}