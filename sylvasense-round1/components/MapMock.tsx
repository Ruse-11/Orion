 "use client";

import { useMemo } from "react";

type Layer = "optical" | "ndvi" | "sar" | "canopy" | "biomass" | "change";

export default function MapMock({ layer }: { layer: Layer }) {
  const dots = useMemo(
    () =>
      Array.from({ length: 52 }, (_, i) => ({
        left: 10 + ((i * 37) % 78),
        top: 12 + ((i * 61) % 70),
        size: 5 + ((i * 13) % 12)
      })),
    []
  );

  return (
    <div className={`map map-${layer}`}>
      <div className="map-grid" />
      <div className="map-river" />
      <div className="map-boundary" />
      <div className="map-label label-a">SILENT VALLEY</div>
      <div className="map-label label-b">BUFFER ZONE</div>
      {dots.map((d, i) => (
        <span
          key={i}
          className={`tree-dot dot-${layer}`}
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size }}
        />
      ))}
      <div className="map-scale">2 km</div>
      <div className="map-live"><span /> SATELLITE OVERLAY</div>
    </div>
  );
}