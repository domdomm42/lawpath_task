import { AddressInput, LocalitiesResponse, ValidationResult } from "./types";
import { LocalitiesAPI } from "./api";
import { normalizeLocalities, isSuburbValid, getStateLabel } from "./utils";
import { GraphQLError } from "graphql";

// Keep the functional approach but accept the DataSource instead of baseUrl/authToken
export const createAddressValidator = (localitiesAPI: LocalitiesAPI) => {
  if (!localitiesAPI) {
    throw new Error("LocalitiesAPI is required");
  }

  // Return async function that takes in an address and returns validation result
  return async (address: AddressInput): Promise<ValidationResult> => {
    try {
      // Get locality data using DataSource

      const data: LocalitiesResponse = await localitiesAPI.getLocalities(
        address.suburb,
        address.state
      );

      console.log(data);

      // Normalize locality data to return in array format
      const localities = normalizeLocalities(data);

      // if suburb name is only partial or if suburb doesn't exist, return appropriate message
      const isSuburbNameValid = isSuburbValid(address.suburb, localities);
      if (!isSuburbNameValid || localities.length === 0) {
        return {
          isValid: false,
          message: `The suburb ${
            address.suburb
          } does not exist in the state ${getStateLabel(address.state)}`,
        };
      }

      // If suburb exists within the state, check if its postcode matches the entered postcode
      const matchingPostcode = localities.find(
        (loc) => loc.postcode.toString() === address.postcode
      );

      // If user entered postcode does not appear in any of the locality, then postcode does not match the suburb
      if (!matchingPostcode) {
        return {
          isValid: false,
          message: `The postcode ${address.postcode} does not match the suburb ${address.suburb}`,
        };
      }

      // When Suburb matches State, and Postcode matches Suburb, all the inputs are valid
      return {
        isValid: true,
        message: "The postcode, suburb, and state input are valid.",
      };
    } catch (error) {
      console.error("Error validating address:", error);

      throw new GraphQLError("Address validation service unavailable", {
        extensions: {
          code: "SERVICE_UNAVAILABLE",
          originalError: error instanceof Error ? error.message : String(error),
        },
      });
    }
  };
};
