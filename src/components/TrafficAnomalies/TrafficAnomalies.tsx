import { useEffect, useState } from "react";
import { api } from "../../lib/api";

interface Anomaly {
  street_name: string;
  hour: number;
  velocity: number;
  daily_avg: number;
  alert: string;
}

export const TrafficAnomalies = (): JSX.Element => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: apiData } = await api.getTrafficAnomalies();

      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        setAnomalies(apiData);
      }
      setLoading(false);
    };

    fetchData();
   
  }, []);

  const getSeverityColor = (severity: number) => {
    if (severity < 10) return "bg-red-500/20 border-red-500/30";
    if (severity < 20) return "bg-orange-500/20 border-orange-500/30";
    return "bg-yellow-500/20 border-yellow-500/30";
  };

  // Deduplicate and filter anomalies
  // Deduplicate and filter anomalies
  const uniqueAnomaliesMap = new Map<string, Anomaly>();
  const currentHour = new Date().getHours();

  anomalies.forEach((item) => {
    if (!item.street_name) return;
    
    // Filter by current hour
    if (item.hour !== currentHour) return;

    if (
      searchTerm &&
      !item.street_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return;
    }

    // Create a unique key based on street name and hour
    const key = `${item.street_name}-${item.hour}`;
    if (!uniqueAnomaliesMap.has(key)) {
      uniqueAnomaliesMap.set(key, item);
    }
  });

  const filteredAnomalies = Array.from(uniqueAnomaliesMap.values());

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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        Traffic Anomalies & Alerts
      </h3>

      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-2 bg-[#0f172a] p-2 rounded-lg border border-[#2d2e5f]">
          <label htmlFor="ta-limit-select" className="text-sm text-slate-400">
            Show:
          </label>
          <select
            id="ta-limit-select"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="bg-[#1a1b3d] text-white text-sm border border-[#2d2e5f] rounded px-2 py-1 focus:outline-none focus:border-red-400"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search street..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-[#0f172a] text-white text-sm border border-[#2d2e5f] rounded px-3 py-1 focus:outline-none focus:border-red-400 min-w-[150px]"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-16 bg-[#0f1028] rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : filteredAnomalies.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-2xl mb-2">✓</div>
          <div className="text-gray-400">No anomalies detected</div>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {filteredAnomalies.slice(0, limit).map((anomaly, idx) => {
            const velocity = Number(anomaly.velocity) || 0;
            const dailyAvg = Number(anomaly.daily_avg) || 0;
            const speedPercent = dailyAvg !== 0 ? (velocity / dailyAvg) * 100 : 0;
            const severity = getSeverityColor(velocity);

            return (
              <div key={idx} className={`p-4 rounded-lg border ${severity}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-white">
                    {anomaly.street_name}
                  </div>
                  <div className="bg-red-500/30 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-red-400">
                      {anomaly.alert}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400">Current: </span>
                    <span className="text-red-400 font-medium">
                      {velocity.toFixed(1)} km/h
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Daily Avg: </span>
                    <span className="text-cyan-400 font-medium">
                      {dailyAvg.toFixed(1)} km/h
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">At Hour: </span>
                    <span className="text-orange-400 font-medium">
                      {anomaly.hour}:00
                    </span>
                  </div>
                </div>
                <div className="mt-2 bg-[#0f1028] rounded-full h-1 overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${Math.min(speedPercent, 100)}%` }}
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
