import { AppError } from "./app-error";

export function shouldRetryQuery(
  failureCount: number,
  error: unknown,
): boolean {
  if (failureCount >= 2) {
    return false;
  }

  if (!(error instanceof AppError)) {
    return true;
  }

  if (
    error.status &&
    error.status >= 400 &&
    error.status < 500
  ) {
    return false;
  }

  return true;
}