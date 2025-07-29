import { useState } from "react";
import "./App.css";
import { searchAzure } from "./searchAzure";

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

function App() {
  const [query, setQuery] = useState<string>("");
  const [response, setResponse] = useState<SearchResponse | null>(null);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = await searchAzure(query);

    // Sort the results by search score
    const sortedData: SearchResponse = {
      ...data,
      "@search.answers": data["@search.answers"] || [],
      value: [...data.value].sort(
        (a, b) => b["@search.score"] - a["@search.score"]
      ),
    };

    setResponse(sortedData);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const renderTags = (items: string[]) => {
    if (!items || items.length === 0) return null;

    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginTop: "0.5rem",
        }}
      >
        {items.map((item, index) => (
          <span
            key={index}
            style={{
              backgroundColor: "#f0f0f0",
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "0.8rem",
              color: "#666",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  const renderResult = (result: SearchResult, idx: number) => {
    const isVideo = result.videoUrl !== null;

    return (
      <div
        key={idx}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          color: "#333",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            backgroundColor: isVideo ? "#ff0000" : "#0078d4",
            color: "white",
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "0.8rem",
            zIndex: 1,
          }}
        >
          {isVideo ? "VIDEO" : "ARTICLE"}
        </div>

        {result.thumbnailUrl && (
          <div style={{ position: "relative", paddingBottom: "56.25%" }}>
            <img
              src={result.thumbnailUrl}
              alt={result.title}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            {isVideo && result.durationInSeconds && (
              <span
                style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "8px",
                  backgroundColor: "rgba(0,0,0,0.8)",
                  color: "white",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                }}
              >
                {formatDuration(result.durationInSeconds)}
              </span>
            )}
          </div>
        )}

        <div
          style={{
            padding: "1rem",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>
            <h3
              style={{
                margin: "0 0 0.5rem 0",
                fontSize: "1.1rem",
                color: "#333",
              }}
            >
              {result.title}
            </h3>

            {result.people && result.people.length > 0 && (
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#666",
                  marginBottom: "0.5rem",
                }}
              >
                By {result.people.join(", ")}
              </div>
            )}

            <p
              style={{
                margin: "0 0 0.5rem 0",
                fontSize: "0.9rem",
                color: "#666",
                display: "-webkit-box",
                WebkitLineClamp: "3",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {result.description}
            </p>

            {renderTags(result.keywords)}
            {result.topics &&
              result.topics.length > 0 &&
              renderTags(result.topics)}
          </div>

          <div
            style={{
              marginTop: "auto",
              paddingTop: "1rem",
              fontSize: "0.8rem",
              color: "#666",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Score: {result["@search.score"].toFixed(2)}</span>
            {result.language && <span>{result.language}</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Azure AI Search POC</h1>
        <form onSubmit={handleSearch} style={{ marginBottom: "2rem" }}>
          <input
            type="text"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            placeholder="Enter search query"
            style={{
              padding: "0.5rem",
              marginRight: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "300px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#0078d4",
              color: "white",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </form>

        <div style={{ width: "100%", maxWidth: "1200px" }}>
          {response?.value.length === 0 ? (
            <p>No results found</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "2rem",
                padding: "1rem",
              }}
            >
              {response?.value.map((result, idx) => renderResult(result, idx))}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
