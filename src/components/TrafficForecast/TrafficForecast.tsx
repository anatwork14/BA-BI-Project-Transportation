import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { supabase } from "../../lib/supabase";

interface ForecastData {
  street_name: string;
  hour: number;
  velocity: number;
  predicted_speed_next_hour: number;
}

export const TrafficForecast = ({
  date,
  isPaused,
}: {
  date?: string;
  isPaused?: boolean;
}): JSX.Element => {
  const [forecasts, setForecasts] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Congested" | "Moderate" | "Clear"
  >("All");
  const [streetFilter, setStreetFilter] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: apiData } = await api.getTrafficForecast(date);

      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        setForecasts(apiData);
      } else {
        const { data: supabaseData } = await supabase
          .from("traffic_forecast")
          .select("*")
          .order("hour", { ascending: true });

        if (supabaseData) setForecasts(supabaseData);
      }
      setLoading(false);
    };

    fetchData();
    if (!isPaused) {
      const interval = setInterval(fetchData, 15000);
      return () => clearInterval(interval);
    }
  }, [date, isPaused]);

  const getDangerLevel = (current: number, predicted: number) => {
    const drop = ((current - predicted) / current) * 100;
    if (drop > 50)
      return {
        level: "Critical Drop",
        color: "bg-red-500/20 border-red-500/30 text-red-400",
        status: "Congested",
      };
    if (drop > 20)
      return {
        level: "Moderate Drop",
        color: "bg-orange-500/20 border-orange-500/30 text-orange-400",
        status: "Moderate",
      };
    if (drop > 5)
      return {
        level: "Slight Drop",
        color: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
        status: "Moderate",
      };
    return {
      level: "Stable",
      color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400",
      status: "Clear",
    };
  };

  const filteredForecasts = forecasts.filter((forecast) => {
    const danger = getDangerLevel(
      forecast.velocity,
      forecast.predicted_speed_next_hour
    );

    // Status Filter
    if (statusFilter !== "All") {
      if (statusFilter === "Congested" && danger.status !== "Congested")
        return false;
      if (statusFilter === "Moderate" && danger.status !== "Moderate")
        return false;
      if (statusFilter === "Clear" && danger.status !== "Clear") return false;
    }

    // Street Filter
    if (
      streetFilter &&
      !forecast.street_name.toLowerCase().includes(streetFilter.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155]">
      <div className="flex flex-col gap-4 mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg
            className="w-5 h-5 text-sky-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          Traffic Forecast
        </h3>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#0f172a] text-white text-sm border border-[#334155] rounded px-2 py-1 focus:outline-none focus:border-sky-400"
          >
            <option value="All">All Status</option>
            <option value="Congested">Congested</option>
            <option value="Moderate">Moderate</option>
            <option value="Clear">Clear</option>
          </select>
          <input
            type="text"
            placeholder="Search street..."
            value={streetFilter}
            onChange={(e) => setStreetFilter(e.target.value)}
            className="flex-1 bg-[#0f172a] text-white text-sm border border-[#334155] rounded px-3 py-1 focus:outline-none focus:border-sky-400"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-[#0f172a] rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : filteredForecasts.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          No forecast data matches your filters
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {filteredForecasts.map((forecast, idx) => {
            const danger = getDangerLevel(
              forecast.velocity,
              forecast.predicted_speed_next_hour
            );
            const change =
              forecast.predicted_speed_next_hour - forecast.velocity;
            const changePercent = ((change / forecast.velocity) * 100).toFixed(
              1
            );

            return (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${danger.color}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-white mb-2">
                      {forecast.street_name}
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-slate-400">Current: </span>
                        <span
                          className={`font-medium ${danger.color
                            .split(" ")[2]
                            .replace("text-", "text-")}`}
                        >
                          {forecast.velocity.toFixed(1)} km/h
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Predicted: </span>
                        <span
                          className={`font-medium ${danger.color
                            .split(" ")[2]
                            .replace("text-", "text-")}`}
                        >
                          {forecast.predicted_speed_next_hour.toFixed(1)} km/h
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium mb-1">
                      {danger.level}
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        change < 0 ? "text-red-400" : "text-emerald-400"
                      }`}
                    >
                      {change >= 0 ? "+" : ""}
                      {changePercent}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
