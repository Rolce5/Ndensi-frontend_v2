import {
  describe,
  expect,
  it,
} from "vitest";

import {
  normalizeApiError,
} from "./app-error";

describe("normalizeApiError", () => {
  it("normalizes Spring ProblemDetail", () => {
    const problem = {
      type: "about:blank",
      title: "Bad Request",
      status: 400,
      detail:
        "Validation failed",
      errors: {
        email: "Email is required",
      },
    };

    const response =
      new Response(
        JSON.stringify(problem),
        {
          status: 400,
          headers: {
            "Content-Type":
              "application/problem+json",
          },
        },
      );

    const error =
      normalizeApiError(
        problem,
        response,
      );

    expect(error.kind)
      .toBe("validation");

    expect(error.status)
      .toBe(400);

    expect(
      error.fieldErrors?.email,
    ).toEqual([
      "Email is required",
    ]);
  });
});