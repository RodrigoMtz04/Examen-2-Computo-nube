-- Create database
CREATE DATABASE IF NOT EXISTS fitness_bands_db;
USE fitness_bands_db;

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `int` VARCHAR(10) NOT NULL,
    ex VARCHAR(10) NOT NULL,
    mot VARCHAR(10) NOT NULL,
    tech VARCHAR(10) NOT NULL,
    predicted_band VARCHAR(50) NOT NULL,
    confidence DECIMAL(5, 4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Insert sample fitness bands data for training
CREATE TABLE IF NOT EXISTS fitness_bands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    `int` VARCHAR(10) NOT NULL,
    `ex` VARCHAR(10) NOT NULL,
    `mot` VARCHAR(10) NOT NULL,
    `tech` VARCHAR(10) NOT NULL
    );

-- Datos de la tabla del proyecto Data Mining
INSERT INTO fitness_bands (name, `int`, `ex`, `mot`, `tech`) VALUES
    ('iHealth Band 100', 'B', 'S', 'M', 'Y'),
    ('iHealth Band 100', 'B', 'S', 'M', 'N'),
    ('iHealth Band 500', 'H', 'S', 'M', 'Y'),
    ('iHealth Band 500', 'A', 'A', 'M', 'Y'),
    ('iHealth Band 500', 'A', 'M', 'A', 'Y'),
    ('iHealth Band 100', 'A', 'M', 'A', 'N'),
    ('iHealth Band 500', 'H', 'M', 'A', 'N'),
    ('iHealth Band 100', 'B', 'A', 'M', 'Y'),
    ('iHealth Band 500', 'B', 'M', 'A', 'Y'),
    ('iHealth Band 500', 'A', 'A', 'A', 'Y'),
    ('iHealth Band 500', 'B', 'A', 'A', 'N'),
    ('iHealth Band 500', 'H', 'A', 'M', 'N'),
    ('iHealth Band 500', 'H', 'S', 'A', 'Y'),
    ('iHealth Band 100', 'A', 'A', 'M', 'N'),
    ('iHealth Band 100', 'H', 'S', 'M', 'N');