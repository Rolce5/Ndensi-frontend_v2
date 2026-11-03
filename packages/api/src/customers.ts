import type { components } from "./generated/schema";

import type { NdensiApiClient } from "./client";

import { normalizeApiError } from "./app-error";

import type { JsonRequestBody, PostOperation } from "./openapi-helpers";

export type CreateCustomerRequest = JsonRequestBody<
  PostOperation<"/api/v2/customers">
>;

export type CustomerResponse = components["schemas"]["CustomerResponse"];

export async function createCustomer(
  client: NdensiApiClient,
  body: CreateCustomerRequest,
) {
  const { data, error, response } = await client.POST("/api/v2/customers", {
    body,
  });

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}

export async function getCustomer(client: NdensiApiClient, customerId: string) {
  const { data, error, response } = await client.GET("/api/v2/customers/{id}", {
    params: {
      path: {
        id: customerId,
      },
    },
  });

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}
