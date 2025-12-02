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
  const [selectedDate, setSelectedDate] = React.useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [isPaused, setIsPaused] = React.useState<boolean>(false);
  const [selectedHour, setSelectedHour] = React.useState<number>(
    new Date().getHours()
  );

  return (
    <main className="flex flex-col min-h-screen bg-[#0f172a] p-6 gap-6">
      <div className="sticky top-6 z-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0f172a]/80 backdrop-blur-sm p-4 rounded-xl border border-[#334155]">
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

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              isPaused
                ? "bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30"
                : "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30"
            }`}
          >
            {isPaused ? (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Resume Updates
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Pause Updates
              </>
            )}
          </button>

          <div className="flex items-center gap-2 bg-[#1e293b] p-2 rounded-lg border border-[#334155]">
            <label
              htmlFor="date-picker"
              className="text-slate-400 text-sm font-medium"
            >
              Select Date:
            </label>
            <input
              type="date"
              id="date-picker"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#0f172a] text-white border border-[#334155] rounded px-3 py-1 focus:outline-none focus:border-sky-400 transition-colors"
            />
          </div>
        </div>
      </div>

      <CityHealthSummary
        date={selectedDate}
        isPaused={isPaused}
        selectedHour={selectedHour}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpeedTrends date={selectedDate} isPaused={isPaused} />
        </div>
        <div>
          <GreenRoutes date={selectedDate} isPaused={isPaused} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HeatmapVisualization
          date={selectedDate}
          isPaused={isPaused}
          selectedHour={selectedHour}
          setSelectedHour={setSelectedHour}
        />
        <PeakAnalysis date={selectedDate} isPaused={isPaused} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrafficForecast date={selectedDate} isPaused={isPaused} />
        <TrafficAnomalies date={selectedDate} isPaused={isPaused} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopCongestion date={selectedDate} isPaused={isPaused} />
        <RoadVolatility date={selectedDate} isPaused={isPaused} />
      </div>

      <WeekendComparison date={selectedDate} isPaused={isPaused} />

      <EfficiencyLoss date={selectedDate} isPaused={isPaused} />
    </main>
  );
};
