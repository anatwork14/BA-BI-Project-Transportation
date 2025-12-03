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
// Fix for Recharts type compatibility issues with React 18
// We cast these components to 'any' to avoid the "cannot be used as a JSX component" error
const SafeResponsiveContainer = ResponsiveContainer as any;
const SafeLineChart = LineChart as any;
const SafeLine = Line as any;
const SafeXAxis = XAxis as any;
const SafeYAxis = YAxis as any;
const SafeCartesianGrid = CartesianGrid as any;
const SafeTooltip = Tooltip as any;
const SafeLegend = Legend as any;
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
    
  }, []);

  const colors = ["#38bdf8", "#818cf8", "#f472b6", "#34d399"];

  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(5);

  // Extract unique street names
  const allStreets = Array.from(
    new Set(
      data.length > 0
        ? Object.keys(data[0]).filter((key) => key !== "hour")
        : []
    )
  );

  const filteredStreets = allStreets
    .filter((street) =>
      street.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, limit);

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

        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[#0f172a] p-2 rounded-lg border border-[#334155]">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search streets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-white text-sm focus:outline-none w-32 md:w-48 placeholder-slate-500"
            />
          </div>

          {/* Limit Selector */}
          <div className="flex items-center gap-2 bg-[#0f172a] p-2 rounded-lg border border-[#334155]">
            <label htmlFor="limit-select" className="text-sm text-slate-400">
              Show:
            </label>
            <select
              id="limit-select"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="bg-[#1e293b] text-white text-sm border border-[#334155] rounded px-2 py-1 focus:outline-none focus:border-sky-400"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>
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
        <SafeResponsiveContainer width="100%" height={350}>
          <SafeLineChart data={data}>
            <SafeCartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <SafeXAxis dataKey="hour" stroke="#94a3b8" />
            <SafeYAxis
              stroke="#94a3b8"
              label={{
                value: "Speed (km/h)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <SafeTooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#cbd5e1" }}
            />
            <SafeLegend />
            {filteredStreets.map((street, idx) => (
                <SafeLine
                  key={street}
                  type="monotone"
                  dataKey={street}
                  stroke={colors[idx % colors.length]}
                  strokeWidth={2}
                  dot={false}
                  name={street}
                />
              ))}
          </SafeLineChart>
        </SafeResponsiveContainer>
      )}
    </div>
  );
};
