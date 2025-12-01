import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { supabase } from "../../lib/supabase";

interface GreenRoute {
  street_name: string;
  hour: number;
  velocity: number;
  lat: number;
  long: number;
}

export const GreenRoutes = (): JSX.Element => {
  const [routes, setRoutes] = useState<GreenRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: apiData } = await api.getGreenRoutes();

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
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#1a1b3d] rounded-xl p-6 border border-[#2d2e5f]">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Green Routes - Recommended Fast Roads
      </h3>

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-[#0f1028] rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : routes.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No green routes available</div>
      ) : (
        <div className="space-y-2">
          {routes.map((route, idx) => (
            <div
              key={idx}
              className="bg-[#0f1028] p-4 rounded-lg border border-green-500/30 hover:border-green-500/60 transition-all hover:bg-green-500/5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-green-400 flex items-center gap-2">
                  <span className="text-xl">🌱</span>
                  {route.street_name}
                </div>
                <span className="text-2xl font-bold text-green-400">{route.velocity.toFixed(1)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Hour: </span>
                  <span className="text-cyan-400">{route.hour}:00</span>
                </div>
                <div>
                  <span className="text-gray-400">Location: </span>
                  <span className="text-cyan-400">{route.lat.toFixed(2)}, {route.long.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
