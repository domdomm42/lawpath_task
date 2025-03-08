import { createAddressValidator } from "../../../services/addressValidation";
import type { AddressInput } from "../../../services/addressValidation/types";

export const createResolvers = (baseUrl: string, authToken: string) => {
  const validateAddress = createAddressValidator(baseUrl, authToken);

  return {
    Query: {
      validateAddress: async (_: unknown, args: AddressInput) =>
        validateAddress(args),
    },
  };
};
