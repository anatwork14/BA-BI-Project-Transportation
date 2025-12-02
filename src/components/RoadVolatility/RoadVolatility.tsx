import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { supabase } from "../../lib/supabase";

interface VolatilityData {
  street_name: string;
  std_dev: number;
  avg: number;
  reliability_status: string;
}

export const RoadVolatility = ({
  date,
  isPaused,
}: {
  date?: string;
  isPaused?: boolean;
}): JSX.Element => {
  const [data, setData] = useState<VolatilityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: apiData } = await api.getRoadVolatility(date);

      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        setData(apiData.sort((a, b) => b.std_dev - a.std_dev));
      } else {
        const { data: supabaseData } = await supabase
          .from("road_volatility")
          .select("*")
          .order("std_dev", { ascending: false });

        if (supabaseData) setData(supabaseData);
      }
      setLoading(false);
    };

    fetchData();
    if (!isPaused) {
      const interval = setInterval(fetchData, 15000);
      return () => clearInterval(interval);
    }
  }, [date, isPaused]);

  const getReliabilityColor = (status: string) => {
    if (status.includes("Reliable") && status.includes("fast")) {
      return "bg-green-500/20 border-green-500/30 text-green-400";
    }
    if (status.includes("Reliable")) {
      return "bg-blue-500/20 border-blue-500/30 text-blue-400";
    }
    if (status.includes("Unstable")) {
      return "bg-red-500/20 border-red-500/30 text-red-400";
    }
    return "bg-gray-500/20 border-gray-500/30 text-gray-400";
  };

  return (
    <div className="bg-[#1a1b3d] rounded-xl p-6 border border-[#2d2e5f]">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-purple-400"
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
        Road Reliability Index
      </h3>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-[#0f1028] rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No volatility data available
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((item, idx) => {
            const colorClass = getReliabilityColor(item.reliability_status);
            const maxStdDev = Math.max(...data.map((d) => d.std_dev), 1);

            return (
              <div key={idx} className={`p-4 rounded-lg border ${colorClass}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-white">
                    {item.street_name}
                  </div>
                  <div className="text-xs font-medium">
                    {item.reliability_status}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-2 text-xs">
                  <div>
                    <span className="text-gray-400">Avg Speed: </span>
                    <span className="font-medium">
                      {item.avg.toFixed(1)} km/h
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Std Dev: </span>
                    <span className="font-medium">
                      {item.std_dev.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Volatility: </span>
                    <span className="font-medium">
                      {((item.std_dev / item.avg) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="bg-[#0f1028] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-red-500"
                    style={{ width: `${(item.std_dev / maxStdDev) * 100}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
