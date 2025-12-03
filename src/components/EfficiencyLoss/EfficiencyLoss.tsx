import { useEffect, useState } from "react";
import { api } from "../../lib/api";

interface EfficiencyData {
  street_name: string;
  hour: number;
  velocity: number;
  max_potential: number;
  efficiency_pct: number;
}

export const EfficiencyLoss = (): JSX.Element => {
  const [items, setItems] = useState<EfficiencyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [hourFilter, setHourFilter] = useState("All");
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: apiData } = await api.getEfficiencyLoss();

      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        const filtered = apiData.filter(
          (item) => item.efficiency_pct < 50 && item.street_name
        );

        // Deduplicate: allow only 1 entry per street per hour
        const uniqueMap = new Map();
        filtered.forEach((item) => {
          const key = `${item.street_name}-${item.hour}`;
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
          }
        });

        setItems(Array.from(uniqueMap.values()));
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const getSeverity = (efficiency: number) => {
    if (efficiency < 25)
      return {
        level: "Critical",
        color: "bg-red-500/20 border-red-500/30 text-red-400",
      };
    if (efficiency < 35)
      return {
        level: "High",
        color: "bg-orange-500/20 border-orange-500/30 text-orange-400",
      };
    return {
      level: "Moderate",
      color: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
    };
  };

  return (
    <div className="bg-[#1a1b3d] rounded-xl p-6 border border-[#2d2e5f]">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-orange-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Infrastructure Efficiency Loss
      </h3>

      <div className="mb-4 space-y-3">
        <input
          type="text"
          placeholder="Search street..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#0f1028] text-white text-sm border border-[#2d2e5f] rounded px-3 py-2 focus:outline-none focus:border-orange-400 placeholder-slate-500"
        />
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 bg-[#0f1028] text-white text-sm border border-[#2d2e5f] rounded px-3 py-2 focus:outline-none focus:border-orange-400"
          >
            <option value="All">All Status</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Moderate">Moderate</option>
          </select>
          <select
            value={hourFilter}
            onChange={(e) => setHourFilter(e.target.value)}
            className="w-24 bg-[#0f1028] text-white text-sm border border-[#2d2e5f] rounded px-3 py-2 focus:outline-none focus:border-orange-400"
          >
            <option value="All">All Hours</option>
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {i}:00
              </option>
            ))}
          </select>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-24 bg-[#0f1028] text-white text-sm border border-[#2d2e5f] rounded px-3 py-2 focus:outline-none focus:border-orange-400"
          >
            <option value={5}>5 items</option>
            <option value={10}>10 items</option>
            <option value={20}>20 items</option>
            <option value={30}>30 items</option>
          </select>
        </div>
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
      ) : items.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-3xl mb-2">✓</div>
          <div className="text-gray-400">
            All infrastructure operating efficiently
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {items
            .filter((item) => {
              const matchesSearch = (item.street_name || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
              const severity = getSeverity(item.efficiency_pct);
              const matchesStatus =
                statusFilter === "All" || severity.level === statusFilter;
              const matchesHour =
                hourFilter === "All" || item.hour === Number(hourFilter);
              return matchesSearch && matchesStatus && matchesHour;
            })
            .slice(0, limit)
            .map((item, idx) => {
              const severity = getSeverity(item.efficiency_pct);
              const loss = 100 - item.efficiency_pct;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${severity.color}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="font-semibold text-white">
                      {item.street_name}
                    </div>
                    <div className="bg-red-500/30 px-3 py-1 rounded-full">
                      <span className="text-sm font-bold text-red-400">
                        {severity.level}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                    <div>
                      <span className="text-gray-400">Current: </span>
                      <span className="font-medium">
                        {item.velocity.toFixed(1)} km/h
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Potential: </span>
                      <span className="font-medium">
                        {item.max_potential.toFixed(1)} km/h
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Hour: </span>
                      <span className="font-medium">{item.hour}:00</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Efficiency Usage</span>
                      <span className="font-bold">
                        {item.efficiency_pct.toFixed(1)}%
                      </span>
                    </div>
                    <div className="bg-[#0f1028] rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-red-500"
                        style={{ width: `${item.efficiency_pct}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      Loss: {loss.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
