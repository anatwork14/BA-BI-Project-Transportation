import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { api } from "../../lib/api";
import { supabase } from "../../lib/supabase";

interface PeakData {
  street_name: string;
  period: string;
  period_avg_speed: number;
}

export const PeakAnalysis = (): JSX.Element => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: apiData } = await api.getPeakAnalysis();

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
            if (d.period === "Morning Peak") streetData.morning = d.period_avg_speed;
            if (d.period === "Evening Peak") streetData.evening = d.period_avg_speed;
            if (d.period === "Off-Peak") streetData.offPeak = d.period_avg_speed;
          });
        return streetData;
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#1a1b3d] rounded-xl p-6 border border-[#2d2e5f]">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Peak vs Off-Peak Analysis
      </h3>

      {loading ? (
        <div className="h-80 flex items-center justify-center text-gray-400">Loading...</div>
      ) : data.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-gray-400">No data available</div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2e5f" />
            <XAxis dataKey="name" stroke="#6b7280" />
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
            <Bar dataKey="morning" fill="#ec4899" name="Morning Peak" />
            <Bar dataKey="evening" fill="#f97316" name="Evening Peak" />
            <Bar dataKey="offPeak" fill="#22d3ee" name="Off-Peak" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
