const API_BASE_URL = "http://localhost:8000";

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}


export const api = {
  async getAvgSpeedKpi(hour?: number): Promise<ApiResponse<any[]>> {
    try {
      const url = hour !== undefined ? `${API_BASE_URL}/avg_speed_kpi?hour=${hour}` : `${API_BASE_URL}/avg_speed_kpi`;
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },

  async getHeatmapData(hour?: number): Promise<ApiResponse<any[]>> {
    try {
      const url = hour !== undefined ? `${API_BASE_URL}/heatmap_data?hour=${hour}` : `${API_BASE_URL}/heatmap_data`;
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      console.log("HEAT MAP:", data);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },

  async getPeakAnalysis(hour?: number): Promise<ApiResponse<any[]>> {
    try {
      const url = hour !== undefined ? `${API_BASE_URL}/peak_analysis?hour=${hour}` : `${API_BASE_URL}/peak_analysis`;
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },

  async getTrafficForecast(hour?: number): Promise<ApiResponse<any[]>> {
    try {
      const url = hour !== undefined ? `${API_BASE_URL}/traffic_forecast?hour=${hour}` : `${API_BASE_URL}/traffic_forecast`;
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },

  async getGreenRoutes(hour?: number): Promise<ApiResponse<any[]>> {
    try {
      const url = hour !== undefined ? `${API_BASE_URL}/green_routes?hour=${hour}` : `${API_BASE_URL}/green_routes`;
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },

  async getTrafficAnomalies(hour?: number): Promise<ApiResponse<any[]>> {
    try {
      const url = hour !== undefined ? `${API_BASE_URL}/traffic_anomalies?hour=${hour}` : `${API_BASE_URL}/traffic_anomalies`;
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },

  async getCityHealthSummary(hour?: number): Promise<ApiResponse<any[]>> {
    try {
      const url = hour !== undefined ? `${API_BASE_URL}/city_health_summary?hour=${hour}` : `${API_BASE_URL}/city_health_summary`;
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },

  async getTopCongestionList(hour?: number): Promise<ApiResponse<any[]>> {
    try {
      const url = hour !== undefined ? `${API_BASE_URL}/top_congestion_list?hour=${hour}` : `${API_BASE_URL}/top_congestion_list`;
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },

  async getRoadVolatility(hour?: number): Promise<ApiResponse<any[]>> {
    try {
      const url = hour !== undefined ? `${API_BASE_URL}/road_volatility?hour=${hour}` : `${API_BASE_URL}/road_volatility`;
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },

  async getWeekendVsWeekday(hour?: number): Promise<ApiResponse<any[]>> {
    try {
      const url = hour !== undefined ? `${API_BASE_URL}/weekend_vs_weekday?hour=${hour}` : `${API_BASE_URL}/weekend_vs_weekday`;
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  },

  async getEfficiencyLoss(hour?: number): Promise<ApiResponse<any[]>> {
    try {
      const url = hour !== undefined ? `${API_BASE_URL}/efficiency_loss?hour=${hour}` : `${API_BASE_URL}/efficiency_loss`;
      const response = await fetch(url, {
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
