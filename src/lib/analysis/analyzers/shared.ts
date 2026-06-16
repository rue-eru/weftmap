import type Parser from "web-tree-sitter";
import { getParser } from "../treesitter";
import type { Graph, GraphEdge } from "../types";

type Node = Parser.SyntaxNode;

const MODULE_NODE = "(module)";

export type LangSpec = {
  language: string;
  wasm: string;
  funcDefQuery: string;
  callQuery: string;
  funcDefTypes: ReadonlySet<string>;
};

function resolveName(node: Node): string | null {
  const direct = node.childForFieldName("name");
  if (direct) return direct.text;

  // JS: `const foo = () => {}` keeps the name on the variable_declarator.
  const parent = node.parent;
  if (parent && parent.type === "variable_declarator") {
    const name = parent.childForFieldName("name");
    if (name) return name.text;
  }
  return null;
}

function enclosingFunctionName(
  node: Node,
  funcDefTypes: ReadonlySet<string>,
): string {
  let current: Node | null = node.parent;
  while (current) {
    if (funcDefTypes.has(current.type)) {
      const name = resolveName(current);
      if (name) return name;
    }
    current = current.parent;
  }
  return MODULE_NODE;
}

export async function analyzeWith(
  spec: LangSpec,
  code: string,
): Promise<Graph> {
  const { parser, language } = await getParser(spec.wasm);
  const tree = parser.parse(code);
  const root = tree.rootNode;

  const defined = new Set<string>();
  const defQuery = language.query(spec.funcDefQuery);
  for (const { node } of defQuery.captures(root)) {
    const name = resolveName(node);
    if (name) defined.add(name);
  }

  const edgeKeys = new Set<string>();
  const edges: GraphEdge[] = [];
  const callQuery = language.query(spec.callQuery);
  for (const { node } of callQuery.captures(root)) {
    const callee = node.text;
    // Skip calls to builtins/libraries: only edges between defined functions.
    if (!defined.has(callee)) continue;
    const caller = enclosingFunctionName(node, spec.funcDefTypes);
    const key = `${caller} ${callee}`;
    if (edgeKeys.has(key)) continue;
    edgeKeys.add(key);
    edges.push({ source: caller, target: callee });
  }

  const ids = new Set(defined);
  if (edges.some((e) => e.source === MODULE_NODE)) ids.add(MODULE_NODE);
  const nodes = [...ids].map((id) => ({ id, label: id }));

  tree.delete();
  return { nodes, edges };
}
