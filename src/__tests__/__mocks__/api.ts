import { LocalitiesAPI } from "../../services/addressValidation/api";
// Create a mock class extending the real implementation
export class MockLocalitiesAPI extends LocalitiesAPI {
  constructor() {
    super("https://mock-url.com", "mock-token");
  }

  getLocalities = jest.fn();
}
