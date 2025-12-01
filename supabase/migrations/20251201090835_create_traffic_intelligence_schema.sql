/*
  # Predictive Traffic Intelligence Schema

  ## Overview
  Creates tables for storing real-time traffic data, predictions, and alerts for the San Francisco Metro traffic intelligence dashboard.

  ## New Tables
  
  ### `traffic_metrics`
  - `id` (uuid, primary key) - Unique identifier
  - `timestamp` (timestamptz) - Time of measurement
  - `change_rate` (numeric) - Percentage change rate
  - `total_vehicles` (integer) - Total active vehicles count
  - `vehicle_change` (numeric) - Vehicle count change percentage
  - `congestion_index` (numeric) - Congestion index (0-100)
  - `active_incidents` (integer) - Number of active incidents
  - `incident_change` (integer) - Change in incidents
  - `created_at` (timestamptz) - Record creation time

  ### `vehicle_density`
  - `id` (uuid, primary key) - Unique identifier
  - `location` (text) - Location identifier
  - `latitude` (numeric) - Latitude coordinate
  - `longitude` (numeric) - Longitude coordinate
  - `density_level` (text) - Density level (low, medium, high)
  - `vehicle_count` (integer) - Number of vehicles
  - `timestamp` (timestamptz) - Measurement time
  - `created_at` (timestamptz) - Record creation time

  ### `speed_trends`
  - `id` (uuid, primary key) - Unique identifier
  - `timestamp` (timestamptz) - Time of measurement
  - `average_speed` (numeric) - Average speed in km/h
  - `created_at` (timestamptz) - Record creation time

  ### `congestion_forecast`
  - `id` (uuid, primary key) - Unique identifier
  - `forecast_time` (timestamptz) - Future time being forecasted
  - `congestion_level` (numeric) - Predicted congestion level (0-100)
  - `confidence` (numeric) - Prediction confidence (0-1)
  - `created_at` (timestamptz) - Record creation time

  ### `traffic_alerts`
  - `id` (uuid, primary key) - Unique identifier
  - `alert_type` (text) - Type of alert (peak_info, road_optimization, anomaly)
  - `severity` (text) - Severity level (info, warning, critical)
  - `title` (text) - Alert title
  - `description` (text) - Alert description
  - `location` (text) - Affected location
  - `timestamp` (timestamptz) - Alert time
  - `is_active` (boolean) - Whether alert is active
  - `created_at` (timestamptz) - Record creation time

  ## Security
  - Enable RLS on all tables
  - Add policies for public read access (dashboard is public-facing)
*/

-- Create traffic_metrics table
CREATE TABLE IF NOT EXISTS traffic_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  change_rate numeric NOT NULL DEFAULT 0,
  total_vehicles integer NOT NULL DEFAULT 0,
  vehicle_change numeric NOT NULL DEFAULT 0,
  congestion_index numeric NOT NULL DEFAULT 0,
  active_incidents integer NOT NULL DEFAULT 0,
  incident_change integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE traffic_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to traffic metrics"
  ON traffic_metrics FOR SELECT
  TO anon
  USING (true);

-- Create vehicle_density table
CREATE TABLE IF NOT EXISTS vehicle_density (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL DEFAULT '',
  latitude numeric NOT NULL DEFAULT 0,
  longitude numeric NOT NULL DEFAULT 0,
  density_level text NOT NULL DEFAULT 'low',
  vehicle_count integer NOT NULL DEFAULT 0,
  timestamp timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vehicle_density ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to vehicle density"
  ON vehicle_density FOR SELECT
  TO anon
  USING (true);

-- Create speed_trends table
CREATE TABLE IF NOT EXISTS speed_trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  average_speed numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE speed_trends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to speed trends"
  ON speed_trends FOR SELECT
  TO anon
  USING (true);

-- Create congestion_forecast table
CREATE TABLE IF NOT EXISTS congestion_forecast (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  forecast_time timestamptz NOT NULL,
  congestion_level numeric NOT NULL DEFAULT 0,
  confidence numeric NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE congestion_forecast ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to congestion forecast"
  ON congestion_forecast FOR SELECT
  TO anon
  USING (true);

-- Create traffic_alerts table
CREATE TABLE IF NOT EXISTS traffic_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type text NOT NULL DEFAULT 'info',
  severity text NOT NULL DEFAULT 'info',
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  location text DEFAULT '',
  timestamp timestamptz NOT NULL DEFAULT now(),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE traffic_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to traffic alerts"
  ON traffic_alerts FOR SELECT
  TO anon
  USING (true);

-- Insert sample data for traffic_metrics
INSERT INTO traffic_metrics (change_rate, total_vehicles, vehicle_change, congestion_index, active_incidents, incident_change)
VALUES (-2.4, 1247, 2.3, 73, 7, 1);

-- Insert sample speed trends (last 24 hours)
INSERT INTO speed_trends (timestamp, average_speed)
SELECT 
  now() - (interval '1 hour' * generate_series(24, 0, -1)),
  35 + (random() * 25)::numeric;

-- Insert sample congestion forecast (next 6 hours)
INSERT INTO congestion_forecast (forecast_time, congestion_level, confidence)
SELECT 
  now() + (interval '1 hour' * generate_series(0, 6)),
  40 + (random() * 40)::numeric,
  0.8 + (random() * 0.2)::numeric;

-- Insert sample traffic alerts
INSERT INTO traffic_alerts (alert_type, severity, title, description, location)
VALUES 
  ('peak_info', 'info', 'Peak Hour Alert', 'Evening peak volume on major roads today. MA Confluence St.', 'Confluence St'),
  ('road_optimization', 'info', 'Road Optimization', 'Route to Mission St, this route will allow the user to reach faster', 'Mission St'),
  ('anomaly', 'critical', 'Anomaly Detected', 'Unusual congestion spike detected in District 7. Severe Traffic', 'District 7');