import { ApolloServer } from "@apollo/server";
import { typeDefs } from "../../app/api/graphql/schema";
import { createResolvers } from "../../app/api/graphql/resolvers";

describe("GraphQL Address Validation", () => {
  let server: ApolloServer;

  const mockValidLocality = {
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

  const mockPartialLocality = {
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

  const mockEmptyLocality = {
    localities: {
      locality: [],
    },
  };

  beforeEach(async () => {
    server = new ApolloServer({
      typeDefs,
      resolvers: createResolvers(
        "https://api.example.com/address",
        "test-token"
      ),
    });

    await server.start();
    global.fetch = jest.fn();
  });

  afterEach(async () => {
    await server.stop();
    jest.clearAllMocks();
  });

  it("should validate a correct Sydney address", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockValidLocality),
    });

    const VALIDATE_ADDRESS = `
      query {
        validateAddress(postcode: "2000", suburb: "SYDNEY", state: "NSW") {
          isValid
          message
        }
      }
    `;

    const result = await server.executeOperation({
      query: VALIDATE_ADDRESS,
    });

    expect(result.body.kind).toBe("single");
    if (result.body.kind === "single") {
      const data = result.body.singleResult.data;
      expect(data?.validateAddress).toEqual({
        isValid: true,
        message: "The postcode, suburb, and state input are valid.",
      });
    }

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.example.com/address?q=SYDNEY&state=NSW",
      expect.objectContaining({
        headers: { Authorization: "Bearer test-token" },
      })
    );
  });

  // If suburb is partial, i.e. Broadw, this should be invalid.
  it("Should reject partial suburb name", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPartialLocality),
    });

    const INVALID_ADDRESS_QUERY = `
      query {
        validateAddress(postcode: "2007", suburb: "Broadw", state: "NSW") {
          isValid
          message  
        } 
     }
    `;

    const res = await server.executeOperation({ query: INVALID_ADDRESS_QUERY });
    expect(res.body.kind).toBe("single");
    if (res.body.kind === "single") {
      const data = res.body.singleResult.data;
      console.log(data);
      expect(data?.validateAddress).toEqual({
        isValid: false,
        message: "The suburb Broadw does not exist in the state NSW",
      });
    }

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.example.com/address?q=Broadw&state=NSW",
      expect.objectContaining({
        headers: { Authorization: "Bearer test-token" },
      })
    );
  });
});
