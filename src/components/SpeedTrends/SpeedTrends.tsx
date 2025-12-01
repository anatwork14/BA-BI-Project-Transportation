import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { api } from "../../lib/api";
import { supabase } from "../../lib/supabase";

interface SpeedData {
  street_name: string;
  hour: number;
  avg_speed: number;
  max_speed_observed: number;
}

export const SpeedTrends = (): JSX.Element => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: apiData } = await api.getAvgSpeedKpi();

      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        const grouped = groupByStreet(apiData);
        setData(grouped);
      } else {
        const { data: supabaseData } = await supabase
          .from("avg_speed_kpi")
          .select("*")
          .order("hour", { ascending: true });

        if (supabaseData && supabaseData.length > 0) {
          const grouped = groupByStreet(supabaseData);
          setData(grouped);
        }
      }
      setLoading(false);
    };

    const groupByStreet = (speedData: SpeedData[]) => {
      const streets = Array.from(new Set(speedData.map((d) => d.street_name)));
      const hours = Array.from(new Set(speedData.map((d) => d.hour))).sort((a, b) => a - b);

      return hours.map((hour) => {
        const hourData: any = { hour: `${hour}:00` };
        streets.forEach((street) => {
          const item = speedData.find((d) => d.street_name === street && d.hour === hour);
          hourData[street] = item?.avg_speed || 0;
        });
        return hourData;
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const colors = ["#22d3ee", "#f97316", "#8b5cf6", "#ec4899"];

  return (
    <div className="bg-[#1a1b3d] rounded-xl p-6 border border-[#2d2e5f]">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        Average Speed Trends Per Road
      </h3>

      {loading ? (
        <div className="h-80 flex items-center justify-center text-gray-400">Loading...</div>
      ) : data.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-gray-400">No data available</div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2e5f" />
            <XAxis dataKey="hour" stroke="#6b7280" />
            <YAxis stroke="#6b7280" label={{ value: "Speed (km/h)", angle: -90, position: "insideLeft" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f1028",
                border: "1px solid #2d2e5f",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#9ca3af" }}
            />
            <Legend />
            {Object.keys(data[0] || {})
              .filter((key) => key !== "hour")
              .map((street, idx) => (
                <Line
                  key={street}
                  type="monotone"
                  dataKey={street}
                  stroke={colors[idx % colors.length]}
                  strokeWidth={2}
                  dot={false}
                  name={street}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
