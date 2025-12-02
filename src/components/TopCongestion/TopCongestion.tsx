import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { supabase } from "../../lib/supabase";

interface CongestionItem {
  street_name: string;
  hour: number;
  velocity: number;
  rank: number;
  lat: number;
  long: number;
}

export const TopCongestion = ({
  date,
  isPaused,
}: {
  date?: string;
  isPaused?: boolean;
}): JSX.Element => {
  const [items, setItems] = useState<CongestionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: apiData } = await api.getTopCongestionList(date);

      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        setItems(apiData.sort((a, b) => a.rank - b.rank).slice(0, 10));
      } else {
        const { data: supabaseData } = await supabase
          .from("top_congestion_list")
          .select("*")
          .order("rank", { ascending: true })
          .limit(10);

        if (supabaseData) setItems(supabaseData);
      }
      setLoading(false);
    };

    fetchData();
    if (!isPaused) {
      const interval = setInterval(fetchData, 15000);
      return () => clearInterval(interval);
    }
  }, [date, isPaused]);

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-400 bg-yellow-500/20";
      case 2:
        return "text-gray-300 bg-gray-500/20";
      case 3:
        return "text-orange-400 bg-orange-500/20";
      default:
        return "text-gray-400 bg-gray-500/10";
    }
  };

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "📍";
    }
  };

  return (
    <div className="bg-[#1a1b3d] rounded-xl p-6 border border-[#2d2e5f]">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        Top 10 Most Congested Roads
      </h3>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-12 bg-[#0f1028] rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No congestion data available
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#0f1028] p-3 rounded-lg border border-[#2d2e5f] hover:border-red-500/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`text-2xl ${getMedalColor(
                      item.rank
                    )} w-10 h-10 flex items-center justify-center rounded-full font-bold`}
                  >
                    {getMedalEmoji(item.rank)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white text-sm">
                      {item.street_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.lat.toFixed(2)}, {item.long.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-red-400">
                    {item.velocity.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-400">
                    km/h @ {item.hour}:00
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
