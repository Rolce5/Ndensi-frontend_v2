import type { components } from "./generated/schema";

import type { NdensiApiClient } from "./client";

import { normalizeApiError } from "./app-error";

import type {
  JsonRequestBody,
  PatchOperation,
  PostOperation,
} from "./openapi-helpers";

export type RegisterRequest = JsonRequestBody<
  PostOperation<"/api/v2/auth/register">
>;

export type RegistrationResponse =
  components["schemas"]["RegistrationResponse"];

export type LoginRequest = JsonRequestBody<PostOperation<"/api/v2/auth/login">>;

export type RefreshTokenRequest = JsonRequestBody<
  PostOperation<"/api/v2/auth/refresh">
>;

export type LogoutRequest = JsonRequestBody<
  PostOperation<"/api/v2/auth/logout">
>;

export type VerificationRequest = JsonRequestBody<
  PostOperation<"/api/v2/auth/verification/verify">
>;

export type VerificationSendRequest = JsonRequestBody<
  PostOperation<"/api/v2/auth/verification/send">
>;

export type MfaVerifyRequest = JsonRequestBody<
  PostOperation<"/api/v2/auth/mfa/verify">
>;

export type PasswordForgotRequest = JsonRequestBody<
  PostOperation<"/api/v2/auth/forgot-password">
>;

export type PasswordResetRequest = JsonRequestBody<
  PostOperation<"/api/v2/auth/reset-password">
>;

export type UpdateMeRequest = JsonRequestBody<
  PatchOperation<"/api/v2/user/me">
>;

export type UserResponse = components["schemas"]["UserResponse"];

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
  body: RefreshTokenRequest,
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

export async function logoutAll(client: NdensiApiClient) {
  const { data, error, response } = await client.POST(
    "/api/v2/auth/logout-all",
  );

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

export async function setupMfa(client: NdensiApiClient) {
  const { data, error, response } = await client.POST("/api/v2/auth/mfa/setup");

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
  body: VerificationSendRequest,
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
  body: VerificationRequest,
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
  body: PasswordForgotRequest,
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
  body: PasswordResetRequest,
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
