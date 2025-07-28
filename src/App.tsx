import { useState } from "react";
import "./App.css";
import { searchAzure } from "./searchAzure";

interface SearchResult {
  "@search.score": number;
  content?: string;
  [key: string]: any;
}

interface SearchResponse {
  "@odata.context": string;
  value: SearchResult[];
  [key: string]: any;
}

function App() {
  const [query, setQuery] = useState<string>("");
  const [response, setResponse] = useState<SearchResponse | null>(null);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = await searchAzure(query);
    setResponse(data);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Azure AI Search POC</h1>
        <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            placeholder="Enter search query"
          />
          <button type="submit">Search</button>
        </form>

        {response?.value.length === 0 ? (
          <p>No results found</p>
        ) : (
          <ul style={{ textAlign: "left" }}>
            {response?.value.map((r, idx) => (
              <li key={idx}>
                {r["@search.score"]}: {r.content || JSON.stringify(r)}
              </li>
            ))}
          </ul>
        )}

        {response && (
          <div style={{ marginTop: "2rem", textAlign: "left", width: "100%" }}>
            <h3>Raw Response:</h3>
            <pre
              style={{
                backgroundColor: "#282c34",
                padding: "1rem",
                borderRadius: "4px",
                overflowX: "auto",
                fontSize: "0.9rem",
              }}
            >
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
