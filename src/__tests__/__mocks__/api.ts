import { LocalitiesAPI } from "../../services/addressValidation/api";

export class MockLocalitiesAPI extends LocalitiesAPI {
  constructor() {
    super("https://mock-url.com", "mock-token");
  }

  getLocalities = jest.fn();
}
