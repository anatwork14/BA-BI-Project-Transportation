/*
  # Traffic Intelligence Data Schema

  ## Overview
  Creates 11 comprehensive tables for traffic data visualization, forecasting, and analysis.

  ## Tables
  
  ### 1. avg_speed_kpi (Speed Trends Per Road)
  - `id` (uuid, primary key)
  - `street_name` (text) - Road name
  - `hour` (integer) - Hour of day (0-23)
  - `avg_speed` (numeric) - Average speed in km/h
  - `max_speed_observed` (numeric) - Maximum speed observed
  - `created_at` (timestamptz) - Record creation time

  ### 2. heatmap_data (Map Visualization)
  - `id` (uuid, primary key)
  - `lat` (numeric) - Latitude
  - `long` (numeric) - Longitude
  - `hour` (integer) - Hour of day
  - `speed` (numeric) - Current speed
  - `intensity` (numeric) - Intensity calculated as 100/(speed+1)
  - `created_at` (timestamptz)

  ### 3. peak_analysis (Congestion Comparison)
  - `id` (uuid, primary key)
  - `street_name` (text)
  - `period` (text) - 'Morning Peak', 'Evening Peak', 'Off-Peak'
  - `period_avg_speed` (numeric)
  - `created_at` (timestamptz)

  ### 4. traffic_forecast (ML Predictions)
  - `id` (uuid, primary key)
  - `street_name` (text)
  - `hour` (integer)
  - `velocity` (numeric) - Current speed
  - `predicted_speed_next_hour` (numeric)
  - `created_at` (timestamptz)

  ### 5. green_routes (Eco-Friendly Fast Roads)
  - `id` (uuid, primary key)
  - `street_name` (text)
  - `hour` (integer)
  - `velocity` (numeric)
  - `lat` (numeric)
  - `long` (numeric)
  - `created_at` (timestamptz)

  ### 6. traffic_anomalies (Alerts)
  - `id` (uuid, primary key)
  - `street_name` (text)
  - `hour` (integer)
  - `velocity` (numeric) - Current speed
  - `daily_avg` (numeric)
  - `alert` (text) - Alert message
  - `created_at` (timestamptz)

  ### 7. city_health_summary (KPIs)
  - `id` (uuid, primary key)
  - `hour` (integer)
  - `city_avg_speed` (numeric)
  - `total_active_roads` (integer)
  - `jammed_roads_count` (integer)
  - `congestion_level` (text) - 'CRITICAL', 'HIGH', 'NORMAL'
  - `created_at` (timestamptz)

  ### 8. top_congestion_list (Leaderboard)
  - `id` (uuid, primary key)
  - `street_name` (text)
  - `hour` (integer)
  - `velocity` (numeric)
  - `rank` (integer)
  - `lat` (numeric)
  - `long` (numeric)
  - `created_at` (timestamptz)

  ### 9. road_volatility (Reliability Index)
  - `id` (uuid, primary key)
  - `street_name` (text)
  - `std_dev` (numeric) - Standard deviation
  - `avg` (numeric) - Average speed
  - `reliability_status` (text)
  - `created_at` (timestamptz)

  ### 10. weekend_vs_weekday (Planning Tool)
  - `id` (uuid, primary key)
  - `street_name` (text)
  - `hour` (integer)
  - `is_weekend` (text) - 'Weekday' or 'Weekend'
  - `avg_speed` (numeric)
  - `created_at` (timestamptz)

  ### 11. efficiency_loss (Economic Impact)
  - `id` (uuid, primary key)
  - `street_name` (text)
  - `hour` (integer)
  - `velocity` (numeric)
  - `max_potential` (numeric)
  - `efficiency_pct` (numeric) - Efficiency percentage
  - `created_at` (timestamptz)

  ## Security
  - All tables have RLS enabled with public read access for dashboard
*/

-- 1. avg_speed_kpi
CREATE TABLE IF NOT EXISTS avg_speed_kpi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  street_name text NOT NULL,
  hour integer NOT NULL,
  avg_speed numeric NOT NULL,
  max_speed_observed numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE avg_speed_kpi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON avg_speed_kpi FOR SELECT
  TO anon
  USING (true);

-- 2. heatmap_data
CREATE TABLE IF NOT EXISTS heatmap_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lat numeric NOT NULL,
  long numeric NOT NULL,
  hour integer NOT NULL,
  speed numeric NOT NULL,
  intensity numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE heatmap_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON heatmap_data FOR SELECT
  TO anon
  USING (true);

-- 3. peak_analysis
CREATE TABLE IF NOT EXISTS peak_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  street_name text NOT NULL,
  period text NOT NULL,
  period_avg_speed numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE peak_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON peak_analysis FOR SELECT
  TO anon
  USING (true);

-- 4. traffic_forecast
CREATE TABLE IF NOT EXISTS traffic_forecast (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  street_name text NOT NULL,
  hour integer NOT NULL,
  velocity numeric NOT NULL,
  predicted_speed_next_hour numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE traffic_forecast ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON traffic_forecast FOR SELECT
  TO anon
  USING (true);

-- 5. green_routes
CREATE TABLE IF NOT EXISTS green_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  street_name text NOT NULL,
  hour integer NOT NULL,
  velocity numeric NOT NULL,
  lat numeric NOT NULL,
  long numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE green_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON green_routes FOR SELECT
  TO anon
  USING (true);

-- 6. traffic_anomalies
CREATE TABLE IF NOT EXISTS traffic_anomalies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  street_name text NOT NULL,
  hour integer NOT NULL,
  velocity numeric NOT NULL,
  daily_avg numeric NOT NULL,
  alert text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE traffic_anomalies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON traffic_anomalies FOR SELECT
  TO anon
  USING (true);

-- 7. city_health_summary
CREATE TABLE IF NOT EXISTS city_health_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hour integer NOT NULL,
  city_avg_speed numeric NOT NULL,
  total_active_roads integer NOT NULL,
  jammed_roads_count integer NOT NULL,
  congestion_level text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE city_health_summary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON city_health_summary FOR SELECT
  TO anon
  USING (true);

-- 8. top_congestion_list
CREATE TABLE IF NOT EXISTS top_congestion_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  street_name text NOT NULL,
  hour integer NOT NULL,
  velocity numeric NOT NULL,
  rank integer NOT NULL,
  lat numeric NOT NULL,
  long numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE top_congestion_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON top_congestion_list FOR SELECT
  TO anon
  USING (true);

-- 9. road_volatility
CREATE TABLE IF NOT EXISTS road_volatility (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  street_name text NOT NULL,
  std_dev numeric NOT NULL,
  avg numeric NOT NULL,
  reliability_status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE road_volatility ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON road_volatility FOR SELECT
  TO anon
  USING (true);

-- 10. weekend_vs_weekday
CREATE TABLE IF NOT EXISTS weekend_vs_weekday (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  street_name text NOT NULL,
  hour integer NOT NULL,
  is_weekend text NOT NULL,
  avg_speed numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weekend_vs_weekday ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON weekend_vs_weekday FOR SELECT
  TO anon
  USING (true);

-- 11. efficiency_loss
CREATE TABLE IF NOT EXISTS efficiency_loss (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  street_name text NOT NULL,
  hour integer NOT NULL,
  velocity numeric NOT NULL,
  max_potential numeric NOT NULL,
  efficiency_pct numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE efficiency_loss ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON efficiency_loss FOR SELECT
  TO anon
  USING (true);

-- Insert sample data for avg_speed_kpi
INSERT INTO avg_speed_kpi (street_name, hour, avg_speed, max_speed_observed)
VALUES 
  ('Nguyen Hue', 7, 15.4, 45.0),
  ('Nguyen Hue', 8, 12.1, 30.2),
  ('Le Loi', 7, 35.5, 50.0),
  ('Le Loi', 8, 38.2, 52.0);

-- Insert sample data for heatmap_data
INSERT INTO heatmap_data (lat, long, hour, speed, intensity)
VALUES
  (10.776, 106.700, 7, 4.0, 20.00),
  (10.776, 106.700, 8, 5.5, 15.38),
  (10.820, 106.680, 7, 49.0, 2.00),
  (10.820, 106.680, 8, 45.5, 2.15);

-- Insert sample data for peak_analysis
INSERT INTO peak_analysis (street_name, period, period_avg_speed)
VALUES
  ('Cach Mang Thang 8', 'Morning Peak', 12.50),
  ('Cach Mang Thang 8', 'Evening Peak', 10.10),
  ('Cach Mang Thang 8', 'Off-Peak', 45.20);

-- Insert sample data for traffic_forecast
INSERT INTO traffic_forecast (street_name, hour, velocity, predicted_speed_next_hour)
VALUES
  ('Vo Van Kiet', 14, 55.0, 53.2),
  ('Vo Van Kiet', 15, 53.0, 48.5),
  ('Vo Van Kiet', 16, 48.0, 25.1);

-- Insert sample data for green_routes
INSERT INTO green_routes (street_name, hour, velocity, lat, long)
VALUES
  ('Mai Chi Tho', 7, 62.5, 10.78, 106.72),
  ('Pham Van Dong', 7, 58.0, 10.81, 106.75);

-- Insert sample data for traffic_anomalies
INSERT INTO traffic_anomalies (street_name, hour, velocity, daily_avg, alert)
VALUES
  ('Dien Bien Phu', 9, 5.0, 40.0, 'Severe Congestion'),
  ('Xo Viet Nghe Tinh', 18, 3.2, 25.0, 'Severe Congestion');

-- Insert sample data for city_health_summary
INSERT INTO city_health_summary (hour, city_avg_speed, total_active_roads, jammed_roads_count, congestion_level)
VALUES
  (7, 22.5, 1500, 450, 'CRITICAL'),
  (10, 45.0, 1450, 10, 'NORMAL'),
  (17, 18.2, 1600, 150, 'HIGH');

-- Insert sample data for top_congestion_list
INSERT INTO top_congestion_list (street_name, hour, velocity, rank, lat, long)
VALUES
  ('Cong Hoa', 17, 2.5, 1, 10.80, 106.65),
  ('Truong Chinh', 17, 3.1, 2, 10.81, 106.62),
  ('Au Co', 17, 4.0, 3, 10.79, 106.64);

-- Insert sample data for road_volatility
INSERT INTO road_volatility (street_name, std_dev, avg, reliability_status)
VALUES
  ('Nguyen Van Linh', 2.1, 55.0, 'Reliable (Always fast)'),
  ('Pasteur', 4.5, 30.0, 'Reliable (Always slow)'),
  ('Hanoi Highway', 18.2, 40.0, 'Highly Unstable (Risky)');

-- Insert sample data for weekend_vs_weekday
INSERT INTO weekend_vs_weekday (street_name, hour, is_weekend, avg_speed)
VALUES
  ('District 1 Center', 19, 'Weekday', 10.5),
  ('District 1 Center', 19, 'Weekend', 40.2);

-- Insert sample data for efficiency_loss
INSERT INTO efficiency_loss (street_name, hour, velocity, max_potential, efficiency_pct)
VALUES
  ('Nam Ky Khoi Nghia', 8, 15.0, 60.0, 25.0),
  ('Hai Ba Trung', 8, 12.0, 40.0, 30.0);
