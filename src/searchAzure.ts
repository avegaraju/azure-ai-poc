interface SearchResult {
  "@search.score": number;
  "@search.rerankerScore": number;
  "@search.captions": Array<{
    text: string;
    highlights: string;
  }>;
  videoId: string;
  title: string;
  description: string;
  transcript: string;
  people: string[];
  keywords: string[];
  topics: string[];
  labels: string[];
  language: string;
  durationInSeconds: number | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  url: string | null;
}

interface SearchResponse {
  "@odata.context": string;
  "@search.answers": any[];
  value: SearchResult[];
}

export async function searchAzure(query: string): Promise<SearchResponse> {
  const apiKey = process.env.REACT_APP_AZURE_SEARCH_API_KEY;
  const apiUrl = process.env.REACT_APP_AZURE_SEARCH_API_URL;
  const index = process.env.REACT_APP_AZURE_SEARCH_INDEX;
  const apiVersion = process.env.REACT_APP_AZURE_SEARCH_API_VERSION;

  if (!apiKey || !apiUrl || !index) {
    console.error("Azure Search configuration missing");
    return { "@odata.context": "", "@search.answers": [], value: [] };
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
    return { "@odata.context": "", "@search.answers": [], value: [] };
  }

  return await response.json();
}
