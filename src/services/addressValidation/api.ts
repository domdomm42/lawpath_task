import { AugmentedRequest, RESTDataSource } from "@apollo/datasource-rest";
import { LocalitiesResponse } from "./types";
import { KeyValueCache } from "@apollo/utils.keyvaluecache";
export class LocalitiesAPI extends RESTDataSource {
  constructor(
    baseURL: string,
    private authToken: string,
    options?: { cache: KeyValueCache }
  ) {
    super(options);
    this.baseURL = baseURL;
  }

  override willSendRequest(_path: string, request: AugmentedRequest) {
    request.headers["Authorization"] = `Bearer ${this.authToken}`;
  }

  // Makes REST request to aus post API and return LocalitiesResponse object
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

    console.log(res);

    // Check if the response is empty or invalid
    if (!res) {
      throw new Error(
        "No data received from address validation API. The service might be rate limiting requests. Please try again."
      );
    }

    return res;
  }
}
