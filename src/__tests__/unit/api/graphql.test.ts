import { ApolloServer } from "@apollo/server";
import { typeDefs } from "@/app/api/graphql/schema";
import { resolvers } from "@/app/api/graphql/resolvers";
import {
  mockValidLocality,
  mockPartialLocality,
  mockEmptyLocality,
} from "@/__tests__/__mocks__/data/addressValidation";
import {
  VALIDATE_ADDRESS_QUERY,
  INVALID_ADDRESS_QUERY,
} from "@/__tests__/__mocks__/queries/addressValidation";
import { MockLocalitiesAPI } from "@/__tests__/__mocks__/api";

type TestContext = {
  dataSources: {
    localities: MockLocalitiesAPI;
  };
};

type ValidationResult = {
  isValid: boolean;
  message: string;
};

type ValidateAddressResponse = {
  validateAddress: ValidationResult;
};

describe("GraphQL Address Validation unit test", () => {
  let server: ApolloServer<TestContext>;
  let mockLocalitiesAPI: MockLocalitiesAPI;

  //-------------------------------------------------------------------------
  // SETUP & TEARDOWN
  //-------------------------------------------------------------------------
  beforeEach(async () => {
    mockLocalitiesAPI = new MockLocalitiesAPI();

    server = new ApolloServer<TestContext>({
      typeDefs,
      resolvers,
    });

    await server.start();
  });

  // Clear mock and close our mock apollo server
  afterEach(async () => {
    await server.stop();
    jest.clearAllMocks();
  });

  //-------------------------------------------------------------------------
  // SUCCESS CASES
  //-------------------------------------------------------------------------
  describe("Success cases", () => {
    it("should validate a correct Sydney address", async () => {
      // Mock valid response
      mockLocalitiesAPI.getLocalities.mockResolvedValueOnce(mockValidLocality);

      const result = await server.executeOperation(
        {
          query: VALIDATE_ADDRESS_QUERY,
          variables: { postcode: "2000", suburb: "SYDNEY", state: "NSW" },
        },
        {
          contextValue: {
            dataSources: {
              localities: mockLocalitiesAPI,
            },
          },
        }
      );

      expect(result.body.kind).toBe("single");
      if (result.body.kind === "single") {
        const data = result.body.singleResult.data as ValidateAddressResponse;
        expect(data.validateAddress.isValid).toBe(true);
        expect(data.validateAddress.message).toBe(
          "The postcode, suburb, and state input are valid."
        );
      }
    });

    //-------------------------------------------------------------------------
    // PARTIAL MATCH CASES
    //-------------------------------------------------------------------------
    describe("Partial match cases", () => {
      it("should reject partial suburb name", async () => {
        // Replace fetch mock with MockLocalitiesAPI
        mockLocalitiesAPI.getLocalities.mockResolvedValueOnce(
          mockPartialLocality
        );

        // Execute query
        const result = await server.executeOperation(
          {
            query: INVALID_ADDRESS_QUERY,
            variables: {
              postcode: "2007",
              suburb: "Broadw",
              state: "NSW",
            },
          },
          {
            contextValue: {
              dataSources: {
                localities: mockLocalitiesAPI,
              },
            },
          }
        );

        // Assert results
        expect(result.body.kind).toBe("single");
        if (result.body.kind === "single") {
          const data = result.body.singleResult.data as {
            validateAddress: { isValid: boolean; message: string };
          };
          expect(data.validateAddress).toEqual({
            isValid: false,
            message:
              "The suburb Broadw does not exist in the state New South Wales (NSW)",
          });
        }

        // Verify API was called correctly with MockLocalitiesAPI
        expect(mockLocalitiesAPI.getLocalities).toHaveBeenCalledWith(
          "Broadw",
          "NSW"
        );
      });
    });

    //-------------------------------------------------------------------------
    // ERROR CASES
    //-------------------------------------------------------------------------
    describe("Error cases", () => {
      it("should handle API errors gracefully", async () => {
        // Replace fetch mock with MockLocalitiesAPI
        mockLocalitiesAPI.getLocalities.mockRejectedValueOnce(
          new Error("Network error")
        );

        // Execute query
        const result = await server.executeOperation(
          {
            query: VALIDATE_ADDRESS_QUERY,
            variables: {
              postcode: "2000",
              suburb: "SYDNEY",
              state: "NSW",
            },
          },
          {
            contextValue: {
              dataSources: {
                localities: mockLocalitiesAPI,
              },
            },
          }
        );

        // Assert results
        expect(result.body.kind).toBe("single");
        if (result.body.kind === "single") {
          const data = result.body.singleResult.data as {
            validateAddress: { isValid: boolean; message: string };
          };
          expect(data.validateAddress).toEqual({
            isValid: false,
            message: "Validation error: Network error",
          });
        }
      });

      it("should handle empty results", async () => {
        // Setup mock empty response
        mockLocalitiesAPI.getLocalities.mockResolvedValueOnce(
          mockEmptyLocality
        );

        // Execute query
        const result = await server.executeOperation(
          {
            query: VALIDATE_ADDRESS_QUERY,
            variables: {
              postcode: "9999",
              suburb: "NONEXISTENT",
              state: "NSW",
            },
          },
          {
            contextValue: {
              dataSources: {
                localities: mockLocalitiesAPI,
              },
            },
          }
        );

        // Assert results
        expect(result.body.kind).toBe("single");
        if (result.body.kind === "single") {
          const data = result.body.singleResult.data as {
            validateAddress: { isValid: boolean; message: string };
          };
          expect(data.validateAddress.isValid).toBe(false);
          expect(data.validateAddress.message).toContain(
            "The suburb NONEXISTENT does not exist in the state New South Wales (NSW)"
          );
        }

        // Verify API was called correctly
        expect(mockLocalitiesAPI.getLocalities).toHaveBeenCalledWith(
          "NONEXISTENT",
          "NSW"
        );
      });
    });
  });
});
