import { AddressInput } from "../../../services/addressValidation/types";
import { LocalitiesAPI } from "../../../services/addressValidation/api";
import { createAddressValidator } from "../../../services/addressValidation/index";

type Context = {
  dataSources: {
    localities: LocalitiesAPI;
  };
};

export const resolvers = {
  Query: {
    validateAddress: async (
      _: unknown,
      args: AddressInput,
      { dataSources }: Context
    ) => {
      try {
        const validateAddress = createAddressValidator(dataSources.localities);
        return await validateAddress(args);
      } catch (error) {
        console.error("Error in validateAddress resolver:", error);
        return {
          isValid: false,
          message:
            error instanceof Error
              ? `Resolver error: ${error.message}`
              : "Error validating address. Please try again.",
        };
      }
    },
  },
};
