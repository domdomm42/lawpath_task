import { AugmentedRequest, RESTDataSource } from "@apollo/datasource-rest";
import { LocalitiesResponse } from "./types";

export class LocalitiesAPI extends RESTDataSource {
  constructor(baseURL: string, private authToken: string) {
    super();
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
    return this.get<LocalitiesResponse>("", {
      params: {
        q: suburb,
        state: state,
      },
    });
  }
}
