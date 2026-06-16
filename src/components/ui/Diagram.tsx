"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  type Edge,
  type Node,
} from "reactflow";
import dagre from "@dagrejs/dagre";
import "reactflow/dist/style.css";
import type { Graph } from "@/lib/analysis/types";

const NODE_W = 150;
const NODE_H = 40;

function toReactFlow(graph: Graph): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", nodesep: 36, ranksep: 56 });
  g.setDefaultEdgeLabel(() => ({}));

  graph.nodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }));
  graph.edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);

  const nodes: Node[] = graph.nodes.map((n) => {
    const { x, y } = g.node(n.id);
    return {
      id: n.id,
      data: { label: n.label },
      position: { x: x - NODE_W / 2, y: y - NODE_H / 2 },
      style: {
        width: NODE_W,
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.25)",
        background: "#13151b",
        color: "#e6e9ef",
        fontFamily: "ui-monospace, monospace",
        fontSize: 13,
      },
    };
  });

  const edges: Edge[] = graph.edges.map((e, i) => ({
    id: `e${i}`,
    source: e.source,
    target: e.target,
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: "#9aa3b2" },
    style: { stroke: "rgba(255,255,255,0.35)" },
  }));

  return { nodes, edges };
}

export default function Diagram({
  graph,
  emptyLabel,
}: {
  graph: Graph;
  emptyLabel: string;
}) {
  const { nodes, edges } = useMemo(() => toReactFlow(graph), [graph]);

  if (graph.nodes.length === 0) {
    return (
      <div className="grid place-items-center h-full text-sm text-muted">
        {emptyLabel}
      </div>
    );
  }

  return (
    <ReactFlow nodes={nodes} edges={edges} fitView minZoom={0.2}>
      <Background color="rgba(255,255,255,0.06)" gap={20} />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}
