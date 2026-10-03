import { AppError } from "./app-error";

export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof AppError)) {
    if (error instanceof Error) {
      return error.message;
    }

    return "Something went wrong. Please try again.";
  }

  /*
   * Newer endpoints may expose stable
   * application error codes.
   *
   * Older endpoints may have no code.
   * That is completely fine.
   */
  switch (error.code) {
    case "INVALID_CREDENTIALS":
      return "The phone, email, or password is incorrect.";

    case "ACCOUNT_LOCKED":
      return "Your account is temporarily locked.";

    case "ACCOUNT_DISABLED":
    case "ACCOUNT_SUSPENDED":
      return "This account is currently unavailable.";

    case "IDENTIFIER_VERIFICATION_REQUIRED":
      return error.message;

    case "MFA_REQUIRED":
      return "Multi-factor authentication is required to continue.";

    case "MFA_CODE_INVALID":
    case "INVALID_MFA_CODE":
      return "The authentication code is incorrect.";

    case "MFA_ENROLLMENT_REQUIRED":
      return "Multi-factor authentication must be configured before continuing.";

    case "MFA_CHALLENGE_EXPIRED":
      return "The authentication request has expired.";

    case "PASSWORD_RESET_EXPIRED":
    case "RESET_TOKEN_EXPIRED":
      return "This password reset request has expired.";

    case "RATE_LIMITED":
    case "RATE_LIMIT_EXCEEDED":
      return "Too many attempts. Please try again later.";

    default:
      break;
  }

  /*
   * HTTP/client conditions.
   */
  if (error.kind === "rate_limit") {
    return "Too many attempts. Please try again later.";
  }

  if (error.kind === "offline") {
    return "No internet connection.";
  }

  /*
   * IMPORTANT:
   *
   * This is what keeps older backend
   * responses working.
   *
   * If an endpoint doesn't return a code,
   * simply display the backend message.
   */
  if (error.message.trim().length > 0) {
    return error.message;
  }

  switch (error.kind) {
    case "validation":
      return "Please check the information you entered.";

    case "authentication":
      return "Authentication failed.";

    case "forbidden":
      return "You are not allowed to perform this action.";

    case "not_found":
      return "The requested resource could not be found.";

    case "conflict":
      return "The request conflicts with existing information.";

    case "server":
      return "The server encountered a problem. Please try again.";

    default:
      return "Something went wrong. Please try again.";
  }
}
