import { Locality, LocalitiesResponse } from "./types";

// Normalize data into array structure
export const normalizeLocalities = (data: LocalitiesResponse): Locality[] => {
  if (!data.localities?.locality) {
    return [];
  }

  return Array.isArray(data.localities.locality)
    ? data.localities.locality
    : [data.localities.locality];
};
