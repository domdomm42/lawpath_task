export const VALIDATE_ADDRESS_QUERY = `
query ValidateAddressQuery($postcode: String!, $suburb: String!, $state: String!) {
  validateAddress(postcode: $postcode, suburb: $suburb, state: $state) {
    isValid
    message
  }
}
`;

export const INVALID_ADDRESS_QUERY = `
query InvalidAddressQuery($postcode: String!, $suburb: String!, $state: String!) {
  validateAddress(postcode: $postcode, suburb: $suburb, state: $state) {
    isValid
    message  
  } 
}
`;
