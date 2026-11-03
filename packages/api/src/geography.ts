import type { components } from "./generated/schema";

import type { NdensiApiClient } from "./client";

import { normalizeApiError } from "./app-error";

export type CountryResponse = components["schemas"]["CountryResponse"];

export type RegionResponse = components["schemas"]["RegionResponse"];

export async function getCountries(
  client: NdensiApiClient,
) {
  const {
    data,
    error,
    response,
  } = await client.GET(
    "/api/v2/countries",
  );


  if (error) {
    throw normalizeApiError(
      error,
      response,
    );
  }

  return data ?? null;
}

export async function getRegions(
  client: NdensiApiClient,
  countryId: string,
  parentRegionId?: string,
) {
  const { data, error, response } = await client.GET(
    "/api/v2/countries/{countryId}/regions",
    {
      params: {
        path: {
          countryId,
        },

        query: parentRegionId
          ? {
              parentRegionId,
            }
          : {},
      },
    },
  );

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}
