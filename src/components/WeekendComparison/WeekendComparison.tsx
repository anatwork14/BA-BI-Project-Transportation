import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
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
const SafeBarChart = BarChart as any;
const SafeBar = Bar as any;
const SafeXAxis = XAxis as any;
const SafeYAxis = YAxis as any;
const SafeCartesianGrid = CartesianGrid as any;
const SafeTooltip = Tooltip as any;
const SafeLegend = Legend as any;

interface WeekdayData {
  street_name: string;
  hour: number;
  is_weekend: boolean;
  avg_speed: number;
}

interface ChartData {
  name: string;
  weekday?: number;
  weekend?: number;
}

export const WeekendComparison = (): JSX.Element => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(5);

  const [viewMode, setViewMode] = useState<"all" | "weekday" | "weekend">("all");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: apiData } = await api.getWeekendVsWeekday();

      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        const grouped = groupByStreet(apiData);
        setData(grouped);
      }
      setLoading(false);
    };

    const groupByStreet = (weekdayData: WeekdayData[]): ChartData[] => {
      const streets = Array.from(
        new Set(
          weekdayData
            .map((d) => d.street_name)
            .filter((name) => name && name.trim() !== "")
        )
      );
      return streets.map((street) => {
        const streetData: ChartData = { name: street };
        weekdayData
          .filter((d) => d.street_name === street)
          .forEach((d) => {
            if (d.is_weekend === true) streetData.weekend = d.avg_speed;
            if (d.is_weekend === false) streetData.weekday = d.avg_speed;
          });
        return streetData;
      });
    };

    fetchData();
  }, []);

  return (
    <div className="bg-[#1a1b3d] rounded-xl p-6 border border-[#2d2e5f]">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-indigo-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Weekday vs Weekend Pattern Analysis
      </h3>

      <div className="mb-4 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search street..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-[#0f1028] text-white text-sm border border-[#2d2e5f] rounded px-3 py-2 focus:outline-none focus:border-indigo-400 placeholder-slate-500"
          />
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as "all" | "weekday" | "weekend")}
            className="w-32 bg-[#0f1028] text-white text-sm border border-[#2d2e5f] rounded px-3 py-2 focus:outline-none focus:border-indigo-400"
          >
            <option value="all">All Days</option>
            <option value="weekday">Weekday Only</option>
            <option value="weekend">Weekend Only</option>
          </select>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-24 bg-[#0f1028] text-white text-sm border border-[#2d2e5f] rounded px-3 py-2 focus:outline-none focus:border-indigo-400"
          >
            <option value={5}>5 items</option>
            <option value={10}>10 items</option>
            <option value={20}>20 items</option>
            <option value={30}>30 items</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-80 flex items-center justify-center text-gray-400">
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-gray-400">
          No data available
        </div>
      ) : (
        <SafeResponsiveContainer width="100%" height={350}>
          <SafeBarChart
            data={data
              .filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .slice(0, limit)}
          >
            <SafeCartesianGrid strokeDasharray="3 3" stroke="#2d2e5f" />
            <SafeXAxis dataKey="name" stroke="#6b7280" />
            <SafeYAxis
              stroke="#6b7280"
              label={{
                value: "Speed (km/h)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <SafeTooltip
              contentStyle={{
                backgroundColor: "#0f1028",
                border: "1px solid #2d2e5f",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#9ca3af" }}
            />
            <SafeLegend />
            {(viewMode === "all" || viewMode === "weekday") && (
              <SafeBar dataKey="weekday" fill="#3b82f6" name="Weekday" />
            )}
            {(viewMode === "all" || viewMode === "weekend") && (
              <SafeBar dataKey="weekend" fill="#f59e0b" name="Weekend" />
            )}
          </SafeBarChart>
        </SafeResponsiveContainer>
      )}
    </div>
  );
};
