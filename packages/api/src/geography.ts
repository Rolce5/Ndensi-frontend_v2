import type { NdensiApiClient } from "../../design-tokens/src/client";
import { normalizeApiError } from "./app-error";

export async function getCountries(
  client: NdensiApiClient,
) {
  const {
    data,
    error,
    response,
  } = await client.GET("/api/v1/countries");

  if (error) {
    throw normalizeApiError(
      error,
      response,
    );
  }

  return data;
}

export async function getRegions(
  client: NdensiApiClient,
  countryId: string,
) {
  const {
    data,
    error,
    response,
  } = await client.GET(
    "/api/v1/countries/{id}/regions",
    {
      params: {
        path: {
          id: countryId,
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