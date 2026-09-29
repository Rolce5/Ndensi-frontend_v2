import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AppError,
} from "./app-error";

import {
  shouldRetryQuery,
} from "./retry-policy";

describe("shouldRetryQuery", () => {
  it("does not retry validation errors", () => {
    const error =
      new AppError({
        kind: "validation",
        status: 400,
        message: "Invalid request",
      });

    expect(
      shouldRetryQuery(0, error),
    ).toBe(false);
  });

  it("does not retry authentication errors", () => {
    const error =
      new AppError({
        kind: "authentication",
        status: 401,
        message: "Unauthorized",
      });

    expect(
      shouldRetryQuery(0, error),
    ).toBe(false);
  });

  it("retries server failures", () => {
    const error =
      new AppError({
        kind: "server",
        status: 503,
        message:
          "Service unavailable",
      });

    expect(
      shouldRetryQuery(0, error),
    ).toBe(true);
  });

  it("stops after two retries", () => {
    const error =
      new AppError({
        kind: "server",
        status: 503,
        message:
          "Service unavailable",
      });

    expect(
      shouldRetryQuery(2, error),
    ).toBe(false);
  });
});