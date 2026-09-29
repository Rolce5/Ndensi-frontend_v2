export const queryKeys = {
  system: {
    all: ["system"] as const,

    health: () =>
      [...queryKeys.system.all, "health"] as const,
  },

  geography: {
    all: ["geography"] as const,

    countries: () =>
      [
        ...queryKeys.geography.all,
        "countries",
      ] as const,

    regions: (countryId: string) =>
      [
        ...queryKeys.geography.all,
        "countries",
        countryId,
        "regions",
      ] as const,
  },
} as const;