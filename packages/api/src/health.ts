import { z } from "zod";
import {
  AppError,
  normalizeApiError,
} from "./app-error";

const HealthResponseSchema = z
  .object({
    status: z.string(),
  })
  .passthrough();

export type HealthResponse =
  z.infer<typeof HealthResponseSchema>;

export async function getBackendHealth(
  baseUrl: string,
): Promise<HealthResponse> {
  let response: Response;

  try {
    response = await fetch(
      `${baseUrl}/actuator/health`,
    );
  } catch (error) {
    throw new AppError({
      kind: "offline",
      message: "Unable to reach the Ndensi API.",
      cause: error,
    });
  }

  const body: unknown =
    await response.json();

  if (!response.ok) {
    throw normalizeApiError(
      body,
      response,
    );
  }

  return HealthResponseSchema.parse(body);
}