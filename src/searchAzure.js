export async function searchAzure(query) {
  const apiKey = process.env.REACT_APP_AZURE_SEARCH_API_KEY;
  const apiUrl = process.env.REACT_APP_AZURE_SEARCH_API_URL;
  const index = process.env.REACT_APP_AZURE_SEARCH_INDEX;
  const apiVersion = process.env.REACT_APP_AZURE_SEARCH_API_VERSION;

  if (!apiKey || !apiUrl || !index) {
    console.error('Azure Search configuration missing');
    return [];
  }

  const url = `${apiUrl}/indexes/${index}/docs?api-version=${apiVersion}&search=${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    console.error('Search request failed', await response.text());
    return [];
  }

  const data = await response.json();
  return data.value || [];
}
