import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { supabase } from "../../lib/supabase";

interface GreenRoute {
  street_name: string;
  hour: number;
  velocity: number;
  lat: number;
  long: number;
}

export const GreenRoutes = ({
  date,
  isPaused,
}: {
  date?: string;
  isPaused?: boolean;
}): JSX.Element => {
  const [routes, setRoutes] = useState<GreenRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: apiData } = await api.getGreenRoutes(date);

      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        setRoutes(apiData);
      } else {
        const { data: supabaseData } = await supabase
          .from("green_routes")
          .select("*")
          .order("velocity", { ascending: false });

        if (supabaseData) setRoutes(supabaseData);
      }
      setLoading(false);
    };

    fetchData();
    if (!isPaused) {
      const interval = setInterval(fetchData, 15000);
      return () => clearInterval(interval);
    }
  }, [date, isPaused]);

  const [filterText, setFilterText] = useState("");
  const [limit, setLimit] = useState(5);

  const filteredRoutes = routes
    .filter((route) =>
      route.street_name.toLowerCase().includes(filterText.toLowerCase())
    )
    .slice(0, limit);

  return (
    <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155]">
      <div className="flex flex-col gap-4 mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg
            className="w-5 h-5 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Green Routes
        </h3>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Filter street..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="flex-1 bg-[#0f172a] text-white text-sm border border-[#334155] rounded px-3 py-1 focus:outline-none focus:border-emerald-400"
          />
          <input
            type="number"
            min="1"
            max="20"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value) || 5)}
            className="w-16 bg-[#0f172a] text-white text-sm border border-[#334155] rounded px-2 py-1 focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-16 bg-[#0f172a] rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : filteredRoutes.length === 0 ? (
        <div className="text-center py-8 text-slate-400">No routes found</div>
      ) : (
        <div className="space-y-2">
          {filteredRoutes.map((route, idx) => (
            <div
              key={idx}
              className="bg-[#0f172a] p-4 rounded-lg border border-emerald-500/30 hover:border-emerald-500/60 transition-all hover:bg-emerald-500/5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-emerald-400 flex items-center gap-2">
                  <span className="text-xl">🌱</span>
                  {route.street_name}
                </div>
                <span className="text-2xl font-bold text-emerald-400">
                  {route.velocity.toFixed(1)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Hour: </span>
                  <span className="text-sky-400">{route.hour}:00</span>
                </div>
                <div>
                  <span className="text-slate-400">Location: </span>
                  <span className="text-sky-400">
                    {route.lat.toFixed(2)}, {route.long.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
