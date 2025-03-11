import { Locality, LocalitiesResponse } from "./types";
import { AUSTRALIAN_STATES } from "@/lib/constants";

// Normalize data into array structure
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

// Given a suburbname and list of localities, check if the suburb name is full, i.e. not partial
export const isSuburbValid = (
  suburbName: string,
  normalizedLocalities: Locality[]
): boolean => {
  return normalizedLocalities.some(
    (locality) => locality.location.toLowerCase() === suburbName.toLowerCase()
  );
};

export const getStateLabel = (stateCode: string): string => {
  return (
    AUSTRALIAN_STATES.find((s) => s.value === stateCode)?.label || stateCode
  );
};
