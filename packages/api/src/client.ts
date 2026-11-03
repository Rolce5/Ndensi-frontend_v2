
import createClient, {
  type Middleware,
} from "openapi-fetch";

import type {
  paths,
} from "./generated/schema";

export type AccessTokenProvider =
  () =>
    | Promise<string | null>
    | string
    | null;

export interface ApiClientOptions {
  baseUrl: string;

  getAccessToken?:
    | AccessTokenProvider
    | undefined;

  fetch?:
    | typeof globalThis.fetch
    | undefined;
}

export function createNdensiApiClient({
  baseUrl,
  getAccessToken,
  fetch,
}: ApiClientOptions) {
  const client =
    createClient<paths>({
      baseUrl,

      ...(fetch
        ? {
            fetch,
          }
        : {}),
    });

  if (getAccessToken) {
    const authMiddleware:
      Middleware = {
      async onRequest({
        request,
      }) {
        const token =
          await getAccessToken();

        if (token) {
          request.headers.set(
            "Authorization",
            `Bearer ${token}`,
          );
        }

        return request;
      },
    };

    client.use(
      authMiddleware,
    );
  }

  return client;
}

export type NdensiApiClient =
  ReturnType<
    typeof createNdensiApiClient
  >;