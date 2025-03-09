import { createAddressValidator } from "../../../services/addressValidation";
import type { AddressInput } from "../../../services/addressValidation/types";

// Create a resolver client
export const createResolvers = (baseUrl: string, authToken: string) => {
  const validateAddress = createAddressValidator(baseUrl, authToken);

  // add more queries here if need be
  return {
    // arguments: (postcode: string; suburb: string; state: string;)
    Query: {
      validateAddress: async (_: unknown, args: AddressInput) =>
        validateAddress(args),
    },
  };
};
