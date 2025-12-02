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
import { supabase } from "../../lib/supabase";

interface PeakData {
  street_name: string;
  period: string;
  period_avg_speed: number;
}

export const PeakAnalysis = ({
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
      const { data: apiData } = await api.getPeakAnalysis(date);

      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        const grouped = groupByStreet(apiData);
        setData(grouped);
      } else {
        const { data: supabaseData } = await supabase
          .from("peak_analysis")
          .select("*");

        if (supabaseData && supabaseData.length > 0) {
          const grouped = groupByStreet(supabaseData);
          setData(grouped);
        }
      }
      setLoading(false);
    };

    const groupByStreet = (peakData: PeakData[]) => {
      const streets = Array.from(new Set(peakData.map((d) => d.street_name)));
      return streets.map((street) => {
        const streetData: any = { name: street };
        peakData
          .filter((d) => d.street_name === street)
          .forEach((d) => {
            if (d.period === "Morning Peak")
              streetData.morning = d.period_avg_speed;
            if (d.period === "Evening Peak")
              streetData.evening = d.period_avg_speed;
            if (d.period === "Off-Peak")
              streetData.offPeak = d.period_avg_speed;
          });
        return streetData;
      });
    };

    fetchData();
    if (!isPaused) {
      const interval = setInterval(fetchData, 15000);
      return () => clearInterval(interval);
    }
  }, [date, isPaused]);

  const [selectedStreet, setSelectedStreet] = useState<string>("All");

  // Extract unique street names
  const allStreets = Array.from(new Set(data.map((d) => d.name)));

  // Filter data for chart
  const chartData =
    selectedStreet === "All"
      ? data.slice(0, 5) // Show top 5 if All is selected to avoid clutter
      : data.filter((d) => d.name === selectedStreet);

  // Get specific metrics for selected street
  const selectedMetrics =
    selectedStreet !== "All"
      ? data.find((d) => d.name === selectedStreet)
      : null;

  return (
    <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg
            className="w-5 h-5 text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Peak vs Off-Peak Analysis
        </h3>

        <div className="flex items-center gap-2 bg-[#0f172a] p-2 rounded-lg border border-[#334155]">
          <label
            htmlFor="peak-street-select"
            className="text-sm text-slate-400"
          >
            Street:
          </label>
          <select
            id="peak-street-select"
            value={selectedStreet}
            onChange={(e) => setSelectedStreet(e.target.value)}
            className="bg-[#1e293b] text-white text-sm border border-[#334155] rounded px-2 py-1 focus:outline-none focus:border-amber-400"
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
        <>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
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
              <Bar dataKey="morning" fill="#f472b6" name="Morning Peak" />
              <Bar dataKey="evening" fill="#fbbf24" name="Evening Peak" />
              <Bar dataKey="offPeak" fill="#38bdf8" name="Off-Peak" />
            </BarChart>
          </ResponsiveContainer>

          {selectedMetrics && (
            <div className="mt-4 grid grid-cols-3 gap-4 border-t border-[#334155] pt-4">
              <div className="text-center">
                <div className="text-xs text-slate-400 mb-1">Morning Peak</div>
                <div className="text-xl font-bold text-pink-400">
                  {selectedMetrics.morning} km/h
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-400 mb-1">Evening Peak</div>
                <div className="text-xl font-bold text-amber-400">
                  {selectedMetrics.evening} km/h
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-400 mb-1">Off-Peak</div>
                <div className="text-xl font-bold text-sky-400">
                  {selectedMetrics.offPeak} km/h
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
