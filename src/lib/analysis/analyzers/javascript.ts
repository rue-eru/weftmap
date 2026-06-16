import type { LanguageAnalyzer } from "../types";
import { analyzeWith, type LangSpec } from "./shared";

// Covers JS and most TS; heavy TS annotations will need tree-sitter-typescript.
const spec: LangSpec = {
  language: "javascript",
  wasm: "tree-sitter-javascript.wasm",
  funcDefQuery: `
    [
      (function_declaration)
      (generator_function_declaration)
      (function_expression)
      (arrow_function)
      (method_definition)
    ] @def
  `,
  callQuery: `
    (call_expression function: (identifier) @callee)
    (call_expression function: (member_expression property: (property_identifier) @callee))
  `,
  funcDefTypes: new Set([
    "function_declaration",
    "generator_function_declaration",
    "function_expression",
    "arrow_function",
    "method_definition",
  ]),
};

export const javascriptAnalyzer: LanguageAnalyzer = {
  language: spec.language,
  analyze: (code) => analyzeWith(spec, code),
};
