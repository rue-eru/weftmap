"use client";

import { useEffect, useState } from "react";
import Diagram from "./Diagram";
import type { Graph } from "@/lib/analysis/types";

const LANGUAGES = ["python", "javascript"];

const SAMPLE = `def main():
    data = load()
    save(transform(data))

def load():
    return read()

def transform(data):
    return clean(data)

def clean(data):
    return data

def save(x):
    write(x)

main()
`;

type Props = {
  languageLabel: string;
  analyzeLabel: string;
  analyzingLabel: string;
  inputPlaceholder: string;
  diagramPlaceholder: string;
  noFunctions: string;
};

export default function CodeTool({
  languageLabel,
  analyzeLabel,
  analyzingLabel,
  inputPlaceholder,
  diagramPlaceholder,
  noFunctions,
}: Props) {
  const [code, setCode] = useState(SAMPLE);
  const [language, setLanguage] = useState("python");
  const [graph, setGraph] = useState<Graph | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      setGraph(data as Graph);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setGraph(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    analyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid lg:grid-cols-2 gap-4 p-4 md:p-6 lg:h-[calc(100vh-65px)]">
      <div className="flex flex-col min-h-[420px] lg:min-h-0 rounded-2xl border border-white/[0.08] bg-[#13151b] overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.08]">
          <label className="flex items-center gap-2 text-sm text-muted">
            {languageLabel}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-lg border border-white/10 bg-[#0c0d12] px-2.5 py-1.5 text-sm text-[#e6e9ef] outline-none focus-visible:border-white/30"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={analyze}
            disabled={isLoading}
            className="metallic-fill rounded-full px-5 py-2 text-sm font-semibold cursor-pointer transition hover:-translate-y-px disabled:opacity-60 disabled:cursor-default disabled:translate-y-0"
          >
            {isLoading ? analyzingLabel : analyzeLabel}
          </button>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          placeholder={inputPlaceholder}
          className="flex-1 resize-none bg-transparent p-4 font-mono text-[13px] leading-[1.7] text-[#cbd5e1] outline-none"
        />
      </div>

      <div className="relative min-h-[460px] lg:min-h-0 lg:h-full rounded-2xl border border-white/[0.08] bg-black overflow-hidden">
        {error ? (
          <div className="grid place-items-center h-full px-6 text-center text-sm text-red-400">
            {error}
          </div>
        ) : graph ? (
          <Diagram graph={graph} emptyLabel={noFunctions} />
        ) : (
          <div className="grid place-items-center h-full text-sm text-muted">
            {diagramPlaceholder}
          </div>
        )}
      </div>
    </div>
  );
}
