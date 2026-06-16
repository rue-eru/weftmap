import { NextResponse } from "next/server";
import { getAnalyzer, SUPPORTED_LANGUAGES } from "@/lib/analysis/registry";

// Needs the Node runtime (reads .wasm from the filesystem), not Edge.
export const runtime = "nodejs";

const MAX_CODE_BYTES = 100_000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { code, language } = (body ?? {}) as {
    code?: unknown;
    language?: unknown;
  };

  if (typeof code !== "string" || code.trim() === "") {
    return NextResponse.json(
      { error: "El campo 'code' es obligatorio." },
      { status: 400 },
    );
  }
  if (Buffer.byteLength(code, "utf8") > MAX_CODE_BYTES) {
    return NextResponse.json(
      { error: `El código excede el límite de ${MAX_CODE_BYTES} bytes.` },
      { status: 413 },
    );
  }
  if (typeof language !== "string") {
    return NextResponse.json(
      { error: "El campo 'language' es obligatorio." },
      { status: 400 },
    );
  }

  const analyzer = getAnalyzer(language);
  if (!analyzer) {
    return NextResponse.json(
      {
        error: `Lenguaje no soportado: ${language}. Soportados: ${SUPPORTED_LANGUAGES.join(", ")}.`,
      },
      { status: 400 },
    );
  }

  try {
    const graph = await analyzer.analyze(code);
    return NextResponse.json(graph);
  } catch (err) {
    console.error("Error analyzing code:", err);
    return NextResponse.json(
      { error: "No se pudo analizar el código." },
      { status: 500 },
    );
  }
}
