-- Create database
CREATE DATABASE IF NOT EXISTS fitness_bands_db;
USE fitness_bands_db;

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hm VARCHAR(10) NOT NULL,
  cel VARCHAR(10) NOT NULL,
  mi VARCHAR(10) NOT NULL,
  predicted_band VARCHAR(50) NOT NULL,
  confidence DECIMAL(5, 4) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample fitness bands data for training
CREATE TABLE IF NOT EXISTS fitness_bands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  hm VARCHAR(10) NOT NULL,
  cel VARCHAR(10) NOT NULL,
  mi VARCHAR(10) NOT NULL
);

INSERT INTO fitness_bands (name, hm, cel, mi) VALUES
('iHealth Band 100', 'M', 'S', 'H'),
('iHealth Band 100', 'M', 'A', 'A'),
('iHealth Band 100', 'A', 'S', 'H'),
('iHealth Band 100', 'M', 'M', 'B'),
('iHealth Band 100', 'A', 'A', 'A'),
('iHealth Band 100', 'M', 'S', 'A'),
('iHealth Band 100', 'M', 'M', 'H'),
('iHealth Band 100', 'A', 'M', 'B'),
('iHealth Band 500', 'A', 'A', 'H'),
('iHealth Band 500', 'M', 'S', 'A'),
('iHealth Band 500', 'A', 'M', 'H'),
('iHealth Band 500', 'M', 'A', 'B'),
('iHealth Band 500', 'A', 'S', 'A'),
('iHealth Band 500', 'M', 'M', 'H'),
('iHealth Band 500', 'A', 'A', 'B');
