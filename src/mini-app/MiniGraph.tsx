import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import {
  ChevronDown,
  Filter,
  LocateFixed,
  Pencil,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { GRAPH_EDGES, GRAPH_NODES, type GraphNode } from "./demoData";

type SimNode = GraphNode & d3.SimulationNodeDatum;
type SimLink = d3.SimulationLinkDatum<SimNode> & {
  source: string | SimNode;
  target: string | SimNode;
};

function masteryFill(combined: number | null): string {
  if (combined == null || combined === 0) return "var(--bg-secondary)";
  if (combined >= 100) return "var(--accent)";
  return `color-mix(in srgb, var(--accent) ${combined}%, var(--bg-secondary))`;
}

function nodeRadius(kind: GraphNode["kind"]) {
  if (kind === "space") return 14;
  if (kind === "document") return 10;
  return 7;
}

function labelFont(kind: GraphNode["kind"]) {
  if (kind === "space") return 13;
  if (kind === "document") return 12;
  return 11;
}

export default function MiniGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const svgSelRef = useRef<d3.Selection<SVGSVGElement, unknown, null, undefined> | null>(
    null
  );
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
  const focusedIdRef = useRef<string | null>("st-enl");
  const dragMovedRef = useRef(false);

  const [search, setSearch] = useState("");
  const [focusedId, setFocusedId] = useState<string | null>("st-enl");
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [filterNew, setFilterNew] = useState(false);
  const [tick, setTick] = useState(0);

  focusedIdRef.current = focusedId;

  const nodesById = useMemo(() => {
    void tick;
    const sim = simulationRef.current;
    const live = sim?.nodes() ?? [];
    if (live.length) {
      return new Map(live.map((n) => [n.id, n]));
    }
    return new Map(GRAPH_NODES.map((n) => [n.id, n as SimNode]));
  }, [tick]);

  const focused = (focusedId && nodesById.get(focusedId)) || null;

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return GRAPH_NODES.filter((n) => n.label.toLowerCase().includes(q)).slice(0, 6);
  }, [search]);

  const connected = useMemo(() => {
    if (!focused) return [];
    const ids = new Set<string>();
    for (const [a, b] of GRAPH_EDGES) {
      if (a === focused.id) ids.add(b);
      if (b === focused.id) ids.add(a);
    }
    return [...ids]
      .map((id) => nodesById.get(id))
      .filter((n): n is SimNode => !!n);
  }, [focused, nodesById]);

  const centerGraph = () => {
    const svg = svgSelRef.current;
    const zoom = zoomRef.current;
    const el = containerRef.current;
    if (!svg || !zoom || !el) return;
    const { width, height } = el.getBoundingClientRect();
    svg
      .transition()
      .duration(450)
      .ease(d3.easeCubicOut)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(0.95)
      );
  };

  const focusNode = (id: string) => {
    setFocusedId(id);
    const node = simulationRef.current?.nodes().find((n) => n.id === id);
    const svg = svgSelRef.current;
    const zoom = zoomRef.current;
    const el = containerRef.current;
    if (!node || node.x == null || node.y == null || !svg || !zoom || !el) return;
    const { width, height } = el.getBoundingClientRect();
    const scale = 1.6;
    svg
      .transition()
      .duration(450)
      .ease(d3.easeCubicOut)
      .call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2 - scale * node.x, height / 2 - scale * node.y)
          .scale(scale)
      );
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    const svgEl = svgRef.current;
    if (!container || !svgEl) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 480;

    const nodes: SimNode[] = GRAPH_NODES.map((n) => ({
      ...n,
      x: ((n.x - 50) / 50) * Math.min(width, height) * 0.42,
      y: ((n.y - 50) / 50) * Math.min(width, height) * 0.42,
    }));
    const links: SimLink[] = GRAPH_EDGES.map(([source, target]) => ({
      source,
      target,
    }));

    const g = svg.append("g").attr("class", "graph-root");
    const linkG = g.append("g").attr("class", "graph-links");
    const nodeG = g.append("g").attr("class", "graph-nodes");
    const labelG = g.append("g").attr("class", "graph-labels");

    const simulation = d3
      .forceSimulation<SimNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance((e) => {
            const s = e.source as SimNode;
            const t = e.target as SimNode;
            if (s.kind === "space" || t.kind === "space") return 110;
            if (s.kind === "document" || t.kind === "document") return 90;
            return 70;
          })
          .strength(0.7)
      )
      .force("charge", d3.forceManyBody().strength(-420))
      .force(
        "collide",
        d3
          .forceCollide<SimNode>()
          .radius((d) => nodeRadius(d.kind) + 18)
          .iterations(2)
      )
      .force("center", d3.forceCenter(0, 0))
      .force("x", d3.forceX(0).strength(0.04))
      .force("y", d3.forceY(0).strength(0.04))
      .alpha(0.9)
      .alphaDecay(0.028);

    simulationRef.current = simulation;

    const link = linkG
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "var(--text-primary)")
      .attr("stroke-opacity", 0.22)
      .attr("stroke-width", 1.25);

    const node = nodeG
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("class", "graph-node")
      .attr("r", (d) => nodeRadius(d.kind))
      .attr("fill", (d) => masteryFill(d.mastery))
      .attr("stroke", (d) =>
        d.mastery == null ? "var(--text-secondary)" : "var(--bg-primary)"
      )
      .attr("stroke-width", (d) => (d.mastery == null ? 1.5 : 1.1))
      .attr("cursor", "grab")
      .style("touch-action", "none");

    const labels = labelG
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => d.label)
      .attr("font-size", (d) => labelFont(d.kind))
      .attr("font-weight", (d) =>
        d.kind === "space" || d.kind === "document" ? 500 : 400
      )
      .attr("fill", "var(--text-primary)")
      .attr("fill-opacity", 0.82)
      .attr("dx", (d) => nodeRadius(d.kind) + 6)
      .attr("dy", "0.35em")
      .style("pointer-events", "none")
      .style("font-family", "var(--font-sans)");

    const paint = () => {
      const fid = focusedIdRef.current;
      const neighbors = new Set<string>();
      if (fid) {
        for (const [a, b] of GRAPH_EDGES) {
          if (a === fid) neighbors.add(b);
          if (b === fid) neighbors.add(a);
        }
      }

      link
        .attr("x1", (d) => (d.source as SimNode).x ?? 0)
        .attr("y1", (d) => (d.source as SimNode).y ?? 0)
        .attr("x2", (d) => (d.target as SimNode).x ?? 0)
        .attr("y2", (d) => (d.target as SimNode).y ?? 0)
        .attr("stroke-opacity", (d) => {
          if (!fid) return 0.22;
          const s = (d.source as SimNode).id;
          const t = (d.target as SimNode).id;
          return s === fid || t === fid ? 0.45 : 0.08;
        });

      node
        .attr("cx", (d) => d.x ?? 0)
        .attr("cy", (d) => d.y ?? 0)
        .attr("r", (d) =>
          d.id === fid ? nodeRadius(d.kind) + 3 : nodeRadius(d.kind)
        )
        .attr("opacity", (d) => {
          if (!fid) return 1;
          return d.id === fid || neighbors.has(d.id) ? 1 : 0.28;
        });

      labels
        .attr("x", (d) => d.x ?? 0)
        .attr("y", (d) => d.y ?? 0)
        .attr("opacity", (d) => {
          if (!fid) return 1;
          if (d.id === fid || neighbors.has(d.id)) return 1;
          return d.kind === "subtopic" ? 0 : 0.35;
        });
    };

    const drag = d3
      .drag<SVGCircleElement, SimNode>()
      .on("start", (event, d) => {
        dragMovedRef.current = false;
        d.fx = d.x;
        d.fy = d.y;
        if (!event.active && !reduceMotion) simulation.alphaTarget(0.28).restart();
      })
      .on("drag", (event, d) => {
        if (Math.abs(event.dx) + Math.abs(event.dy) > 1) dragMovedRef.current = true;
        const transform = d3.zoomTransform(svgEl);
        d.fx = (d.fx ?? d.x ?? 0) + event.dx / transform.k;
        d.fy = (d.fy ?? d.y ?? 0) + event.dy / transform.k;
        d.x = d.fx;
        d.y = d.fy;
        if (reduceMotion) paint();
      })
      .on("end", (event, d) => {
        if (!event.active && !reduceMotion) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        setTick((n) => n + 1);
      });

    node.call(drag);

    node.on("click", (event, d) => {
      event.stopPropagation();
      if (dragMovedRef.current) return;
      setFocusedId(d.id);
      focusedIdRef.current = d.id;
      const el = containerRef.current;
      const zoomBehavior = zoomRef.current;
      if (el && zoomBehavior && d.x != null && d.y != null) {
        const { width: w, height: h } = el.getBoundingClientRect();
        const scale = 1.6;
        svg
          .transition()
          .duration(reduceMotion ? 0 : 450)
          .ease(d3.easeCubicOut)
          .call(
            zoomBehavior.transform,
            d3.zoomIdentity
              .translate(w / 2 - scale * d.x, h / 2 - scale * d.y)
              .scale(scale)
          );
      }
      setTick((n) => n + 1);
    });

    svg.on("click", () => {
      if (dragMovedRef.current) return;
      setFocusedId(null);
      focusedIdRef.current = null;
      setTick((n) => n + 1);
    });

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.35, 2.8])
      .filter((event) => {
        if (event.type === "wheel") return true;
        const target = event.target as Element | null;
        // Let node drag own pointer events; background pans the map.
        return !(target instanceof Element && target.closest("circle.graph-node"));
      })
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString());
      });

    svg.call(zoom);
    // Don't let wheel events bubble to the landing page Lenis scroll.
    svg.on("wheel", (event) => event.stopPropagation());

    const initial = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(0.95);
    svg.call(zoom.transform, initial);

    zoomRef.current = zoom;
    svgSelRef.current = svg;

    paint();
    if (reduceMotion) {
      simulation.stop();
      simulation.tick(120);
      paint();
      setTick((n) => n + 1);
    } else {
      simulation.on("tick", () => {
        paint();
      });
      simulation.on("end", () => setTick((n) => n + 1));
    }

    const ro = new ResizeObserver(() => {
      // Keep current transform; physics already centered at 0,0.
      setTick((n) => n + 1);
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      simulation.stop();
      simulationRef.current = null;
      zoomRef.current = null;
      svgSelRef.current = null;
      svg.on(".zoom", null);
      svg.selectAll("*").remove();
    };
    // Mount once for the demo graph dataset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Refresh opacity/radius when focus changes without remounting the sim.
    const sim = simulationRef.current;
    if (!sim) return;
    sim.restart();
    sim.alpha(0.05);
    setTick((n) => n + 1);
  }, [focusedId]);

  return (
    <div
      ref={containerRef}
      className="relative h-full overflow-hidden bg-[var(--bg-secondary)]"
      data-lenis-prevent
    >
      <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex items-start justify-between gap-3 md:inset-x-6 md:top-5">
        <div className="pointer-events-auto relative w-full max-w-xs">
          <div className="relative flex items-center">
            <Search
              size={15}
              className="absolute left-3 text-[var(--text-secondary)]"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search concepts"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] py-2 pr-3 pl-9 text-[12px] text-[var(--text-primary)] shadow-sm outline-none placeholder:text-[var(--text-tertiary)] focus:border-[var(--text-secondary)]"
            />
          </div>
          {search.trim().length > 0 && (
            <div className="absolute top-full right-0 left-0 z-30 mt-2 max-h-56 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--card-bg)] py-1 shadow-xl">
              {searchResults.length === 0 ? (
                <div className="px-3 py-2.5 text-[12px] text-[var(--text-secondary)]">
                  No results
                </div>
              ) : (
                searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => {
                      focusNode(result.id);
                      setSearch("");
                    }}
                    className="flex w-full flex-col px-3 py-2 text-left hover:bg-[var(--bg-secondary)]"
                  >
                    <span className="text-[12px] font-medium text-[var(--text-primary)]">
                      {result.label}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)]">
                      World History · {result.kind}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="pointer-events-auto flex shrink-0 items-center gap-1.5">
          <div className="relative">
            <button
              type="button"
              onClick={() => setSpaceOpen((v) => !v)}
              className="font-nav flex max-w-[10rem] items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-2.5 py-2 text-[12px] font-medium text-[var(--text-primary)] shadow-sm"
            >
              <span className="truncate">World History</span>
              <ChevronDown size={14} className="shrink-0 text-[var(--text-secondary)]" />
            </button>
            {spaceOpen && (
              <div className="absolute top-full right-0 z-30 mt-2 w-52 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card-bg)] py-1 shadow-xl">
                <button
                  type="button"
                  onClick={() => setSpaceOpen(false)}
                  className="flex w-full items-center justify-between bg-[var(--bg-secondary)] px-3 py-2 text-left"
                >
                  <span className="font-nav text-[12px]">World History</span>
                  <span className="text-[10px] text-[var(--text-secondary)]">Ready</span>
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            aria-label="Rebuild map"
            onClick={() => {
              const sim = simulationRef.current;
              if (!sim) return;
              sim.nodes().forEach((n) => {
                n.fx = null;
                n.fy = null;
              });
              sim.alpha(0.85).restart();
            }}
            className="flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-2 text-[var(--text-primary)] shadow-sm"
          >
            <RefreshCw size={16} />
          </button>
          <button
            type="button"
            aria-label="Center graph"
            onClick={centerGraph}
            className="flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-2 text-[var(--text-primary)] shadow-sm"
          >
            <LocateFixed size={16} />
          </button>
          <button
            type="button"
            onClick={() => setFilterNew((v) => !v)}
            aria-label="Filter"
            className={`flex items-center justify-center rounded-xl border p-2 shadow-sm transition-colors ${
              filterNew
                ? "border-[var(--text-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                : "border-[var(--border)] bg-[var(--card-bg)] text-[var(--text-primary)]"
            }`}
          >
            <Filter size={16} />
          </button>
          <button
            type="button"
            aria-label="Edit layout"
            className="hidden items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-2 text-[var(--text-primary)] shadow-sm sm:flex"
          >
            <Pencil size={16} />
          </button>
        </div>
      </div>

      <svg ref={svgRef} className="h-full w-full touch-none" />

      <div className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]/95 px-3 py-2.5 text-[10px] text-[var(--text-secondary)] shadow-sm backdrop-blur-sm md:bottom-5 md:left-5">
        <p className="font-nav mb-1.5 text-[11px] font-semibold text-[var(--text-primary)]">
          Mastery
        </p>
        <ul className="space-y-1">
          <li className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full border border-[var(--text-secondary)]"
              style={{ background: masteryFill(null) }}
            />
            No practice yet
          </li>
          {[0, 50, 100].map((pct) => (
            <li key={pct} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full border border-[var(--bg-primary)]"
                style={{ background: masteryFill(pct) }}
              />
              {pct}%
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[10px] text-[var(--text-tertiary)]">
          Drag nodes · scroll to zoom
        </p>
      </div>

      {focused && (
        <aside className="absolute top-16 right-3 bottom-4 z-20 flex w-[min(280px,calc(100%-1.5rem))] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xl md:top-5 md:right-5 md:bottom-5 md:w-[300px]">
          <div className="shrink-0 p-4 pb-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-xl tracking-tight text-[var(--text-primary)]">
                {focused.label}
              </h3>
              <button
                type="button"
                onClick={() => setFocusedId(null)}
                aria-label="Close"
                className="rounded-full bg-[var(--bg-secondary)] p-1.5 text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--text-primary)]"
              >
                <X size={13} />
              </button>
            </div>
            <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
              {focused.kind} in World History
            </p>
          </div>

          <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-4">
            <div className="mb-3 rounded-xl border border-[var(--border)]/50 bg-[var(--bg-secondary)] p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] font-medium text-[var(--text-secondary)]">
                  Mastery
                </span>
                {focused.mastery == null ? (
                  <span className="text-[10px] text-[var(--text-tertiary)]">No progress yet</span>
                ) : (
                  <span className="text-[12px] font-semibold text-[var(--text-primary)] tabular-nums">
                    {focused.mastery}%
                  </span>
                )}
              </div>
              {focused.mastery != null && (
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent)]"
                    style={{ width: `${focused.mastery}%` }}
                  />
                </div>
              )}
            </div>

            <h4 className="font-display mb-2 text-[13px] text-[var(--text-primary)]">
              Connections ({connected.length})
            </h4>
            <div className="space-y-1">
              {connected.map((cn) => (
                <button
                  key={cn.id}
                  type="button"
                  onClick={() => focusNode(cn.id)}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left hover:bg-[var(--bg-secondary)]"
                >
                  <span className="truncate text-[12px] font-medium text-[var(--text-primary)]">
                    {cn.label}
                  </span>
                  <span className="shrink-0 text-[10px] text-[var(--text-secondary)] capitalize">
                    {cn.kind}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
