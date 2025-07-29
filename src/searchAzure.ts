export interface SearchResult {
  "@search.score": number;
  content?: string;
  [key: string]: any;
}

export interface SearchResponse {
  "@odata.context": string;
  value: SearchResult[];
  [key: string]: any;
}

import { optimizeIndexFromResults } from "./optimizeIndex";

export async function searchAzure(query: string): Promise<SearchResponse> {
  const apiKey = process.env.REACT_APP_AZURE_SEARCH_API_KEY;
  const apiUrl = process.env.REACT_APP_AZURE_SEARCH_API_URL;
  const index = process.env.REACT_APP_AZURE_SEARCH_INDEX;
  const apiVersion = process.env.REACT_APP_AZURE_SEARCH_API_VERSION;

  if (!apiKey || !apiUrl || !index) {
    console.error("Azure Search configuration missing");
    return { "@odata.context": "", value: [] };
  }

  const url = `${apiUrl}/indexes/${index}/docs?api-version=${apiVersion}&search=${encodeURIComponent(
    query
  )}`;

  const response = await fetch(url, {
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Search request failed", await response.text());
    return { "@odata.context": "", value: [] };
  }

  const data = (await response.json()) as SearchResponse;
  optimizeIndexFromResults(data.value);
  return data;
}
