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
/*                              OpenAPI helpers                               */
/* -------------------------------------------------------------------------- */

type JsonRequestBody<
  Operation,
> =
  Operation extends {
    requestBody:
      infer RequestBody;
  }
    ? RequestBody extends {
        content: {
          "application/json":
            infer Body;
        };
      }
      ? Body
      : never
    : Operation extends {
          requestBody?:
            infer RequestBody;
        }
      ? NonNullable<RequestBody> extends {
          content: {
            "application/json":
              infer Body;
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

/* -------------------------------------------------------------------------- */
/*                                  Types                                     */
/* -------------------------------------------------------------------------- */

export type VerificationSendRequest =
  JsonRequestBody<
    PostOperation<
      "/api/v2/auth/verification/send"
    >
  >;

export type VerificationResendRequest =
  JsonRequestBody<
    PostOperation<
      "/api/v2/auth/verification/resend"
    >
  >;

export type IdentifierVerificationRequest =
  JsonRequestBody<
    PostOperation<
      "/api/v2/auth/verification/verify"
    >
  >;

/* -------------------------------------------------------------------------- */
/*                              Send code                                     */
/* -------------------------------------------------------------------------- */

export async function sendIdentifierVerification(
  client: NdensiApiClient,
  body: VerificationSendRequest,
) {
  const {
    data,
    error,
    response,
  } =
    await client.POST(
      "/api/v2/auth/verification/send",
      {
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

/* -------------------------------------------------------------------------- */
/*                              Resend code                                   */
/* -------------------------------------------------------------------------- */

export async function resendIdentifierVerification(
  client: NdensiApiClient,
  body: VerificationResendRequest,
) {
  const {
    data,
    error,
    response,
  } =
    await client.POST(
      "/api/v2/auth/verification/resend",
      {
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

/* -------------------------------------------------------------------------- */
/*                              Verify code                                   */
/* -------------------------------------------------------------------------- */

export async function verifyIdentifier(
  client: NdensiApiClient,
  body: IdentifierVerificationRequest,
) {
  const {
    data,
    error,
    response,
  } =
    await client.POST(
      "/api/v2/auth/verification/verify",
      {
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