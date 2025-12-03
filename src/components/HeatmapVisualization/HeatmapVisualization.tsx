import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface HeatmapPoint {
  lat: number;
  long: number;
  speed: number;
  intensity: number;
}

export const HeatmapVisualization = ({
  selectedHour = new Date().getHours(),
  setSelectedHour,
}: {
    selectedHour?: number;
  setSelectedHour?: (hour: number) => void;
}): JSX.Element => {
  const [points, setPoints] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: apiData } = await api.getHeatmapData(selectedHour > 16 ? 16: selectedHour);

      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        setPoints(apiData);
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedHour]);

  const getIntensityColor = (intensity: number) => {
    if (intensity > 15) return "#ef4444"; // red-500
    if (intensity > 10) return "#f97316"; // orange-500
    if (intensity > 5) return "#eab308"; // yellow-500
    return "#22c55e"; // green-500
  };

  // Default center (Ho Chi Minh City)
  const center: [number, number] = [10.7769, 106.7009];

  return (
    <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
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
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          Traffic Heatmap
        </h3>

        <div className="flex items-center gap-2 bg-[#0f172a] p-2 rounded-lg border border-[#334155]">
          <span className="text-xs text-slate-400">Time:</span>
          <input
            type="range"
            min="6"
            max="18"
            value={selectedHour}
            onChange={(e) => setSelectedHour?.(parseInt(e.target.value))}
            className="w-32 accent-indigo-500"
          />
          <span className="text-sm font-bold text-white w-12 text-right">
            {selectedHour}:00
          </span>
        </div>
      </div>
      <div className="h-[400px] w-full rounded-lg overflow-hidden border border-[#334155] relative z-0">
        {loading && (
          <div className="absolute inset-0 bg-[#0f172a]/80 flex items-center justify-center z-10">
            <span className="text-slate-400">Loading map data...</span>
          </div>
        )}
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {points.map((point, idx) => (
            <Circle
              key={idx}
              center={[point.lat, point.long]}
              pathOptions={{
                fillColor: getIntensityColor(point.intensity),
                color: getIntensityColor(point.intensity),
                weight: 1,
                opacity: 0.8,
                fillOpacity: 0.6,
              }}
              radius={point.intensity * 20}
            >
              <Popup>
                <div className="text-slate-900">
                  <p className="font-bold">
                    Speed: {point.speed.toFixed(1)} km/h
                  </p>
                  <p>Intensity: {point.intensity.toFixed(2)}</p>
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>

        <div className="absolute top-4 right-4 bg-[#0f1028]/90 backdrop-blur-sm px-4 py-3 rounded-lg border border-[#2d2e5f] z-[1000]">
          <div className="text-xs font-semibold text-gray-300 mb-2">
            Intensity Scale
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-xs text-gray-400">High (Congested)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-xs text-gray-400">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-xs text-gray-400">Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-xs text-gray-400">Low (Fast)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {points.slice(0, 4).map((point, idx) => (
          <div
            key={idx}
            className="bg-[#0f1028] p-3 rounded-lg border border-[#2d2e5f]"
          >
            <div className="text-xs text-gray-400">Location {idx + 1}</div>
            <div className="text-sm font-medium text-cyan-400">
              {point.speed.toFixed(1)} km/h
            </div>
            <div className="text-xs text-gray-500">
              Intensity: {point.intensity.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
