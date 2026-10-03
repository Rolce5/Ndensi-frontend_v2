export type AppErrorKind =
  | "validation"
  | "authentication"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "rate_limit"
  | "server"
  | "offline"
  | "unknown";

export interface AppErrorOptions {
  kind: AppErrorKind;

  message: string;

  status?: number | undefined;

  code?: string | undefined;

  title?: string | undefined;

  detail?: string | undefined;

  /**
   * Optional structured information provided
   * by newer backend error responses.
   *
   * Older endpoints may not return this.
   */
  details?: Record<string, unknown> | undefined;

  fieldErrors?: Record<string, string[]> | undefined;

  cause?: unknown;
}

export class AppError extends Error {
  readonly kind: AppErrorKind;

  readonly status: number | undefined;

  readonly code: string | undefined;

  readonly title: string | undefined;

  readonly detail: string | undefined;

  readonly details: Record<string, unknown> | undefined;

  readonly fieldErrors: Record<string, string[]> | undefined;

  constructor(options: AppErrorOptions) {
    super(options.message, {
      cause: options.cause,
    });

    this.name = "AppError";

    this.kind = options.kind;

    this.status = options.status;

    this.code = options.code;

    this.title = options.title;

    this.detail = options.detail;

    this.details = options.details;

    this.fieldErrors = options.fieldErrors;
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

function getNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

/* -------------------------------------------------------------------------- */
/*                               Error kinds                                  */
/* -------------------------------------------------------------------------- */

function resolveKind(status?: number): AppErrorKind {
  if (status === undefined) {
    return "offline";
  }

  switch (status) {
    case 400:
    case 422:
      return "validation";

    case 401:
      return "authentication";

    case 403:
      return "forbidden";

    case 404:
      return "not_found";

    case 409:
      return "conflict";

    case 429:
      return "rate_limit";

    default:
      return status >= 500 ? "server" : "unknown";
  }
}

/* -------------------------------------------------------------------------- */
/*                          Validation field errors                           */
/* -------------------------------------------------------------------------- */

function extractFieldErrors(
  value: unknown,
): Record<string, string[]> | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  /*
   * Supports:
   *
   * {
   *   errors: {
   *     phone: "Invalid phone"
   *   }
   * }
   *
   * and:
   *
   * {
   *   errors: {
   *     phone: ["Invalid phone"]
   *   }
   * }
   *
   * and older ProblemDetail responses
   * using fieldErrors.
   */
  const rawErrors = value.errors ?? value.fieldErrors;

  if (!isRecord(rawErrors)) {
    return undefined;
  }

  const result: Record<string, string[]> = {};

  for (const [field, rawValue] of Object.entries(rawErrors)) {
    if (typeof rawValue === "string") {
      result[field] = [rawValue];

      continue;
    }

    if (Array.isArray(rawValue)) {
      const messages = rawValue.filter(
        (item): item is string => typeof item === "string",
      );

      if (messages.length > 0) {
        result[field] = messages;
      }
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

/* -------------------------------------------------------------------------- */
/*                            Normalize API error                             */
/* -------------------------------------------------------------------------- */

export function normalizeApiError(
  error: unknown,
  response?: Response,
): AppError {
  /*
   * Avoid normalizing the same error twice.
   */
  if (error instanceof AppError) {
    return error;
  }

  /*
   * Handles BOTH:
   *
   * OLD:
   * {
   *   success: false,
   *   status: 403,
   *   error: "Forbidden",
   *   message: "...",
   *   path: "...",
   *   errors: null,
   *   timestamp: "..."
   * }
   *
   * NEW:
   * {
   *   success: false,
   *   status: 403,
   *   error: "Forbidden",
   *   code: "IDENTIFIER_VERIFICATION_REQUIRED",
   *   message: "...",
   *   path: "...",
   *   details: {...},
   *   timestamp: "..."
   * }
   *
   * ProblemDetail responses are also supported.
   */
  if (isRecord(error)) {
    const status = getNumber(error.status) ?? response?.status;

    const code = getString(error.code ?? error.errorCode ?? error.error_code);

    const backendMessage = getString(error.message);

    const problemDetail = getString(error.detail);

    const title = getString(error.title) ?? getString(error.error);

    const details = isRecord(error.details) ? error.details : undefined;

    /*
     * Your normal backend error response uses
     * `message`, so it takes priority.
     *
     * ProblemDetail uses `detail`.
     */
    const message =
      backendMessage ??
      problemDetail ??
      title ??
      response?.statusText ??
      (status === undefined
        ? "Unable to connect to the server."
        : "The request could not be completed.");

    return new AppError({
      kind: resolveKind(status),

      status,

      code,

      title,

      detail: problemDetail ?? backendMessage,

      details,

      message,

      fieldErrors: extractFieldErrors(error),

      cause: error,
    });
  }

  const status = response?.status;

  return new AppError({
    kind: resolveKind(status),

    status,

    message:
      status === undefined
        ? "Unable to connect to the server."
        : response?.statusText || "The request could not be completed.",

    cause: error,
  });
}
