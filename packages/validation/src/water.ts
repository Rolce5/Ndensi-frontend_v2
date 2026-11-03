import {
  z,
} from "zod";

export const waterRequestSchema =
  z.object({
    waterType:
      z.enum([
        "TAP",
        "BOREHOLE",
        "SPRING",
        "MINERAL",
        "OTHER",
      ]),

    quantity:
      z
        .string()
        .trim()
        .min(
          1,
          "Quantity is required.",
        )
        .refine(
          (value) => {
            const number =
              Number(
                value.replace(
                  /,/g,
                  "",
                ),
              );

            return (
              Number.isFinite(
                number,
              ) &&
              number > 0
            );
          },
          {
            message:
              "Quantity must be greater than zero.",
          },
        ),

    unit:
      z.enum([
          "BOTTLE",
          "CUBIC_METER",
          "JERRYCAN",
          "LITER",
      ]),

    urgency:
      z.enum([
        "STANDARD",
        "URGENT",
        "EMERGENCY",
      ]),

    deliveryMode:
      z.enum([
        "DELIVERY",
        "PICKUP",
      ]),

    // deliveryLocationId:
    //   z
    //     .string()
    //     .uuid(
    //       "Please select a valid location.",
    //     ),
  });

export type WaterRequestFormValues =
  z.infer<
    typeof waterRequestSchema
  >;