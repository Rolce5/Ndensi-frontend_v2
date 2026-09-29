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
  title?: string | undefined;
  detail?: string | undefined;
  fieldErrors?: Record<string, string[]> | undefined;
  cause?: unknown;
}

export class AppError extends Error {
  readonly kind: AppErrorKind;

  readonly status: number | undefined;
  readonly title: string | undefined;
  readonly detail: string | undefined;
  readonly fieldErrors:
    | Record<string, string[]>
    | undefined;

  constructor(options: AppErrorOptions) {
    super(options.message, {
      cause: options.cause,
    });

    this.name = "AppError";

    this.kind = options.kind;
    this.status = options.status;
    this.title = options.title;
    this.detail = options.detail;
    this.fieldErrors = options.fieldErrors;
  }
}

function resolveKind(
  status?: number,
): AppErrorKind {
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
      return status >= 500
        ? "server"
        : "unknown";
  }
}

function extractFieldErrors(
  value: unknown,
): Record<string, string[]> | undefined {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return undefined;
  }

  const object =
    value as Record<string, unknown>;

  const rawErrors =
    object.errors ??
    object.fieldErrors;

  if (
    !rawErrors ||
    typeof rawErrors !== "object"
  ) {
    return undefined;
  }

  const result:
    Record<string, string[]> = {};

  for (
    const [field, message]
    of Object.entries(rawErrors)
  ) {
    if (typeof message === "string") {
      result[field] = [message];
      continue;
    }

    if (
      Array.isArray(message) &&
      message.every(
        (item) =>
          typeof item === "string",
      )
    ) {
      result[field] = message;
    }
  }

  return Object.keys(result).length > 0
    ? result
    : undefined;
}

export function normalizeApiError(
  error: unknown,
  response?: Response,
): AppError {
  const status = response?.status;

  if (
    error &&
    typeof error === "object"
  ) {
    const problem =
      error as Record<string, unknown>;

    const title =
      typeof problem.title === "string"
        ? problem.title
        : undefined;

    const detail =
      typeof problem.detail === "string"
        ? problem.detail
        : undefined;

    return new AppError({
      kind: resolveKind(status),
      status,
      title,
      detail,
      message:
        detail ??
        title ??
        "The request could not be completed.",
      fieldErrors:
        extractFieldErrors(error),
      cause: error,
    });
  }

  return new AppError({
    kind: resolveKind(status),
    status,
    message:
      status === undefined
        ? "Unable to connect to the server."
        : "The request could not be completed.",
    cause: error,
  });
}