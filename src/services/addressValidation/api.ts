import { LocalitiesResponse } from "./types";

// Create API Client given BaseUrl and AuthToken
export const createAPIClient = (baseUrl: string, authToken: string) => {
  // Function to fetch Locality data from API
  const fetchLocalities = async (suburb: string, state: string) => {
    const url = `${baseUrl}?q=${encodeURIComponent(
      suburb
    )}&state=${encodeURIComponent(state)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response.json() as Promise<LocalitiesResponse>;
  };

  return { fetchLocalities };
};
