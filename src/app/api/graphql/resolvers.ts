import { AddressInput } from "@/services/addressValidation/types";
import { LocalitiesAPI } from "@/services/addressValidation/api";
import { createAddressValidator } from "@/services/addressValidation/index";
import { GraphQLError } from "graphql";

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
        console.error("Error in validateAddress resolver:"  , error);

        throw new GraphQLError("Address validation service unavailable", {
          extensions: {
            code: "SERVICE_UNAVAILABLE",
            originalError:
              error instanceof Error ? error.message : String(error),
          },
        });
      }
    },
  },
};
