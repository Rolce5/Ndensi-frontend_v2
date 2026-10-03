import type { NdensiApiClient } from "./client";
import { normalizeApiError } from "./app-error";

export async function getCountries(
  client: NdensiApiClient,
) {
  const {
    data,
    error,
    response,
  } = await client.GET("/api/v2/countries");

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
    "/api/v2/countries/{countryId}/regions",
    {
      params: {
        path: {
           countryId,
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