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

  async getLocalities(
    suburb: string,
    state: string
  ): Promise<LocalitiesResponse> {
    return this.get<LocalitiesResponse>(
      "", // Base path
      {
        params: {
          q: suburb,
          state: state,
        },
      }
    );
  }
}
