export interface AddressInput {
  postcode: string;
  suburb: string;
  state: string;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface Locality {
  location: string;
  postcode: string | number;
  state: string;
}

// Most of the time, the post API returns a single locality object
export interface SingleLocalityResponse {
  localities: {
    locality: Locality | Locality[];
  };
}

// Rarely, the post API returns a nested data response
export interface NestedLocalityResponse {
  data?: {
    localities?: {
      locality: Locality | Locality[];
    };
  };
}

// Combined type that allows either format
export type LocalitiesResponse =
  | SingleLocalityResponse
  | NestedLocalityResponse
  | undefined; // For the empty case
