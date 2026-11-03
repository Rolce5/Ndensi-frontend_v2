import type { paths } from "./generated/schema";

export type JsonRequestBody<Operation> =
  Operation extends {
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

export type GetOperation<Path extends keyof paths> =
  paths[Path] extends {
    get?: infer Operation;
  }
    ? NonNullable<Operation>
    : never;

export type PostOperation<Path extends keyof paths> =
  paths[Path] extends {
    post?: infer Operation;
  }
    ? NonNullable<Operation>
    : never;

export type PatchOperation<Path extends keyof paths> =
  paths[Path] extends {
    patch?: infer Operation;
  }
    ? NonNullable<Operation>
    : never;

export type DeleteOperation<Path extends keyof paths> =
  paths[Path] extends {
    delete?: infer Operation;
  }
    ? NonNullable<Operation>
    : never;