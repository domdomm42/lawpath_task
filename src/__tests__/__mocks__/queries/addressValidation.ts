export const VALIDATE_ADDRESS_QUERY = `
query {
  validateAddress(postcode: "2000", suburb: "SYDNEY", state: "NSW") {
    isValid
    message
  }
}
`;

export const INVALID_ADDRESS_QUERY = `
query {
  validateAddress(postcode: "2007", suburb: "Broadw", state: "NSW") {
    isValid
    message  
  } 
}
`;
