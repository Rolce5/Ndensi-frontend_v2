import type { paths } from "./generated/schema";

import type { NdensiApiClient } from "./client";
import { normalizeApiError } from "./app-error";

/**
 * Extract application/json request body from an
 * OpenAPI-generated operation.
 */
type JsonRequestBody<Operation> = Operation extends {
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

type PostOperation<Path extends keyof paths> = paths[Path] extends {
  post?: infer Operation;
}
  ? NonNullable<Operation>
  : never;

type PatchOperation<Path extends keyof paths> = paths[Path] extends {
  patch?: infer Operation;
}
  ? NonNullable<Operation>
  : never;

export type RegisterRequest = JsonRequestBody<
  PostOperation<"/api/v2/auth/register">
>;

export type LoginRequest = JsonRequestBody<PostOperation<"/api/v2/auth/login">>;

export type RefreshRequest = JsonRequestBody<
  PostOperation<"/api/v2/auth/refresh">
>;

export type LogoutRequest = JsonRequestBody<
  PostOperation<"/api/v2/auth/logout">
>;

export type MfaSetupRequest = JsonRequestBody<
  PostOperation<"/api/v2/auth/mfa/setup">
>;

export type MfaVerifyRequest = JsonRequestBody<
  PostOperation<"/api/v2/auth/mfa/verify">
>;

export type VerificationSendRequest = JsonRequestBody<
  PostOperation<"/api/v2/auth/verification/send">
>;

export type VerificationResendRequest = JsonRequestBody<
  PostOperation<"/api/v2/auth/verification/resend">
>;

export type VerificationVerifyRequest = JsonRequestBody<
  PostOperation<"/api/v2/auth/verification/verify">
>;

export type ForgotPasswordRequest = JsonRequestBody<
  PostOperation<"/api/v2/auth/forgot-password">
>;

export type ResetPasswordRequest = JsonRequestBody<
  PostOperation<"/api/v2/auth/reset-password">
>;

export type UpdateMeRequest = JsonRequestBody<
  PatchOperation<"/api/v2/user/me">
>;

export async function register(client: NdensiApiClient, body: RegisterRequest) {
  const { data, error, response } = await client.POST("/api/v2/auth/register", {
    body,
  });

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}

export async function login(client: NdensiApiClient, body: LoginRequest) {
  const { data, error, response } = await client.POST("/api/v2/auth/login", {
    body,
  });

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}


export async function refreshSession(
  client: NdensiApiClient,
  body: RefreshRequest,
) {
  const { data, error, response } = await client.POST("/api/v2/auth/refresh", {
    body,
  });

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}

export async function logout(client: NdensiApiClient, body: LogoutRequest) {
  const { data, error, response } = await client.POST("/api/v2/auth/logout", {
    body,
  });

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}

export async function getCurrentUser(client: NdensiApiClient) {
  const { data, error, response } = await client.GET("/api/v2/user/me");

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}

export async function updateCurrentUser(
  client: NdensiApiClient,
  body: UpdateMeRequest,
) {
  const { data, error, response } = await client.PATCH("/api/v2/user/me", {
    body,
  });

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}

export async function setupMfa(client: NdensiApiClient, body: MfaSetupRequest) {
  const { data, error, response } = await client.POST(
    "/api/v2/auth/mfa/setup",
    // {
    //   body,
    // },
  );

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}

export async function verifyMfa(
  client: NdensiApiClient,
  body: MfaVerifyRequest,
) {
  const { data, error, response } = await client.POST(
    "/api/v2/auth/mfa/verify",
    {
      body,
    },
  );

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}

export async function sendVerification(
  client: NdensiApiClient,
  body: VerificationSendRequest,
) {
  const { data, error, response } = await client.POST(
    "/api/v2/auth/verification/send",
    {
      body,
    },
  );

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}

export async function resendVerification(
  client: NdensiApiClient,
  body: VerificationResendRequest,
) {
  const { data, error, response } = await client.POST(
    "/api/v2/auth/verification/resend",
    {
      body,
    },
  );

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}

export async function verifyIdentifier(
  client: NdensiApiClient,
  body: VerificationVerifyRequest,
) {
  const { data, error, response } = await client.POST(
    "/api/v2/auth/verification/verify",
    {
      body,
    },
  );

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}

export async function forgotPassword(
  client: NdensiApiClient,
  body: ForgotPasswordRequest,
) {
  const { data, error, response } = await client.POST(
    "/api/v2/auth/forgot-password",
    {
      body,
    },
  );

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}

export async function resetPassword(
  client: NdensiApiClient,
  body: ResetPasswordRequest,
) {
  const { data, error, response } = await client.POST(
    "/api/v2/auth/reset-password",
    {
      body,
    },
  );

  if (error) {
    throw normalizeApiError(error, response);
  }

  return data;
}
