export default function HeroPreview() {
  return (
    <div
      className="flex flex-col items-center w-full max-w-[380px] mx-auto"
      aria-hidden="true"
    >
      <div className="js-card w-full rounded-xl border border-white/10 bg-surface shadow-[0_24px_70px_rgba(0,0,0,0.55)] overflow-hidden">
        <div className="flex gap-1.5 px-3 py-2.5 border-b border-white/[0.08]">
          <span className="w-[11px] h-[11px] rounded-full bg-[#ff5f57]" />
          <span className="w-[11px] h-[11px] rounded-full bg-[#febc2e]" />
          <span className="w-[11px] h-[11px] rounded-full bg-[#28c840]" />
        </div>
        <pre className="m-0 px-[18px] py-4 font-mono text-[13.5px] leading-[1.8] text-[#cbd5e1]">
          <span className="text-[#8aa0bd]">def</span>{" "}
          <span className="text-white font-semibold">main</span>():{"\n"}
          {"    "}
          <span className="text-white font-semibold">load</span>(){"\n"}
          {"    "}
          <span className="text-white font-semibold">save</span>()
        </pre>
      </div>

      <svg
        className="js-connector my-3.5 text-white/40"
        width="24"
        height="34"
        viewBox="0 0 24 34"
        fill="none"
      >
        <path d="M12 0 V26" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M5 21 L12 30 L19 21"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <svg className="w-full h-auto" viewBox="0 0 320 150" fill="none">
        <defs>
          <marker
            id="cv-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill="rgba(255,255,255,0.5)" />
          </marker>
        </defs>

        <path
          className="edge-flow js-edge"
          d="M160 46 C 130 70, 95 80, 72 100"
          markerEnd="url(#cv-arrow)"
        />
        <path
          className="edge-flow js-edge"
          d="M160 46 C 190 70, 225 80, 248 100"
          markerEnd="url(#cv-arrow)"
        />

        <g className="js-node-main">
          <rect
            className="fill-[#161b26] stroke-[rgba(255,255,255,0.5)]"
            x="110"
            y="12"
            width="100"
            height="34"
            rx="9"
          />
          <text
            className="fill-[#e6e9ef] font-mono text-[13px]"
            x="160"
            y="29"
            textAnchor="middle"
            dominantBaseline="central"
          >
            main
          </text>
        </g>
        <g className="js-node-child">
          <rect
            className="fill-[#11141c] stroke-[rgba(255,255,255,0.22)]"
            x="20"
            y="104"
            width="100"
            height="34"
            rx="9"
          />
          <text
            className="fill-[#e6e9ef] font-mono text-[13px]"
            x="70"
            y="121"
            textAnchor="middle"
            dominantBaseline="central"
          >
            load
          </text>
        </g>
        <g className="js-node-child">
          <rect
            className="fill-[#11141c] stroke-[rgba(255,255,255,0.22)]"
            x="200"
            y="104"
            width="100"
            height="34"
            rx="9"
          />
          <text
            className="fill-[#e6e9ef] font-mono text-[13px]"
            x="250"
            y="121"
            textAnchor="middle"
            dominantBaseline="central"
          >
            save
          </text>
        </g>
      </svg>
    </div>
  );
}
