import { AddressInput } from "@/services/addressValidation/types";
import { LocalitiesAPI } from "@/services/addressValidation/api";
import { createAddressValidator } from "@/services/addressValidation/index";
import { GraphQLError } from "graphql";

/**
 * GraphQL context containing data sources
 * @interface Context
 */
type Context = {
  dataSources: {
    localities: LocalitiesAPI;
  };
};

/**
 * GraphQL resolvers for address validation
 * Maps GraphQL operations to backend services
 */
export const resolvers = {
  Query: {
    /**
     * Resolver for validateAddress query
     * Uses the address validation service to check if address components are valid
     *
     * @param {unknown} _ - Parent object (not used)
     * @param {AddressInput} args - Address input parameters from GraphQL query
     * @param {Context} context - GraphQL context containing data sources
     * @returns {Promise<{isValid: boolean, message: string}>} Validation result
     * @throws {GraphQLError} If validation service is unavailable
     */
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
