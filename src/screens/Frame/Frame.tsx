import React from "react";
import { CityHealthSummary } from "../../components/CityHealthSummary/CityHealthSummary";
import { SpeedTrends } from "../../components/SpeedTrends/SpeedTrends";
import { HeatmapVisualization } from "../../components/HeatmapVisualization/HeatmapVisualization";
import { PeakAnalysis } from "../../components/PeakAnalysis/PeakAnalysis";
import { TrafficForecast } from "../../components/TrafficForecast/TrafficForecast";
import { GreenRoutes } from "../../components/GreenRoutes/GreenRoutes";
import { TrafficAnomalies } from "../../components/TrafficAnomalies/TrafficAnomalies";
import { TopCongestion } from "../../components/TopCongestion/TopCongestion";
import { RoadVolatility } from "../../components/RoadVolatility/RoadVolatility";
import { WeekendComparison } from "../../components/WeekendComparison/WeekendComparison";
import { EfficiencyLoss } from "../../components/EfficiencyLoss/EfficiencyLoss";

export const Frame = (): JSX.Element => {

  const [selectedHour, setSelectedHour] = React.useState<number>(
    Math.max(6, Math.min(18, new Date().getHours()))
  );

  return (
    <main className="flex flex-col min-h-screen bg-[#0f172a] p-6 gap-6">
      <div className="block top-6 z-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0f172a]/80 backdrop-blur-sm p-4 rounded-xl">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <svg
            className="w-8 h-8 text-sky-400"
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
          Traffic Intelligence Dashboard
        </h1>

      </div>

      <CityHealthSummary
        selectedHour={selectedHour}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpeedTrends  />
        </div>
        <div>
          <GreenRoutes />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HeatmapVisualization
          selectedHour={selectedHour}
          setSelectedHour={setSelectedHour}
        />
        <PeakAnalysis  />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrafficForecast  />
        <TrafficAnomalies  />
      </div> 

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopCongestion />
        <RoadVolatility />
      </div>

      <WeekendComparison />

      <EfficiencyLoss />
    </main>
  );
};
