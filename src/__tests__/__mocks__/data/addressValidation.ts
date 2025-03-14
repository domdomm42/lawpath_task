import { VALIDATE_ADDRESS } from "@/lib/graphql/queries";

export const mockValidLocality = {
  localities: {
    locality: [
      {
        location: "SYDNEY",
        postcode: "2000",
        state: "NSW",
      },
    ],
  },
};

export const mockPartialLocality = {
  localities: {
    locality: [
      {
        category: "Delivery Area",
        id: 2755,
        latitude: -29.03466009,
        location: "BROADWATER",
        longitude: 153.4261576,
        postcode: 2472,
        state: "NSW",
      },
      {
        category: "Delivery Area",
        id: 3377,
        latitude: -36.97322738,
        location: "BROADWATER",
        longitude: 149.8934933,
        postcode: 2549,
        state: "NSW",
      },
      {
        category: "Delivery Area",
        id: 461,
        latitude: -33.884366,
        location: "BROADWAY",
        longitude: 151.196502,
        postcode: 2007,
        state: "NSW",
      },
      {
        category: "Delivery Area",
        id: 3650,
        latitude: -34.70916165,
        location: "BROADWAY",
        longitude: 149.0818805,
        postcode: 2581,
        state: "NSW",
      },
    ],
  },
};

export const mockEmptyLocality = {
  localities: {
    locality: [],
  },
};

// Mock data for successful validation
export const validAddressMock = {
  request: {
    query: VALIDATE_ADDRESS,
    variables: {
      postcode: "2000",
      suburb: "Sydney",
      state: "NSW",
    },
  },
  result: {
    data: {
      validateAddress: {
        isValid: true,
        message: "Address is valid",
      },
    },
  },
};

// Mock data for failed validation
export const invalidAddressMock = {
  request: {
    query: VALIDATE_ADDRESS,
    variables: {
      postcode: "9999",
      suburb: "Invalid",
      state: "NSW",
    },
  },
  result: {
    data: {
      validateAddress: {
        isValid: false,
        message: "Address could not be validated",
      },
    },
  },
};

// Mock error response
export const errorMock = {
  request: {
    query: VALIDATE_ADDRESS,
    variables: {
      postcode: "5000",
      suburb: "Error",
      state: "SA",
    },
  },
  error: new Error("An error occurred"),
};
