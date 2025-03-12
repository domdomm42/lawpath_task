import { Locality, LocalitiesResponse } from "./types";
import { AUSTRALIAN_STATES } from "@/lib/constants";

/**
 * Normalizes various response formats from the Australia Post API into a consistent array of localities
 * Handles both single locality and multiple localities formats
 *
 * @param {LocalitiesResponse} response - Raw response from the Australia Post API
 * @returns {Locality[]} Normalized array of locality objects
 */
export const normalizeLocalities = (
  response: LocalitiesResponse
): Locality[] => {
  if (!response) {
    return [];
  }

  let localities: Locality | Locality[] | undefined;

  // Case 1: Standard response { localities: { locality: ... } }
  if ("localities" in response && response.localities?.locality) {
    localities = response.localities.locality;
  }
  // Case 2: Wrapped response { data: { localities: { locality: ... } } }
  else if ("data" in response && response.data?.localities?.locality) {
    localities = response.data.localities.locality;
  }

  // Handle missing data
  if (!localities) {
    return [];
  }

  // Handle both array and single object cases
  return Array.isArray(localities) ? localities : [localities];
};

/**
 * Validates if a suburb name is fully matched (not partially) in the list of localities
 * Performs case-insensitive comparison
 *
 * @param {string} suburbName - User-entered suburb name to validate
 * @param {Locality[]} normalizedLocalities - List of localities to check against
 * @returns {boolean} True if suburb exists exactly as entered, false otherwise
 */
export const isSuburbValid = (
  suburbName: string,
  normalizedLocalities: Locality[]
): boolean => {
  return normalizedLocalities.some(
    (locality) => locality.location.toLowerCase() === suburbName.toLowerCase()
  );
};

/**
 * Converts a state code to its full label name
 *
 * @param {string} stateCode - Two or three letter state code (e.g., "NSW", "VIC")
 * @returns {string} Full state name or the original code if not found
 */
export const getStateLabel = (stateCode: string): string => {
  return (
    AUSTRALIAN_STATES.find((s) => s.value === stateCode)?.label || stateCode
  );
};
