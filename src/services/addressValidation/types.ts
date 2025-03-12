/**
 * Address input parameters required for validation
 * @interface AddressInput
 */
export interface AddressInput {
  postcode: string;
  suburb: string;
  state: string;
}

/**
 * Result of address validation containing validation status and message
 * @interface ValidationResult
 */
export interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Locality information returned from Australia Post API
 * @interface Locality
 */
export interface Locality {
  location: string;
  postcode: string | number;
  state: string;
}

// Most of the time, the post API returns a single locality object
/**
 * Standard response format from Australia Post API
 * @interface SingleLocalityResponse
 */
export interface SingleLocalityResponse {
  localities: {
    locality: Locality | Locality[];
  };
}

// Rarely, the post API returns a nested data response
/**
 * Alternative nested response format sometimes returned by Australia Post API
 * @interface NestedLocalityResponse
 */
export interface NestedLocalityResponse {
  data?: {
    localities?: {
      locality: Locality | Locality[];
    };
  };
}

// There are essentially 3 cases, SingleLocalityResponse, NestedLocalityResponse, and null/undefined/empty string
/**
 * Union type representing all possible response formats from the Australia Post API
 * @typedef {SingleLocalityResponse | NestedLocalityResponse | null | undefined} LocalitiesResponse
 */
export type LocalitiesResponse =
  | SingleLocalityResponse
  | NestedLocalityResponse
  | null
  | undefined;
