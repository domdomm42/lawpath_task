import { Locality, LocalitiesResponse } from "./types";

// Normalize data into array structure
export const normalizeLocalities = (data: LocalitiesResponse): Locality[] => {
  if (!data.localities?.locality) {
    return [];
  }

  // if locality is not in array form, convert it to an array format.
  return Array.isArray(data.localities.locality)
    ? data.localities.locality
    : [data.localities.locality];
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
