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

interface WeekdayData {
  street_name: string;
  hour: number;
  is_weekend: string;
  avg_speed: number;
}

export const WeekendComparison = ({
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
      const { data: apiData } = await api.getWeekendVsWeekday(date);

      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        const grouped = groupByStreet(apiData);
        setData(grouped);
      } else {
        const { data: supabaseData } = await supabase
          .from("weekend_vs_weekday")
          .select("*");

        if (supabaseData && supabaseData.length > 0) {
          const grouped = groupByStreet(supabaseData);
          setData(grouped);
        }
      }
      setLoading(false);
    };

    const groupByStreet = (weekdayData: WeekdayData[]) => {
      const streets = Array.from(
        new Set(weekdayData.map((d) => d.street_name))
      );
      return streets.map((street) => {
        const streetData: any = { name: street };
        weekdayData
          .filter((d) => d.street_name === street)
          .forEach((d) => {
            if (d.is_weekend === "Weekday") streetData.weekday = d.avg_speed;
            if (d.is_weekend === "Weekend") streetData.weekend = d.avg_speed;
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

      {loading ? (
        <div className="h-80 flex items-center justify-center text-gray-400">
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-gray-400">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2e5f" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis
              stroke="#6b7280"
              label={{
                value: "Speed (km/h)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f1028",
                border: "1px solid #2d2e5f",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#9ca3af" }}
            />
            <Legend />
            <Bar dataKey="weekday" fill="#3b82f6" name="Weekday" />
            <Bar dataKey="weekend" fill="#f59e0b" name="Weekend" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
