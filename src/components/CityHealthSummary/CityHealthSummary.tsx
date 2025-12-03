import { useEffect, useState } from "react";
import { api } from "../../lib/api";

interface CityHealth {
  hour: number;
  city_avg_speed: number;
  total_active_roads: number;
  jammed_roads_count: number;
  congestion_level: string;
}

export const CityHealthSummary = ({
  selectedHour = new Date().getHours(),
}: {
  selectedHour?: number;
}): JSX.Element => {
  const [health, setHealth] = useState<CityHealth | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch heatmap data for the selected hour to calculate metrics
      const { data: heatmapData } = await api.getHeatmapData(selectedHour > 16 ? 16 : selectedHour);

      if (heatmapData && heatmapData.length > 0) {
        // Calculate metrics from heatmap data
        const totalSpeed = heatmapData.reduce(
          (sum, point) => sum + point.speed,
          0
        );
        const avgSpeed = totalSpeed / heatmapData.length;
        const jammedRoads = heatmapData.filter(
          (point) => point.speed < 20
        ).length; // Assuming < 20km/h is jammed

        let congestionLevel = "GOOD";
        if (avgSpeed < 20) congestionLevel = "CRITICAL";
        else if (avgSpeed < 35) congestionLevel = "HIGH";
        else if (avgSpeed < 50) congestionLevel = "NORMAL";

        setHealth({
          hour: selectedHour,
          city_avg_speed: avgSpeed,
          total_active_roads: heatmapData.length,
          jammed_roads_count: jammedRoads,
          congestion_level: congestionLevel,
        });
      } else {
        // Fallback to existing logic if no heatmap data (or keep previous data)
        const { data } = await api.getCityHealthSummary();
        if (data && data.length > 0) {
          const latestHour = data.reduce((prev, curr) =>
            curr.hour > prev.hour ? curr : prev
          );
          setHealth(latestHour);
        }
      }
    };

    fetchData();
  }, [selectedHour]);

  const getCongestionColor = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return "bg-red-500/20 border-red-500/30 text-red-400";
      case "HIGH":
        return "bg-orange-500/20 border-orange-500/30 text-orange-400";
      case "NORMAL":
        return "bg-emerald-500/20 border-emerald-500/30 text-emerald-400";
      default:
        return "bg-slate-500/20 border-slate-500/30 text-slate-400";
    }
  };

  const metrics = [
    {
      label: "Avg City Speed",
      value: health?.city_avg_speed.toFixed(1) || "0",
      unit: "km/h",
      icon: "🚗",
      color: "text-sky-400",
    },
    {
      label: "Active Roads",
      value: health?.total_active_roads.toLocaleString() || "0",
      unit: "",
      icon: "🛣️",
      color: "text-indigo-400",
    },
    {
      label: "Jammed Roads",
      value: health?.jammed_roads_count.toLocaleString() || "0",
      unit: "",
      icon: "🚨",
      color: "text-red-400",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {!health ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-[#1e293b] rounded-xl border border-[#334155] animate-pulse"
              ></div>
            ))}
          </div>
          <div className="h-40 bg-[#1e293b] rounded-xl border border-[#334155] animate-pulse"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metrics.map((metric, idx) => (
              <div
                key={idx}
                className="bg-[#1e293b] rounded-xl p-6 border border-[#334155] hover:border-[#475569] transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{metric.icon}</span>
                  <div className="text-sm text-slate-400">{metric.label}</div>
                </div>
                <div className={`text-3xl font-bold ${metric.color}`}>
                  {metric.value}
                  {metric.unit && (
                    <span className="text-lg ml-1">{metric.unit}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div
            className={`rounded-xl p-6 border ${getCongestionColor(
              health.congestion_level
            )}`}
          >
            <div className="text-center">
              <div className="text-sm text-slate-300 mb-2">
                Congestion Status
              </div>
              <div className="text-4xl font-bold uppercase tracking-wider">
                {health.congestion_level}
              </div>
              <div className="text-xs text-slate-400 mt-2">
                Hour {health.hour}:00 - {health.jammed_roads_count} roads in
                heavy traffic
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
