const API_BASE_URL = "https://ok-442068653515.us-central1.run.app";

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

const fallbackToSupabase = async (supabaseQuery: Promise<any>) => {
  try {
    return await supabaseQuery;
  } catch (err) {
    console.error("API fallback to Supabase:", err);
    return null;
  }
};

export const api = {
  async getAvgSpeedKpi(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/avg_speed_kpi`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },

  async getHeatmapData(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/heatmap_data`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },

  async getPeakAnalysis(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/peak_analysis`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },

  async getTrafficForecast(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/traffic_forecast`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },

  async getGreenRoutes(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/green_routes`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },

  async getTrafficAnomalies(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/traffic_anomalies`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },

  async getCityHealthSummary(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/city_health_summary`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },

  async getTopCongestionList(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/top_congestion_list`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },

  async getRoadVolatility(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/road_volatility`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },

  async getWeekendVsWeekday(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/weekend_vs_weekday`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },

  async getEfficiencyLoss(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/efficiency_loss`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },
};
