import { AugmentedRequest, RESTDataSource } from "@apollo/datasource-rest";
import { LocalitiesResponse } from "./types";
import { KeyValueCache } from "@apollo/utils.keyvaluecache";
import { GraphQLError } from "graphql";

/**
 * REST data source for Australia Post Localities API integration
 * Extends Apollo's RESTDataSource to handle authentication and requests
 * @class LocalitiesAPI
 * @extends {RESTDataSource}
 */
export class LocalitiesAPI extends RESTDataSource {
  /**
   * Creates an instance of LocalitiesAPI
   * @param {string} baseURL - Base URL for the Australia Post API
   * @param {string} authToken - Authentication token for the API
   * @param {object} [options] - Optional configuration including cache
   * @param {KeyValueCache} [options.cache] - Apollo cache for data storage
   */
  constructor(
    baseURL: string,
    private authToken: string,
    options?: { cache: KeyValueCache }
  ) {
    super(options);
    this.baseURL = baseURL;
  }

  /**
   * Adds authorization header to every request
   * @param {string} _path - Request path
   * @param {AugmentedRequest} request - Request object to be modified
   * @override
   */
  override willSendRequest(_path: string, request: AugmentedRequest) {
    request.headers["Authorization"] = `Bearer ${this.authToken}`;
  }

  /**
   * Queries Australia Post API for localities matching a suburb and state
   * @param {string} suburb - Suburb name to search for
   * @param {string} state - State code to search within
   * @returns {Promise<LocalitiesResponse>} Response containing matching localities
   * @throws {GraphQLError} When API fails to return data
   */
  async getLocalities(
    suburb: string,
    state: string
  ): Promise<LocalitiesResponse> {
    const res = await this.get<LocalitiesResponse>("", {
      params: {
        q: suburb,
        state: state,
      },
    });

    // Check if the response is empty or invalid
    if (!res) {
      throw new GraphQLError(
        "No data received from address validation API. The service might be rate limiting requests. Please try again.",
        {
          extensions: {
            code: "SERVICE_UNAVAILABLE",
            originalError: "No data received from address validation API",
          },
        }
      );
    }

    return res;
  }
}
