import type { LanguageAnalyzer } from "./types";
import { pythonAnalyzer } from "./analyzers/python";
import { javascriptAnalyzer } from "./analyzers/javascript";

const analyzers: LanguageAnalyzer[] = [pythonAnalyzer, javascriptAnalyzer];

const registry = new Map(analyzers.map((a) => [a.language, a]));

export const SUPPORTED_LANGUAGES = [...registry.keys()];

export function getAnalyzer(language: string): LanguageAnalyzer | undefined {
  return registry.get(language);
}
