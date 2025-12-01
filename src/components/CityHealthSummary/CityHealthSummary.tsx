import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { supabase } from "../../lib/supabase";

interface CityHealth {
  hour: number;
  city_avg_speed: number;
  total_active_roads: number;
  jammed_roads_count: number;
  congestion_level: string;
}

export const CityHealthSummary = (): JSX.Element => {
  const [health, setHealth] = useState<CityHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data } = await api.getCityHealthSummary();

      if (data && data.length > 0) {
        const latestHour = data.reduce((prev, curr) =>
          curr.hour > prev.hour ? curr : prev
        );
        setHealth(latestHour);
      } else {
        const { data: supabaseData } = await supabase
          .from("city_health_summary")
          .select("*")
          .order("hour", { ascending: false })
          .limit(1)
          .single();

        if (supabaseData) setHealth(supabaseData);
      }
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getCongestionColor = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return "bg-red-500/20 border-red-500/30 text-red-400";
      case "HIGH":
        return "bg-orange-500/20 border-orange-500/30 text-orange-400";
      case "NORMAL":
        return "bg-green-500/20 border-green-500/30 text-green-400";
      default:
        return "bg-gray-500/20 border-gray-500/30 text-gray-400";
    }
  };

  const metrics = [
    {
      label: "Avg City Speed",
      value: health?.city_avg_speed.toFixed(1) || "0",
      unit: "km/h",
      icon: "🚗",
      color: "text-cyan-400",
    },
    {
      label: "Active Roads",
      value: health?.total_active_roads.toLocaleString() || "0",
      unit: "",
      icon: "🛣️",
      color: "text-blue-400",
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="bg-[#1a1b3d] rounded-xl p-6 border border-[#2d2e5f] hover:border-[#3d3e7f] transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{metric.icon}</span>
              <div className="text-sm text-gray-400">{metric.label}</div>
            </div>
            <div className={`text-3xl font-bold ${metric.color}`}>
              {metric.value}
              {metric.unit && <span className="text-lg ml-1">{metric.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      {health && (
        <div className={`rounded-xl p-6 border ${getCongestionColor(health.congestion_level)}`}>
          <div className="text-center">
            <div className="text-sm text-gray-300 mb-2">Congestion Status</div>
            <div className="text-4xl font-bold uppercase tracking-wider">
              {health.congestion_level}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Hour {health.hour}:00 - {health.jammed_roads_count} roads in heavy traffic
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
