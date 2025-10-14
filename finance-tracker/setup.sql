-- Create the database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS `finance_db`;

-- Switch to the newly created database to run the rest of the queries
USE `finance_db`;

-- Drop the old tables if they exist to ensure a clean setup
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `users`;

-- ===================================
-- 1. CREATE THE USERS TABLE
-- ===================================
-- This table will store user information, including their role.
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('superadmin','admin','manager','user') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================
-- 2. CREATE THE TRANSACTIONS TABLE
-- ===================================
-- This table is updated to include a `user_id` to link transactions to a user.
CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `type` enum('income','expense') NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================
-- 3. INSERT SAMPLE USERS
-- ===================================
-- We create one admin (manager) and one regular user.
-- The password for both is 'password123'. It is stored as a secure hash.
INSERT INTO `users` (`username`, `email`, `password`, `role`) VALUES
('superadmin', 'superadmin@test.com', 'superadmin', 'superadmin'),
('admin', 'admin@test.com', 'admin', 'admin'),
('manager', 'manager@test.com', 'manager', 'manager'),
('user', 'user@test.com', 'user', 'user');
-- ===================================
-- 4. INSERT SAMPLE TRANSACTIONS
-- ===================================
-- These transactions are now linked to specific users via their `user_id`.
-- The 'manager' user has ID 1. The 'john_doe' user has ID 2.

-- Transactions for the regular user (john_doe, user_id = 2)
INSERT INTO `transactions` (`user_id`, `description`, `amount`, `type`, `date`) VALUES
(2, 'Initial Salary', 3000.00, 'income', '2023-10-01'),
(2, 'Monthly Rent', 1200.00, 'expense', '2023-10-05'),
(2, 'Groceries', 150.50, 'expense', '2023-10-07');

-- Transactions for the admin/manager (manager, user_id = 1)
INSERT INTO `transactions` (`user_id`, `description`, `amount`, `type`, `date`) VALUES
(1, 'Company Bonus', 5000.00, 'income', '2023-09-15'),
(1, 'Software Subscription', 99.00, 'expense', '2023-09-20');
