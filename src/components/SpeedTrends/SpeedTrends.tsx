import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { api } from "../../lib/api";
import { supabase } from "../../lib/supabase";

interface SpeedData {
  street_name: string;
  hour: number;
  avg_speed: number;
  max_speed_observed: number;
}

export const SpeedTrends = ({
  date,
  isPaused,
}: {
  date?: string;
  isPaused?: boolean;
}): JSX.Element => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: apiData } = await api.getAvgSpeedKpi(date);

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
      const hours = Array.from(new Set(speedData.map((d) => d.hour))).sort(
        (a, b) => a - b
      );

      return hours.map((hour) => {
        const hourData: any = { hour: `${hour}:00` };
        streets.forEach((street) => {
          const item = speedData.find(
            (d) => d.street_name === street && d.hour === hour
          );
          hourData[street] = item?.avg_speed || 0;
        });
        return hourData;
      });
    };

    fetchData();
    if (!isPaused) {
      const interval = setInterval(fetchData, 15000);
      return () => clearInterval(interval);
    }
  }, [date, isPaused]);

  const colors = ["#38bdf8", "#818cf8", "#f472b6", "#34d399"];

  const [selectedStreet, setSelectedStreet] = useState<string>("All");

  // Extract unique street names
  const allStreets = Array.from(
    new Set(
      data.length > 0
        ? Object.keys(data[0]).filter((key) => key !== "hour")
        : []
    )
  );

  return (
    <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
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
          Average Speed Trends Per Road
        </h3>

        <div className="flex items-center gap-2 bg-[#0f172a] p-2 rounded-lg border border-[#334155]">
          <label htmlFor="street-select" className="text-sm text-slate-400">
            Street:
          </label>
          <select
            id="street-select"
            value={selectedStreet}
            onChange={(e) => setSelectedStreet(e.target.value)}
            className="bg-[#1e293b] text-white text-sm border border-[#334155] rounded px-2 py-1 focus:outline-none focus:border-sky-400"
          >
            <option value="All">All Streets</option>
            {allStreets.map((street) => (
              <option key={street} value={street}>
                {street}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-80 flex items-center justify-center text-slate-400">
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-slate-400">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="hour" stroke="#94a3b8" />
            <YAxis
              stroke="#94a3b8"
              label={{
                value: "Speed (km/h)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#cbd5e1" }}
            />
            <Legend />
            {Object.keys(data[0] || {})
              .filter((key) => key !== "hour")
              .filter(
                (street) =>
                  selectedStreet === "All" || street === selectedStreet
              )
              .map((street, idx) => (
                <Line
                  key={street}
                  type="monotone"
                  dataKey={street}
                  stroke={colors[idx % colors.length]}
                  strokeWidth={selectedStreet === street ? 4 : 2}
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
