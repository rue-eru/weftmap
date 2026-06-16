export type GraphNode = {
  id: string;
  label: string;
};

export type GraphEdge = {
  source: string;
  target: string;
};

export type Graph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export interface LanguageAnalyzer {
  language: string;
  analyze(code: string): Promise<Graph>;
}
