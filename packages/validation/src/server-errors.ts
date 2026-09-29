import type {
  FieldValues,
  Path,
  UseFormSetError,
} from "react-hook-form";

import {
  AppError,
} from "@ndensi/api";

export function applyServerFieldErrors<
  TForm extends FieldValues,
>(
  error: unknown,
  setError: UseFormSetError<TForm>,
): boolean {
  if (
    !(error instanceof AppError) ||
    !error.fieldErrors
  ) {
    return false;
  }

  for (
    const [field, messages]
    of Object.entries(
      error.fieldErrors,
    )
  ) {
    const message = messages[0];

    if (!message) {
      continue;
    }

    setError(
      field as Path<TForm>,
      {
        type: "server",
        message,
      },
    );
  }

  return true;
}