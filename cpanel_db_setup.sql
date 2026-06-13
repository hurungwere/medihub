-- AtroMed MySQL Database Setup Script
-- Compatible with cPanel MySQL/MariaDB and phpMyAdmin

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `tenders`;
DROP TABLE IF EXISTS `suppliers`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Create the 'users' table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) DEFAULT NULL,
  `organization` VARCHAR(255) DEFAULT NULL,
  `orgType` VARCHAR(50) DEFAULT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create the 'tenders' table
CREATE TABLE `tenders` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `facility` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `bids` INT DEFAULT 0,
  `deadline` VARCHAR(50) DEFAULT NULL,
  `quantity` VARCHAR(100) DEFAULT NULL,
  `budget` VARCHAR(50) DEFAULT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create the 'suppliers' table
CREATE TABLE `suppliers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `rating` DECIMAL(3, 2) DEFAULT NULL,
  `specialties` TEXT NOT NULL,
  `verified` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Seed Data
-- --------------------------------------------------------

-- Seed tenders
INSERT INTO `tenders` (`id`, `title`, `facility`, `category`, `status`, `bids`, `deadline`, `quantity`, `budget`) VALUES
('TND-089', 'Defibrillator Replacement Parts', 'City General Hospital', 'Medical Equipment', 'Active', 12, '2026-06-20', '20 units', '$8,200'),
('TND-088', 'Surgical Gloves (Latex-Free)', 'Metro Health Clinic', 'Consumables', 'Reviewing', 45, '2026-06-10', '10,000 boxes', '$18,500'),
('TND-087', 'MRI Contrast Agents', 'Northside Cardiology', 'Pharmaceuticals', 'Active', 8, '2026-06-25', '500 units', '$25,000'),
('TND-086', 'N95 Respirator Masks', 'Kaiser Permanente', 'Consumables', 'Closed', 62, '2026-06-01', '50,000 units', '$45,000');

-- Seed suppliers
INSERT INTO `suppliers` (`name`, `type`, `location`, `rating`, `specialties`, `verified`) VALUES
('MedicaCorp Industries', 'Manufacturer', 'Frankfurt, Germany', 4.90, '["Surgical Instruments","Orthopedics"]', 1),
('Global Health Distributors', 'Distributor', 'New York, USA', 4.80, '["Pharmaceuticals","Consumables"]', 1),
('Precision Imaging Ltd', 'Manufacturer', 'Tokyo, Japan', 5.00, '["MRI Systems","X-Ray"]', 1),
('Apex Medical Supplies', 'Distributor', 'London, UK', 4.70, '["PPE","General Medical"]', 1),
('BioTech Synthetics', 'Manufacturer', 'Boston, USA', 4.90, '["Implants","Biologics"]', 1),
('MedHub Logistics', 'Distributor', 'Dubai, UAE', 4.60, '["Cold Chain","Vaccines"]', 1);
