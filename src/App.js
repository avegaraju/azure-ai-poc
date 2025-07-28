import { useState } from 'react';
import './App.css';
import { searchAzure } from './searchAzure';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const data = await searchAzure(query);
    setResults(data);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Azure AI Search POC</h1>
        <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search query"
          />
          <button type="submit">Search</button>
        </form>
        <ul style={{ textAlign: 'left' }}>
          {results.map((r, idx) => (
            <li key={idx}>{r['@search.score']}: {r.content || JSON.stringify(r)}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
