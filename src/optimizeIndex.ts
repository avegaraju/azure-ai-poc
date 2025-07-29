export interface OptimizedKeywords {
  keywords: string[];
}

export function optimizeIndexFromResults(results: { content?: string }[]): OptimizedKeywords {
  const termFreq: Record<string, number> = {};

  for (const r of results) {
    const text = r.content || "";
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    for (const w of words) {
      termFreq[w] = (termFreq[w] || 0) + 1;
    }
  }

  const keywords = Object.entries(termFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);

  if (typeof localStorage !== "undefined") {
    localStorage.setItem("optimizedKeywords", JSON.stringify(keywords));
  }

  return { keywords };
}
