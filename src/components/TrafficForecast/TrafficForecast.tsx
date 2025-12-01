import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { supabase } from "../../lib/supabase";

interface ForecastData {
  street_name: string;
  hour: number;
  velocity: number;
  predicted_speed_next_hour: number;
}

export const TrafficForecast = (): JSX.Element => {
  const [forecasts, setForecasts] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: apiData } = await api.getTrafficForecast();

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
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const getDangerLevel = (current: number, predicted: number) => {
    const drop = ((current - predicted) / current) * 100;
    if (drop > 50) return { level: "Critical Drop", color: "bg-red-500/20 border-red-500/30 text-red-400" };
    if (drop > 20) return { level: "Moderate Drop", color: "bg-orange-500/20 border-orange-500/30 text-orange-400" };
    if (drop > 5) return { level: "Slight Drop", color: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400" };
    return { level: "Stable", color: "bg-green-500/20 border-green-500/30 text-green-400" };
  };

  return (
    <div className="bg-[#1a1b3d] rounded-xl p-6 border border-[#2d2e5f]">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        Traffic Forecast - Next Hour Predictions
      </h3>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[#0f1028] rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : forecasts.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No forecast data available</div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {forecasts.map((forecast, idx) => {
            const danger = getDangerLevel(forecast.velocity, forecast.predicted_speed_next_hour);
            const change = forecast.predicted_speed_next_hour - forecast.velocity;
            const changePercent = ((change / forecast.velocity) * 100).toFixed(1);

            return (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${danger.color}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-white mb-2">{forecast.street_name}</div>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-gray-400">Current: </span>
                        <span className={`font-medium ${danger.color.split(" ")[3]}`}>
                          {forecast.velocity.toFixed(1)} km/h
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Predicted: </span>
                        <span className={`font-medium ${danger.color.split(" ")[3]}`}>
                          {forecast.predicted_speed_next_hour.toFixed(1)} km/h
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium mb-1">{danger.level}</div>
                    <div className={`text-lg font-bold ${change < 0 ? "text-red-400" : "text-green-400"}`}>
                      {change >= 0 ? "+" : ""}{changePercent}%
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
