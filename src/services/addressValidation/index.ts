import { AddressInput, LocalitiesResponse, ValidationResult } from "./types";
import { createAPIClient } from "./api";
import { normalizeLocalities, isSuburbValid } from "./utils";

// Main business logic
export const createAddressValidator = (baseUrl: string, authToken: string) => {
  const apiClient = createAPIClient(baseUrl, authToken);

  // Return the right isValid and message based on locality data
  return async (address: AddressInput): Promise<ValidationResult> => {
    try {
      // Get locality data based on suburb and state
      const data: LocalitiesResponse = await apiClient.fetchLocalities(
        address.suburb,
        address.state
      );

      // Normalize locality data to return in array format
      const localities = normalizeLocalities(data);

      // if suburb name is only partial or if suburb doesn't exist, return appropriate message
      const isSuburbNameValid = isSuburbValid(address.suburb, localities);
      if (!isSuburbNameValid || localities.length === 0) {
        return {
          isValid: false,
          message: `The suburb ${address.suburb} does not exist in the state ${address.state}`,
        };
      }

      // If there is a locality, check if any locality matches the user's input postcode
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
      return {
        isValid: false,
        message:
          error instanceof Error
            ? `Validation error: ${error.message}`
            : "Error validating address. Please try again.",
      };
    }
  };
};
