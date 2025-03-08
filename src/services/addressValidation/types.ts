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

export interface LocalitiesResponse {
  localities?: {
    locality: Locality[] | Locality;
  };
}
