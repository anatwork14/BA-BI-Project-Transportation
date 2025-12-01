import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { supabase } from "../../lib/supabase";

interface HeatmapPoint {
  lat: number;
  long: number;
  speed: number;
  intensity: number;
}

export const HeatmapVisualization = (): JSX.Element => {
  const [points, setPoints] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: apiData } = await api.getHeatmapData();

      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        setPoints(apiData);
      } else {
        const { data: supabaseData } = await supabase
          .from("heatmap_data")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);

        if (supabaseData) setPoints(supabaseData);
      }
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const getIntensityColor = (intensity: number) => {
    if (intensity > 15) return "bg-red-500";
    if (intensity > 10) return "bg-orange-500";
    if (intensity > 5) return "bg-yellow-400";
    return "bg-green-500";
  };

  const maxIntensity = Math.max(...points.map((p) => p.intensity), 1);
  const minLat = Math.min(...points.map((p) => p.lat), 10.776);
  const maxLat = Math.max(...points.map((p) => p.lat), 10.820);
  const minLong = Math.min(...points.map((p) => p.long), 106.680);
  const maxLong = Math.max(...points.map((p) => p.long), 106.700);

  const latRange = maxLat - minLat || 0.1;
  const longRange = maxLong - minLong || 0.1;

  return (
    <div className="bg-[#1a1b3d] rounded-xl p-6 border border-[#2d2e5f]">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Traffic Heatmap (Speed Intensity)
      </h3>

      {loading ? (
        <div className="h-80 flex items-center justify-center text-gray-400">Loading map data...</div>
      ) : (
        <div className="space-y-4">
          <div className="relative h-80 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden border border-[#2d2e5f]">
            {points.length > 0 && (
              <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <radialGradient id="heatGradient" r="30%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {points.map((point, idx) => {
                  const x = ((point.long - minLong) / longRange) * 400;
                  const y = ((maxLat - point.lat) / latRange) * 300;
                  const size = (point.intensity / maxIntensity) * 50 + 20;

                  let color = "rgba(34, 211, 238, 1)";
                  if (point.intensity > 15) color = "rgba(239, 68, 68, 1)";
                  else if (point.intensity > 10) color = "rgba(249, 115, 22, 1)";
                  else if (point.intensity > 5) color = "rgba(234, 179, 8, 1)";
                  else color = "rgba(34, 197, 94, 1)";

                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r={size}
                      fill={color}
                      opacity={0.5}
                      filter="blur(8px)"
                    />
                  );
                })}
              </svg>
            )}

            <div className="absolute top-4 right-4 bg-[#0f1028]/90 backdrop-blur-sm px-4 py-3 rounded-lg border border-[#2d2e5f]">
              <div className="text-xs font-semibold text-gray-300 mb-2">Intensity Scale</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-xs text-gray-400">High (Congested)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-xs text-gray-400">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-xs text-gray-400">Low (Fast)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {points.slice(0, 4).map((point, idx) => (
              <div key={idx} className="bg-[#0f1028] p-3 rounded-lg border border-[#2d2e5f]">
                <div className="text-xs text-gray-400">Location {idx + 1}</div>
                <div className="text-sm font-medium text-cyan-400">
                  {point.speed.toFixed(1)} km/h
                </div>
                <div className="text-xs text-gray-500">
                  Intensity: {point.intensity.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
