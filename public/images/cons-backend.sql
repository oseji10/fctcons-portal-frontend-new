-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 05, 2025 at 02:02 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cons-backend`
--

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
CREATE TABLE IF NOT EXISTS `applications` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `applicationId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `jambId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dateOfBirth` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alternatePhoneNumber` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `licenceId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `batch` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `applicationType` bigint UNSIGNED DEFAULT NULL,
  `userId` bigint UNSIGNED DEFAULT NULL,
  `isActive` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'true',
  `slipPrintCount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `admissionPrintCount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `isPresent` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'false',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'account_created',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `hall` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seatNumber` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `applicationId` (`applicationId`),
  KEY `applications_applicationtype_foreign` (`applicationType`),
  KEY `applications_jambid_foreign` (`jambId`),
  KEY `applications_userid_foreign` (`userId`),
  KEY `applications_batch_foreign` (`batch`),
  KEY `applications_hall_foreign` (`hall`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `applicationId`, `jambId`, `dateOfBirth`, `gender`, `alternatePhoneNumber`, `licenceId`, `batch`, `applicationType`, `userId`, `isActive`, `slipPrintCount`, `admissionPrintCount`, `isPresent`, `status`, `created_at`, `updated_at`, `deleted_at`, `hall`, `seatNumber`) VALUES
(4, 'NDN251434323', '202331193', '1990-01-10', 'Male', NULL, NULL, NULL, 1, 29, 'true', '0', '0', 'false', 'payment_pending', '2025-09-05 00:25:06', '2025-09-05 00:56:06', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `application_types`
--

DROP TABLE IF EXISTS `application_types`;
CREATE TABLE IF NOT EXISTS `application_types` (
  `typeId` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `typeName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`typeId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `application_types`
--

INSERT INTO `application_types` (`typeId`, `typeName`, `amount`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'ND_NURSING', '2200', 'active', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `batched_candidates`
--

DROP TABLE IF EXISTS `batched_candidates`;
CREATE TABLE IF NOT EXISTS `batched_candidates` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `applicationId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batchId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `batched_candidates_applicationid_foreign` (`applicationId`),
  KEY `batched_candidates_batchid_foreign` (`batchId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `batches`
--

DROP TABLE IF EXISTS `batches`;
CREATE TABLE IF NOT EXISTS `batches` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `batchId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `batchName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `examDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `examTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capacity` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inactive',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `isVerificationActive` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `batches_batchid_unique` (`batchId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `batches`
--

INSERT INTO `batches` (`id`, `batchId`, `batchName`, `examDate`, `examTime`, `capacity`, `status`, `created_at`, `updated_at`, `deleted_at`, `isVerificationActive`) VALUES
(1, '1A', 'Day 1 Batch A', '2025-09-29', '07:00', '131', 'active', '2025-07-12 10:19:29', '2025-09-04 13:30:52', NULL, 0),
(2, '1B', 'Day 1 Batch B', '2025-09-29', '09:00', '131', 'active', '2025-07-12 10:21:14', '2025-09-04 13:44:00', NULL, 0),
(3, '1C', 'Day 1 Batch C', '2025-09-29', '11:00', '131', 'active', '2025-07-14 14:57:18', '2025-09-04 13:44:29', NULL, 0),
(4, '2A', 'Day 2 Batch A', '2025-09-30', '07:00', '131', 'active', '2025-07-12 10:19:29', '2025-09-04 13:44:51', NULL, 0),
(5, '2B', 'Day 2 Batch B', '2025-09-30', '09:00', '131', 'active', '2025-07-12 10:21:14', '2025-09-04 13:45:12', NULL, 0),
(6, '2C', 'Day 2 Batch C', '2025-09-30', '11:00', '131', 'active', '2025-07-14 14:57:18', '2025-09-04 13:45:33', NULL, 0),
(7, '2D', 'Day 2 Batch D', '2025-09-30', '13:00', '131', 'active', '2025-07-14 14:57:18', '2025-09-04 13:46:03', NULL, 0),
(8, '3A', 'Day 3 Batch A', '2025-10-01', '07:00', '131', 'active', '2025-07-12 10:19:29', '2025-09-04 13:46:36', NULL, 0),
(9, '3B', 'Day 3 Batch B', '2025-10-01', '09:00', '131', 'active', '2025-07-12 10:21:14', '2025-09-04 13:46:51', NULL, 0),
(10, '3C', 'Day 3 Batch C', '2025-10-01', '11:00', '131', 'active', '2025-07-14 14:57:18', '2025-09-04 13:47:13', NULL, 0),
(11, '3D', 'Day 3 Batch D', '2025-10-01', '13:00', '131', 'active', '2025-07-14 14:57:18', '2025-09-04 13:47:35', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `halls`
--

DROP TABLE IF EXISTS `halls`;
CREATE TABLE IF NOT EXISTS `halls` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `hallId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hallName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capacity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'true',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `halls_hallid_unique` (`hallId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `halls`
--

INSERT INTO `halls` (`id`, `hallId`, `hallName`, `capacity`, `isActive`, `created_at`, `updated_at`) VALUES
(1, 'HALLA', 'Hall A', '30', '1', NULL, '2025-09-04 13:22:34'),
(2, 'HALLB', 'Hall B', '43', '1', NULL, '2025-09-04 13:23:01'),
(4, 'HALLC', 'Hall C', '43', '1', '2025-07-20 23:28:08', '2025-09-04 13:23:17'),
(5, 'HallD', 'Hall D', '15', '1', '2025-09-04 13:22:08', '2025-09-04 13:22:08');

-- --------------------------------------------------------

--
-- Table structure for table `hall_assignment`
--

DROP TABLE IF EXISTS `hall_assignment`;
CREATE TABLE IF NOT EXISTS `hall_assignment` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `applicationId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `batch` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hall` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seatNumber` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verifiedBy` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hall_assignment_applicationid_foreign` (`applicationId`),
  KEY `hall_assignment_batch_foreign` (`batch`),
  KEY `hall_assignment_hall_foreign` (`hall`),
  KEY `hall_assignment_verifiedby_foreign` (`verifiedBy`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jamb`
--

DROP TABLE IF EXISTS `jamb`;
CREATE TABLE IF NOT EXISTS `jamb` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `jambId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `otherNames` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aggregateScore` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `jamb_jambid_unique` (`jambId`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jamb`
--

INSERT INTO `jamb` (`id`, `jambId`, `firstName`, `lastName`, `otherNames`, `gender`, `state`, `aggregateScore`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '202331184', 'Tyokyaa', 'Veronica', 'Tyover', 'F', 'BENUE', '272', '2025-07-08 14:58:40', '2025-07-08 14:58:40', NULL),
(2, '202331185', 'Jonah', 'John', 'Nguvan', 'F', 'PLATEAU', '269', '2025-07-08 14:58:40', '2025-07-08 14:58:40', NULL),
(3, '202331186', 'Abuwale', 'Ado', 'Awaulu', 'F', 'OSUN', '262', '2025-07-08 14:58:40', '2025-07-08 14:58:40', NULL),
(4, '202331187', 'Jennifer', 'Audu', NULL, 'F', 'DELTA', '262', '2025-07-08 14:58:40', '2025-07-08 14:58:40', NULL),
(5, '202331188', 'Ndidi', 'Amaka', NULL, 'F', 'DELTA', '255', '2025-07-08 14:58:40', '2025-07-08 14:58:40', NULL),
(6, '202331189', 'Olwa', 'Busayo', 'George', 'M', 'ONDO', '254', '2025-07-08 14:58:40', '2025-07-08 14:58:40', NULL),
(7, '202331190', 'Olga', 'Henry', 'Amacri', 'M', 'FCT', '251', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(8, '202331191', 'Ndidi', 'Borrofice', 'Edmond', 'F', 'IMO', '250', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(9, '202331192', 'James', 'Terry', NULL, 'M', 'DELTA', '250', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(10, '202331193', 'John', 'G', 'Lake', 'F', 'OGUN', '247', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(11, '202331194', 'Amzing', 'Grace', NULL, 'F', 'EDO', '246', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(12, '202331195', 'Tyokyaa', 'Veronica', NULL, 'M', 'OSUN', '246', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(13, '202331196', 'Tyokyaa', 'Veronica', NULL, 'F', 'DELTA', '246', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(14, '202331197', 'Tyokyaa', 'Veronica', NULL, 'F', 'IMO', '244', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(15, '202331198', 'Tyokyaa', 'Veronica', NULL, 'F', 'EBONYI', '243', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(16, '202331199', 'Tyokyaa', 'Veronica', NULL, 'F', 'ENUGU', '243', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(17, '202331200', 'Tyokyaa', 'Veronica', NULL, 'M', 'ANAMBRA', '243', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(18, '202331201', 'Tyokyaa', 'Veronica', NULL, 'F', 'ANAMBRA', '242', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(19, '202331202', 'Tyokyaa', 'Veronica', NULL, 'F', 'BENUE', '242', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(20, '202331203', 'Tyokyaa', 'Veronica', NULL, 'M', 'BENUE', '242', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(21, '202331204', 'Tyokyaa', 'Veronica', NULL, 'F', 'EBONYI', '242', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(22, '202331205', 'Tyokyaa', 'Veronica', NULL, 'M', 'LAGOS', '240', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(23, '202331206', 'Tyokyaa', 'Veronica', NULL, 'F', 'ANAMBRA', '238', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(24, '202331207', 'Tyokyaa', 'Veronica', NULL, 'F', 'EDO', '238', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(25, '202331208', 'Tyokyaa', 'Veronica', NULL, 'M', 'DELTA', '234', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(26, '202331209', 'Tyokyaa', 'Veronica', NULL, 'F', 'ABIA', '233', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(27, '202331210', 'Tyokyaa', 'Veronica', NULL, 'F', 'IMO', '232', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(28, '202331211', 'Tyokyaa', 'Veronica', NULL, 'F', 'DELTA', '232', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(29, '202331212', 'Tyokyaa', 'Veronica', NULL, 'F', 'ONDO', '232', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(30, '202331213', 'Tyokyaa', 'Veronica', NULL, 'F', 'PLATEAU', '232', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(31, '202331214', 'Tyokyaa', 'Veronica', NULL, 'M', 'FCT', '232', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(32, '202331215', 'Tyokyaa', 'Veronica', NULL, 'F', 'EBONYI', '232', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(33, '202331216', 'Tyokyaa', 'Veronica', NULL, 'M', 'OYO', '231', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(34, '202331217', 'Tyokyaa', 'Veronica', NULL, 'F', 'ABIA', '229', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(35, '202331218', 'Tyokyaa', 'Veronica', NULL, 'F', 'KOGI', '229', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(36, '202331219', 'Tyokyaa', 'Veronica', NULL, 'F', 'ENUGU', '227', '2025-07-08 14:58:41', '2025-07-08 14:58:41', NULL),
(37, '202331220', 'Tyokyaa', 'Veronica', NULL, 'F', 'OSUN', '227', '2025-07-08 14:58:42', '2025-07-08 14:58:42', NULL),
(38, '202331221', 'Tyokyaa', 'Veronica', NULL, 'F', 'ANAMBRA', '226', '2025-07-08 14:58:42', '2025-07-08 14:58:42', NULL),
(39, '202331222', 'Tyokyaa', 'Veronica', NULL, 'F', 'OYO', '226', '2025-07-08 14:58:42', '2025-07-08 14:58:42', NULL),
(40, '202331223', 'Tyokyaa', 'Veronica', NULL, 'F', 'ANAMBRA', '225', '2025-07-08 14:58:42', '2025-07-08 14:58:42', NULL),
(41, '202331224', 'Tyokyaa', 'Veronica', NULL, 'F', 'EBONYI', '225', '2025-07-08 14:58:42', '2025-07-08 14:58:42', NULL),
(42, '202331225', 'Tyokyaa', 'Veronica', NULL, 'F', 'EDO', '225', '2025-07-08 14:58:42', '2025-07-08 14:58:42', NULL),
(43, '202331226', 'Tyokyaa', 'Veronica', NULL, 'M', 'IMO', '224', '2025-07-08 14:58:42', '2025-07-08 14:58:42', NULL),
(44, '202331227', 'Tyokyaa', 'Veronica', NULL, 'F', 'ENUGU', '223', '2025-07-08 14:58:42', '2025-07-08 14:58:42', NULL),
(45, '202331228', 'Tyokyaa', 'Veronica', NULL, 'M', 'OYO', '222', '2025-07-08 14:58:42', '2025-07-08 14:58:42', NULL),
(46, '202331229', 'Tyokyaa', 'Veronica', NULL, 'F', 'BENUE', '222', '2025-07-08 14:58:42', '2025-07-08 14:58:42', NULL),
(47, '202331230', 'Tyokyaa', 'Veronica', NULL, 'F', 'BENUE', '222', '2025-07-08 14:58:42', '2025-07-08 14:58:42', NULL),
(48, '202331231', 'Tyokyaa', 'Veronica', NULL, 'F', 'DELTA', '221', '2025-07-08 14:58:42', '2025-07-08 14:58:42', NULL),
(49, '202331232', 'Tyokyaa', 'Veronica', NULL, 'F', 'ONDO', '221', '2025-07-08 14:58:42', '2025-07-08 14:58:42', NULL),
(50, '202331233', 'Tyokyaa', 'Veronica', NULL, 'F', 'KOGI', '221', '2025-07-08 14:58:42', '2025-07-08 14:58:42', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_09_03_115626_create_roles_table', 1),
(3, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(4, '2019_08_19_000000_create_failed_jobs_table', 1),
(5, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(6, '2025_02_04_171651_jamb', 1),
(7, '2025_02_05_113755_application_type', 1),
(10, '2025_06_11_153259_create_refresh_tokens_table', 1),
(12, '2025_02_05_111056_permissions', 3),
(13, '2025_02_05_111123_role_permissions', 3),
(14, '2014_10_12_000000_create_users_table', 4),
(18, '2025_07_08_123938_olevel_results', 6),
(20, '2025_07_09_051137_passportphotograph', 27),
(25, '2025_07_11_130139_create_payment_settings_table', 30),
(26, '2025_07_11_125256_create_payments_table', 31),
(27, '2025_07_12_093738_create_portal_settings', 32),
(28, '2025_02_05_113755_batch', 33),
(29, '2025_02_05_115540_create_applications_table', 34),
(31, '2025_07_12_123646_create_batch_assignments_table', 35),
(32, '2025_07_12_123646_create_rebatch_assignments_table', 36),
(33, '2025_07_15_123646_create_halls_table', 37),
(35, '2025_07_18_151739_hall_assignment', 38),
(36, '2025_07_13_123646_create_rebatch_assignments_history_table', 39);

-- --------------------------------------------------------

--
-- Table structure for table `olevel_results`
--

DROP TABLE IF EXISTS `olevel_results`;
CREATE TABLE IF NOT EXISTS `olevel_results` (
  `resultId` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `applicationId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `examYear` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `examType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `grade` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`resultId`),
  KEY `olevel_results_applicationid_foreign` (`applicationId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `olevel_results`
--

INSERT INTO `olevel_results` (`resultId`, `applicationId`, `examYear`, `examType`, `subject`, `grade`, `created_at`, `updated_at`, `deleted_at`) VALUES
(16, 'NDN251434323', '2020', 'NECO', 'Mathematics', 'A1', '2025-09-05 00:55:02', '2025-09-05 00:55:02', NULL),
(17, 'NDN251434323', '2020', 'NECO', 'English', 'B3', '2025-09-05 00:55:02', '2025-09-05 00:55:02', NULL),
(18, 'NDN251434323', '2020', 'NECO', 'Biology', 'B3', '2025-09-05 00:55:02', '2025-09-05 00:55:02', NULL),
(19, 'NDN251434323', '2020', 'NECO', 'Chemistry', 'C4', '2025-09-05 00:55:02', '2025-09-05 00:55:02', NULL),
(20, 'NDN251434323', '2020', 'NECO', 'Physics', 'C5', '2025-09-05 00:55:02', '2025-09-05 00:55:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `passport_photographs`
--

DROP TABLE IF EXISTS `passport_photographs`;
CREATE TABLE IF NOT EXISTS `passport_photographs` (
  `photoId` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `applicationId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` bigint UNSIGNED DEFAULT NULL,
  `photoPath` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`photoId`),
  KEY `passport_photographs_applicationid_foreign` (`applicationId`),
  KEY `passport_photographs_userid_foreign` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `passport_photographs`
--

INSERT INTO `passport_photographs` (`photoId`, `applicationId`, `userId`, `photoPath`, `created_at`, `updated_at`, `deleted_at`) VALUES
(2, 'NDN251434323', 29, 'photos/5TaArw43W2wg7l1JIJaUPD8d6GHDtbHhjqvOjN9n.png', '2025-09-05 00:28:45', '2025-09-05 00:55:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `applicationId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` bigint UNSIGNED NOT NULL,
  `rrr` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `orderId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `response` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `channel` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `paymentDate` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payments_rrr_unique` (`rrr`),
  UNIQUE KEY `payments_orderid_unique` (`orderId`),
  KEY `payments_applicationid_foreign` (`applicationId`),
  KEY `payments_userid_foreign` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `applicationId`, `userId`, `rrr`, `amount`, `orderId`, `status`, `response`, `channel`, `paymentDate`, `created_at`, `updated_at`) VALUES
(4, 'NDN251434323', 29, '200799126264', 100.00, 'f34e5ac2-97cf-4700-b0cb-076d1ae80723', 'payment_pending', '{\"statuscode\":\"025\",\"RRR\":\"200799126264\",\"status\":\"Payment Reference generated\"}', NULL, NULL, '2025-09-05 00:56:06', '2025-09-05 00:56:06');

-- --------------------------------------------------------

--
-- Table structure for table `payment_settings`
--

DROP TABLE IF EXISTS `payment_settings`;
CREATE TABLE IF NOT EXISTS `payment_settings` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `applicationType` bigint UNSIGNED DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payment_settings_applicationtype_foreign` (`applicationType`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payment_settings`
--

INSERT INTO `payment_settings` (`id`, `key`, `applicationType`, `amount`, `created_at`, `updated_at`) VALUES
(1, '2025_Application_NDN', 1, 100.00, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE IF NOT EXISTS `permissions` (
  `permissionId` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `permissionName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `permissionSlug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`permissionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `portal_settings`
--

DROP TABLE IF EXISTS `portal_settings`;
CREATE TABLE IF NOT EXISTS `portal_settings` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `applicationStartDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `applicationEndDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `examStartDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `examEndDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `applicationActivatedBy` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rebatched_candidates`
--

DROP TABLE IF EXISTS `rebatched_candidates`;
CREATE TABLE IF NOT EXISTS `rebatched_candidates` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `applicationId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oldBatchId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `newBatchId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rebatchedBy` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rebatched_candidates_applicationid_foreign` (`applicationId`),
  KEY `rebatched_candidates_oldbatchid_foreign` (`oldBatchId`),
  KEY `rebatched_candidates_newbatchid_foreign` (`newBatchId`),
  KEY `rebatched_candidates_rebatchedby_foreign` (`rebatchedBy`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rebatched_candidates_history`
--

DROP TABLE IF EXISTS `rebatched_candidates_history`;
CREATE TABLE IF NOT EXISTS `rebatched_candidates_history` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `applicationId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oldBatchId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `newBatchId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rebatchedBy` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rebatched_candidates_history_applicationid_foreign` (`applicationId`),
  KEY `rebatched_candidates_history_oldbatchid_foreign` (`oldBatchId`),
  KEY `rebatched_candidates_history_newbatchid_foreign` (`newBatchId`),
  KEY `rebatched_candidates_history_rebatchedby_foreign` (`rebatchedBy`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `refresh_tokens_token_unique` (`token`),
  KEY `refresh_tokens_user_id_foreign` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `user_id`, `token`, `expires_at`, `created_at`, `updated_at`) VALUES
(5, 1, 'QacZMTx5JsHZwb9xuFhW2f4E9aZLVL1QD7AiNPZ765T2fYvmfGglMJP3swUTUi7E', '2025-07-21 19:59:27', '2025-07-07 19:59:27', '2025-07-07 19:59:27'),
(6, 1, 'NDrurRPPYIgP25hm1c3mQrToiizTOeKlU0Vel3E1KNA3mAwAcoMy8TO2cEmV0Ycx', '2025-07-21 20:09:08', '2025-07-07 20:09:08', '2025-07-07 20:09:08'),
(7, 1, 'oKjCz7aaWL0KvdKpYBYsj1kfqVJIKshiGDlakal2DsmzqUULnMByljNwOui97wT1', '2025-07-21 20:12:21', '2025-07-07 20:12:21', '2025-07-07 20:12:21'),
(8, 1, 'PbLZREy4QnbdxrgCecSbZTpU7Efc6RPkl4f7lFS3bYBVvdM3yfEX3b1SXCwdnP9c', '2025-07-21 20:15:12', '2025-07-07 20:15:12', '2025-07-07 20:15:12'),
(9, 1, '8zpIJs2vnLKQMPFgTceVwSqKa1zgqu54Vnj0Pm0b1JUfS2k9YxR7witXYz3B0II4', '2025-07-21 20:33:11', '2025-07-07 20:33:11', '2025-07-07 20:33:11'),
(10, 1, 'z50AxM7ZDmSWY1Fnnggofqd3opeWK2nyXgkaIczHeA9dKYzRltujmKOEJ5bYxAgr', '2025-07-21 20:58:12', '2025-07-07 20:58:12', '2025-07-07 20:58:12'),
(11, 1, 'hXwjq4TsuZSQpdGEUGa1CMU24GiFEt2BAW70G5lnkTsm6kidfKA9LwX1fTYPUdCU', '2025-07-21 21:01:57', '2025-07-07 21:01:57', '2025-07-07 21:01:57'),
(12, 1, 'GPm6x36l6eJr9RQhZXgvO0NMEHCnjwFvAxsz8wCP1u6OCQz19Iu7nrcElluu8E3P', '2025-07-21 21:08:54', '2025-07-07 21:08:54', '2025-07-07 21:08:54'),
(13, 1, 'nxi9dH1r9NAuQUORSNURsHIkpWcE6reuv7YE6So5ozpI0H4H0AeSdvqnj7nWDJ1i', '2025-07-21 21:10:07', '2025-07-07 21:10:07', '2025-07-07 21:10:07'),
(14, 1, 'qVgDOSmP2LTAxpIiyZAbbSGSvmfsq5LamPj4ZGyNwDQ31pSAKqPIhIrMKXR5MRPs', '2025-07-22 03:48:22', '2025-07-08 03:48:22', '2025-07-08 03:48:22'),
(15, 1, '0Bo2l3aKLJc3jUO5k3JK8BN6dgQD9AP7ioSkxOxD5W05A5EGJJkg0wwmBHJ7DKpc', '2025-07-22 04:02:50', '2025-07-08 04:02:50', '2025-07-08 04:02:50'),
(16, 1, 'qGPCStchBErTOYyQJqVp2fwhRd5b6bUeivrG73z3P0VUoEqPiJP3qeycv2oaQL7g', '2025-07-22 04:04:01', '2025-07-08 04:04:01', '2025-07-08 04:04:01'),
(17, 1, 'FPSuHt9EEA5mJ9zL5jqo1v6GrDrfMbWbfNf1CvBv3rdXPAZNVtxfvvfHicPO7Vsh', '2025-07-22 04:04:31', '2025-07-08 04:04:31', '2025-07-08 04:04:31'),
(18, 1, 'FEu4A8B7sFy7lCuuq3U9tfTCbt0AdlQvX3WTnCyX0hR09itQyN7qymV4hTpUBgsF', '2025-07-22 04:09:42', '2025-07-08 04:09:42', '2025-07-08 04:09:42'),
(19, 1, 'pWulaGmepMtMgCyk9qVVxxtaiu6QW4TnFjgnqjdAqJdLxXbtgYf1JjzvaykLrwgd', '2025-07-22 04:11:10', '2025-07-08 04:11:10', '2025-07-08 04:11:10'),
(20, 1, 'FxwZFjTANcrWJRDhtUHhfYvVizJCSj24LA5A0XoPKqRto3jIIqJcB3uBXyUBe8E4', '2025-07-22 04:22:38', '2025-07-08 04:22:38', '2025-07-08 04:22:38'),
(21, 1, 'KdrtxQ2wVkgJsdq9zLj2j0uRTFMBA1moc2jyCMsWiO0JI9TceCKCO9XsRJplKMSL', '2025-07-22 07:04:25', '2025-07-08 07:04:25', '2025-07-08 07:04:25'),
(22, 1, 'UCrlpQ6cBjAN0fS9FZaHXrKsAvdm1zvXcOmJiNv5eryyFys7iLXqk5MrxxadXMV4', '2025-07-22 07:32:09', '2025-07-08 07:32:09', '2025-07-08 07:32:09'),
(23, 1, 'tvMecL7MBxFZudxTQYKhHZsMaiCn7W4cgUbkk1H2ZWT7TkuRofghzxJcrIUURb2x', '2025-07-22 07:48:42', '2025-07-08 07:48:42', '2025-07-08 07:48:42'),
(24, 1, '3mlKjEwouaOGw9vWojkjnNQMqRQla3mAQTgMaH0nxY3Q9jbLxrtVkeALGogTaUsd', '2025-07-22 08:04:31', '2025-07-08 08:04:31', '2025-07-08 08:04:31'),
(27, 1, 'ChAY9V7fpzAMqziQmU6L5nrcpfJkdM9ROY11mQCLKstsJE2bIYPtYcvaZlKDlc5I', '2025-07-22 14:01:44', '2025-07-08 14:01:46', '2025-07-08 14:01:46'),
(28, 1, 'gj9Egz43rioHbZlGdr2EXq7m5GetRtH0QlrZK4CLFnV8UNOoRgk6Rx34nsyrLjV5', '2025-07-22 14:30:22', '2025-07-08 14:30:22', '2025-07-08 14:30:22'),
(29, 16, 'gSuZst16WFJw7JnLoabEUfRam1Rnz6eF24qxw9bP5kDuKAlJt7iQlgcCyg23GHSX', '2025-07-22 14:55:58', '2025-07-08 14:55:58', '2025-07-08 14:55:58'),
(30, 1, 'xTpoCI9INOPPWRF2T6zHzoH6srCmUkXTyDLrtSre8co3Pomj0CDApqNelo2n4jot', '2025-07-22 15:05:35', '2025-07-08 15:05:35', '2025-07-08 15:05:35'),
(31, 1, 'DmBTu11Kv16PrtWPvrQIKdUPcJDjp5j38cXUgzAMBrkMl9IRnZPopL1W4czPG13H', '2025-07-22 15:22:12', '2025-07-08 15:22:12', '2025-07-08 15:22:12'),
(32, 1, 'KeBz3KeJHp9ddYYnVbzvmYJzP2KISSCAvsk2B5aWPORLZizabDdlNbMlyAE8t9Mf', '2025-07-22 16:19:31', '2025-07-08 16:19:31', '2025-07-08 16:19:31'),
(33, 1, 'EuPTlw3Dv0boue8yHM0xcxNX6yOsP1duVok8uXJFoOcEdNeDUOp6uKseaMsBJGcy', '2025-07-22 20:02:09', '2025-07-08 20:02:09', '2025-07-08 20:02:09'),
(34, 1, 'Esnft248TyTF8eV2hSXdwoJjZlWHTmefkcTvTmDBEjyjQ1Iv3J8Aq8nYk0CPkGRu', '2025-07-22 20:42:52', '2025-07-08 20:42:52', '2025-07-08 20:42:52'),
(35, 1, '62Yk97C1uGXj4K0a5aXGj2L4mpZYjGaAqqKh3I5eOtVnSQFsvNNJGitOAYW04JSI', '2025-07-22 22:11:36', '2025-07-08 22:11:36', '2025-07-08 22:11:36'),
(36, 1, 'Xu1YusR7s8kulvCyBaRx59Yqv7hG5Pqkb0O3s4m3OAfDvPeZxWQgmRp0ZhIThw1g', '2025-07-22 23:11:56', '2025-07-08 22:41:55', '2025-07-08 23:11:56'),
(37, 1, '3nhzjU3bH9N6eU5QExdEUDS55pVIDymBGpxQMeygpDkzDmCBiJLzhs7P4gYn61yf', '2025-07-23 04:47:18', '2025-07-09 03:48:51', '2025-07-09 04:47:18'),
(38, 1, 'ejLt4nqfBS2jRlEhXHxnhMNdvryttGA4ejwWFBbq7y5euBlTtcAf75rXXkkisXMJ', '2025-07-23 08:17:11', '2025-07-09 08:17:11', '2025-07-09 08:17:11'),
(39, 1, 'aYL5Nbc2FDLmkEvHR7XWLbsLm39pWy93hAWC3CjzpdxviFXOBCNGyZLiiHgZxfgY', '2025-07-23 10:02:18', '2025-07-09 10:02:19', '2025-07-09 10:02:19'),
(40, 1, '0bQbTclqzZax00psbsdJ3hrdJ9tWMtgAp8NcExSsYN68fG77oj0mq2BReIFnJsk8', '2025-07-25 08:42:00', '2025-07-11 08:42:00', '2025-07-11 08:42:00'),
(41, 1, 'qg9LG3A3rS7ahiLRtieJDG8OG0U7ZIH5GiFXNLc3zHT19xlix65FDhph6ZKGhCqr', '2025-07-25 08:57:56', '2025-07-11 08:57:56', '2025-07-11 08:57:56'),
(42, 1, 'mvXL8SbfCerD6tjsERYWNhA28Sv4iSBHap1GlU7fHpZR1kWBtebiU4vJRBGhWozr', '2025-07-25 10:01:27', '2025-07-11 10:01:27', '2025-07-11 10:01:27'),
(43, 1, 'fyaOcOiNbGI04iPDOcQfSZOoc5gehGrD0ftf6CooiTUODceZwyMp92QdfJLXOMea', '2025-07-25 11:22:13', '2025-07-11 10:20:42', '2025-07-11 11:22:13'),
(44, 1, 'SQvrpo0JYPAmaMCN5HC4HhQl7QzsN1X4BaPHtPvWvV3yHpp0ioqW7qyUSQ7HHEuG', '2025-07-25 12:28:18', '2025-07-11 12:28:18', '2025-07-11 12:28:18'),
(45, 1, '0zU9wiBPnTsk8NuFBtoY1gG6FIHS0zDq9ZguOywHvIIsecAUGSp3Dyk928INIgg5', '2025-07-25 15:06:05', '2025-07-11 12:52:56', '2025-07-11 15:06:05'),
(46, 1, 'zAJ84gY0u7D5BuH53HHrEMSxO3Yrydy93C34sov7JnOEHlsGIuLM4gWLk5KO9nc0', '2025-07-25 15:48:00', '2025-07-11 15:27:52', '2025-07-11 15:48:00'),
(47, 1, 'grmpEA2HeM9uHnrQZSuDe6kzmQQ1hyOOOrJ1KtEGWDiBT4dRiAPS3OXF3aTEA0AJ', '2025-07-25 16:10:50', '2025-07-11 16:10:50', '2025-07-11 16:10:50'),
(48, 1, 'mkwDNIExHVm1af9b0XIgRWtpUl3tzwYwi5bBGlGExqQQqB9m2HMvydUTF8djguYs', '2025-07-25 16:35:52', '2025-07-11 16:35:52', '2025-07-11 16:35:52'),
(49, 1, 'BPtdq3eNoip5HZZSvbA3sDgsKXjM0wsyeNAjQEfbWXwkgm8LFcaQOq41IzYQxc6t', '2025-07-25 16:54:51', '2025-07-11 16:54:51', '2025-07-11 16:54:51'),
(50, 1, 'g3G2hwM1dqtwA9IlVY3F93QSpNjWbp45sUZjI10nZcyFitjDr4HTCDzTHZLN9bty', '2025-07-25 19:24:26', '2025-07-11 17:10:55', '2025-07-11 19:24:26'),
(51, 1, 'iCB5iTJQpRSZLMl5qZVJpwUQ4ZZpo6zLrRdPFA6xcTNHsREMvz4gbI5UXYEb6LoO', '2025-07-25 19:42:47', '2025-07-11 19:42:47', '2025-07-11 19:42:47'),
(52, 17, 'xoE0elCUcA4VTxJASjxaqO0cGSYUvnkS23e7ubz6aG5Lg15N4yilgczGwmbbG41U', '2025-07-25 20:36:33', '2025-07-11 20:03:00', '2025-07-11 20:36:33'),
(53, 17, 'HL1WCRDGoIfc1N4p2dlG7ik0eQcHKBHOJkOb87NG5XGTiehokIF3FlDbMcCO10tt', '2025-07-25 22:11:40', '2025-07-11 20:42:23', '2025-07-11 22:11:40'),
(54, 17, 'i1eHkIqGx2wmzGuCgQ2lqunQj2NiQpig5zWQY4JkUonXW1Awnp5k0XgNNX6Se47q', '2025-07-26 00:40:43', '2025-07-11 22:53:12', '2025-07-12 00:40:43'),
(55, 1, 'UWbKX0sHfWS1PHQgrsXoGpYgOa3wIDHwVcOIv4omkNKWy40F0r087GMHuHaqRDD7', '2025-07-26 00:57:12', '2025-07-12 00:57:12', '2025-07-12 00:57:12'),
(56, 17, '6PkurmnXdxfp72Xh9sPkhUjIKTqGP8lnFzPGoUI3FBYCaHUP8WYJoIgyUovt0kTO', '2025-07-26 00:59:28', '2025-07-12 00:59:28', '2025-07-12 00:59:28'),
(57, 17, '8k1upikJBuF9hEajViEnRuX2A5i47cvQew3QBxQrspqtofEhapgS6arz2ClakrQk', '2025-07-26 08:24:46', '2025-07-12 08:04:52', '2025-07-12 08:24:46'),
(58, 1, 'NCGDzuP1KzxBAc8i17FwGRm6Y22itJUMOKb8VVP6VkTNw9tmizth6vwPjgOhSU9v', '2025-07-26 09:00:05', '2025-07-12 09:00:05', '2025-07-12 09:00:05'),
(59, 1, '3xrYPizYMV0U2AdYE9i7oHchnkEHzDHA9GiedwVDIWhg6kkM7kBUlUCqOYw3sq0E', '2025-07-26 09:29:19', '2025-07-12 09:29:19', '2025-07-12 09:29:19'),
(60, 1, 'l6zlcuXb8sA9CykGYsaSTmqFFDdqwBzO0REj99ry25eMb11uU9xRyJJeIm16mA0x', '2025-07-26 10:19:28', '2025-07-12 09:49:32', '2025-07-12 10:19:28'),
(61, 1, 'acmx8yspFPyMyUG69qgqSq90Y5MWR0hk1aZvsQP89eLRL9RVwxfHC2iIgR0ijJCs', '2025-07-26 10:34:57', '2025-07-12 10:34:57', '2025-07-12 10:34:57'),
(62, 17, '4Giny28kJFxOwde4s1rM3nkV3t7PF0qnebwkVrEkdP6WGRCQQamXZCwx5sG4fzM6', '2025-07-26 11:13:44', '2025-07-12 11:13:44', '2025-07-12 11:13:44'),
(63, 1, 'kPFFf49dR7JdjRaF2FIywIYY7k43xDmMuqpOLv3SIyQeS0FQ0b58TuoWRtt7pHYo', '2025-07-26 11:49:11', '2025-07-12 11:49:11', '2025-07-12 11:49:11'),
(64, 17, 'bes8LPH8vhkvehZKpsIWoBJc05ZlQ6qBdXXwBIDiW2SvqKF3XxApHhq9flsDM4EP', '2025-07-26 13:03:08', '2025-07-12 11:59:34', '2025-07-12 13:03:08'),
(65, 1, '9ffgUKMRPNJ0LCBoaWBvDCt5LshVSEv5zPVKaIgQLItU5hR3wuj6tGft5G5v4EMw', '2025-07-27 17:01:43', '2025-07-13 17:01:43', '2025-07-13 17:01:43'),
(67, 1, 'ICrZrPNTNrNBCTb7AgjTx7ExQ6GpQNu9THV8CHxcewMtvEFgTvd9Z2i1753A5RpQ', '2025-07-27 18:12:49', '2025-07-13 18:12:49', '2025-07-13 18:12:49'),
(68, 1, 'YDxfdyVx0OvBGBb3FGsM0rWcBBldXgb7uj7KDBDPCzlnz9KhVhKfJYtN1fdjwk9H', '2025-07-27 18:28:09', '2025-07-13 18:28:09', '2025-07-13 18:28:09'),
(69, 1, 'Fd7gEJk4IWWRq7PqJJxQZLti1H8vv332OjKaYhVxacIjbWncHg6Au3xmDKvaId6P', '2025-07-27 18:47:03', '2025-07-13 18:47:03', '2025-07-13 18:47:03'),
(70, 1, '8SQ3KigWDf4TRmB9GbHRSohIbLb8zyMV0A4cOuw53QkdxeyFQqFysN1mlLqpItJY', '2025-07-27 21:21:19', '2025-07-13 21:21:19', '2025-07-13 21:21:19'),
(71, 1, '48QCApMo0kpf9qSnqoqRGk6DVLPpc1f208f33ByiRZ7X6943deFEIcVcrOVJhLzy', '2025-07-27 21:37:53', '2025-07-13 21:37:53', '2025-07-13 21:37:53'),
(74, 18, 'm51S84gnfe8hUJjWNVPkJY5MInIqSXrwYdv1ZYhTveZa09ibddYIxS57xTKRsXnH', '2025-07-28 07:35:07', '2025-07-14 07:35:08', '2025-07-14 07:35:08'),
(75, 18, '0qnlfPPS4EVngG2SPZ9L9Ev3IMHkcJBqSfo6V5QWpmQ2Ars5z5UEEespxjcn2KLJ', '2025-07-28 09:02:41', '2025-07-14 08:22:24', '2025-07-14 09:02:41'),
(76, 18, '5mi8XyX8mBDu3BeVrOC0bNGoqKoNM7cKmBBJIffJAKIG8t53Jz48lRjPf9Ocswb0', '2025-07-28 09:26:19', '2025-07-14 09:26:19', '2025-07-14 09:26:19'),
(77, 18, 'UCZv5KgFfzHuEs19mYc2Fv9qnCEOdxaQOPesQjmMswS4gvYo0zi800kBCawBfrn4', '2025-07-28 10:20:02', '2025-07-14 10:20:02', '2025-07-14 10:20:02'),
(79, 18, 'mLkNVlugKt6ffcNh0nlgMvB8SpYYl2OT4b0eK7dsPRe43jZ0B0Zhb5bVMLJuxW7o', '2025-07-28 13:00:33', '2025-07-14 13:00:33', '2025-07-14 13:00:33'),
(80, 18, 'II8vHzbuamxWZHn1UevFaPd2HgFlNR1mTqYhioY8earya3qoL1espbWpAyxapE2o', '2025-07-28 13:02:53', '2025-07-14 13:02:54', '2025-07-14 13:02:54'),
(86, 18, 'NFGSDpkisw0GKBehc9hBXZB86hfRq9pu5KsTHdzNqwcWI2Vzf4CVVPRxce0oG0ZX', '2025-07-28 13:14:38', '2025-07-14 13:14:38', '2025-07-14 13:14:38'),
(88, 1, '8YeVRM45s1TyA2j0tO01zfDxvvFhVNfjlkfVXY2ttCM50auOrDHOFAsDsRq1CWKA', '2025-07-28 14:03:14', '2025-07-14 14:03:14', '2025-07-14 14:03:14'),
(89, 1, 'uO62MqwIY00V3lLyRoMVPjINUu2PqtXsRmsr3F5dlBYmrKc1nhJSAXpI1ZtHy4Zl', '2025-07-28 14:48:26', '2025-07-14 14:48:26', '2025-07-14 14:48:26'),
(95, 1, '6G0UzhVFVg8UFydOnHOACR4Qe46PL1pTPbKzbMZ9bE3u4nqBdOsaJqJ78SvCE9FG', '2025-07-28 16:30:32', '2025-07-14 16:30:32', '2025-07-14 16:30:32'),
(96, 18, 'gp23RIN2RSpGar8fClEILQzIi3QRyiKHyTN524fECW13HEDDMCKjmKgwoiXpRrxO', '2025-07-28 20:17:50', '2025-07-14 20:17:50', '2025-07-14 20:17:50'),
(97, 18, 'QRccalENhjObTV3WQUiRMoCyyfCVOobda0zSiO47DScf7NpwdWCL351firbrLxjN', '2025-07-28 22:35:11', '2025-07-14 22:35:11', '2025-07-14 22:35:11'),
(98, 18, '8u1Iq5tHEDZ1HqqyxHGakgt70Pz29iTK8z4KFcuNHvetIO8xAtUrtZ3cKdAfr41h', '2025-07-28 22:53:46', '2025-07-14 22:53:46', '2025-07-14 22:53:46'),
(99, 18, '9qTNK2bgtrFS8CX4wHyiTbgtULedlc6vlTTFZkfpkj3PiwC0Cezx4lTXARnrKG5c', '2025-07-29 15:15:46', '2025-07-15 15:15:46', '2025-07-15 15:15:46'),
(100, 18, 'PJavpsVebvHhcpl9FypAEs8niULh3c5EVvSDH63CHhAa2MtltG8f0hMbn6tJGzLR', '2025-07-29 15:49:18', '2025-07-15 15:49:18', '2025-07-15 15:49:18'),
(101, 18, 'Fy5EMDBTw9aQ8Paixas1CMilvJqRYCmbn4ioVmuCKv0ET6P60f2t0J0nMRdRi7B7', '2025-07-29 16:16:52', '2025-07-15 16:16:52', '2025-07-15 16:16:52'),
(102, 18, 'BnsdWfLIQtYPE4YaTi1kvYCPc6kETnIVmRsPJVjJw8peU4Me8POWmzjEMdbjcHX5', '2025-07-29 16:56:59', '2025-07-15 16:37:40', '2025-07-15 16:56:59'),
(103, 18, '0IprHKAzSWhtP2GVMJgazTezdhE0J3Pnrqg7HA1lZVm9yof2AmTCqfTkhR4D2Ca2', '2025-07-29 20:33:17', '2025-07-15 20:33:17', '2025-07-15 20:33:17'),
(104, 18, '5oC5xCVacTCZ40h009ZEWO2y3LclfZQYyVpge3h2c7vvW7r4ef0OaUACk6XDXxef', '2025-07-29 20:54:11', '2025-07-15 20:54:11', '2025-07-15 20:54:11'),
(105, 18, '6u40esqTTo3NN8gmmFWiOqZb1pfPZsXhnFS5JYcJbRnpOQENOXRKhCEsBWyAvVSV', '2025-07-29 21:09:49', '2025-07-15 21:09:49', '2025-07-15 21:09:49'),
(106, 1, 'qyZILDRbDt5rY6En8ugYsXEb4qmLqgL2uL8zCOm4E9PwgKrHK0T6QHKlGjOu6jZI', '2025-07-30 06:31:05', '2025-07-16 06:31:05', '2025-07-16 06:31:05'),
(107, 1, 'tKE0H4p7F8M8ptK3JK7StD9xKMIMgXln7iuVutCiSu14RV27hueZ0ptuEbI0eLoA', '2025-07-30 07:34:40', '2025-07-16 07:19:35', '2025-07-16 07:34:40'),
(108, 1, 'WWHJQMqS6vjfK2toc7Ykn4DDfFHWu3Iclhdb8jG7SzSzkQ99CQuI7aBdocgp8z7z', '2025-07-30 07:51:24', '2025-07-16 07:51:24', '2025-07-16 07:51:24'),
(109, 1, 'sDg5EmVsk7jWuxvOiqoOcHd9jNuCaoOn18Ma5CSn1rvUJXb7vKLwv0Gx5ye748TV', '2025-07-30 09:24:45', '2025-07-16 08:19:04', '2025-07-16 09:24:45'),
(110, 1, '2AlLeEH70S1ISfqYizMNoGrt1DUWZ0Vy8fkQkf3jlqAMoyRtZjaWSG2z6jgrFy4m', '2025-07-30 18:15:08', '2025-07-16 18:15:09', '2025-07-16 18:15:09'),
(111, 1, 'uZNFVrOtO0u7LJeiRhzwUENrqw6YaEvFl0fz9fyQwAiraTZZ5FbGM5vJb5IoMyjO', '2025-07-30 19:03:46', '2025-07-16 19:03:46', '2025-07-16 19:03:46'),
(112, 1, '5wIENEjzjqJIhx9ZJeBL03VQLy9CjCAQiz4QbiV14GS1f5vqeZqwJzmQ3rKcqsmA', '2025-07-30 20:28:31', '2025-07-16 20:28:31', '2025-07-16 20:28:31'),
(113, 1, 'OCVDlC0hjt1LXBIzGs8MfXx0CoM5oJJeXuLzb3XpRlTfSst1cGrC0bHMy2v11Xqt', '2025-07-30 20:52:54', '2025-07-16 20:52:54', '2025-07-16 20:52:54'),
(114, 1, 'rZzLqUOLxHeezamxs2VSXIXp8f0E7DcWPme7qS6UmcwVsLzJWQhr14AKdoOMYq8b', '2025-07-30 21:32:31', '2025-07-16 21:32:31', '2025-07-16 21:32:31'),
(115, 1, '8GUziZyurYnHE9gmFxmCbGSZzeIolstihwut4yJGF0fBmvKYllRstvxIFYN4VJPm', '2025-07-30 22:28:16', '2025-07-16 22:28:16', '2025-07-16 22:28:16'),
(116, 1, '49Ug2BMbfFZARWlnGyGCZmE2ejPEXR1WNihDmVrbmAnQaj9RW1iEqGpB5DbZBpcH', '2025-07-30 22:47:58', '2025-07-16 22:47:58', '2025-07-16 22:47:58'),
(117, 1, 'xMipdA1pJgwSAY6qpme95N2wbMDz8aZxJ7WH6dW6s1cVWQ5GgvocqBlcon245Id5', '2025-07-30 23:11:58', '2025-07-16 23:11:58', '2025-07-16 23:11:58'),
(118, 1, 'BKBOgUimtdZKNcvk9OTQn6mxTr2FoodqdmcMeupxSXF95AjZOUSQns38f9OrIcSc', '2025-07-31 00:08:07', '2025-07-17 00:08:07', '2025-07-17 00:08:07'),
(119, 1, 'hVb1gaOxrPsQSPUkStVC00zi8mv5EYjERV6i2gvsk7ERWb4l2wDFbkTE1xGrU4Gx', '2025-07-31 00:54:18', '2025-07-17 00:23:23', '2025-07-17 00:54:18'),
(120, 1, 'pLGpSboasXHVVjCEifDJCeTqhI4Vl3McqzfNFIhqkpaMsWfgOcoFR5Gk50jnfJVd', '2025-07-31 01:33:23', '2025-07-17 01:18:12', '2025-07-17 01:33:23'),
(121, 1, 'fMxL7zvdlTc1UXYCO88XYmpYbu0MZOJezD7WXmEv3bppNVFcq5W10V3tdspR92nd', '2025-07-31 08:27:29', '2025-07-17 08:27:29', '2025-07-17 08:27:29'),
(122, 1, 'LqaxVtPhoc9YUjThEonN25QCFlvRU2xtqh6D90RFOE9H6Cl8v6eVPoiUN27dJwzX', '2025-07-31 08:55:01', '2025-07-17 08:55:01', '2025-07-17 08:55:01'),
(123, 1, 'IljsOecpNfzOcEkuq2uE8vtVWUzeF5FAjXvV9sSmWJOoWK788xbiZiRs6Wa4chYY', '2025-07-31 09:12:30', '2025-07-17 09:12:30', '2025-07-17 09:12:30'),
(124, 1, 'WhnWoPtkuAtFhkwQ304PCUu2U4PyORsmB7AFuUKy1sC9d6FkmjPLTtodcf60T72I', '2025-07-31 15:23:50', '2025-07-17 15:23:50', '2025-07-17 15:23:50'),
(125, 1, 'q8Xnt4CWDl9Lah0zfUWQN8M71xLWrljxCIZ0G1I3dVhdykvOFZteRHiOdpUAvhUh', '2025-07-31 15:43:00', '2025-07-17 15:43:00', '2025-07-17 15:43:00'),
(126, 1, 'N1iNXcey5CZAEr3ARw7g6l2FRx550cPBFI0HUoA0lhY6WC2rMJS5Nx8UqmEoHpDq', '2025-07-31 17:27:49', '2025-07-17 17:27:49', '2025-07-17 17:27:49'),
(127, 1, '8mnbvA9d8IjJ5CQvjMdO7lM1Xk0vRPapcPDlA7CFNHqrICgcUDDnzjCM1XN8gCkE', '2025-07-31 18:01:02', '2025-07-17 18:01:02', '2025-07-17 18:01:02'),
(128, 1, 'dM7x1XSSVjMvVTvGuwywQQTqozqWaLfSgONLwecUxxOzRVsQKTiI5dmJ0Wrx2pbm', '2025-07-31 18:36:10', '2025-07-17 18:36:10', '2025-07-17 18:36:10'),
(129, 1, '1lfgGC27xifjivsGCmaEOndwPw3GNceZVHdCChZlH2M74UBdch4vq4mTHtDDlyOs', '2025-07-31 19:23:17', '2025-07-17 19:23:17', '2025-07-17 19:23:17'),
(130, 1, 'F4P6RxlL5NAHss5wOzOViXaEXCpJlgE5ZRDE2m9EblVPLR4KJY0wL236bE5KEzBH', '2025-07-31 19:53:34', '2025-07-17 19:53:34', '2025-07-17 19:53:34'),
(131, 1, 'Ie4MM8KftHeRHf2wQbjGbgSwZrMqqwQaRYdMyd5kfiOhGfvRw8ckiasurldUYBiG', '2025-07-31 20:23:36', '2025-07-17 20:23:36', '2025-07-17 20:23:36'),
(132, 1, 'ps9ToWLDkWsYLyT8PsV08DKzFIwfIzrTys0tYuSbTcLZ3ZgSMfBrz6poa3Vuj3DS', '2025-07-31 20:46:57', '2025-07-17 20:46:57', '2025-07-17 20:46:57'),
(133, 24, 'lM55F80nSwnieN8KhquHODli7L4mqkedPmFAZlq7JNuTqqCfuyof5n8giEyL4udf', '2025-08-01 07:52:59', '2025-07-18 07:52:59', '2025-07-18 07:52:59'),
(134, 24, 'Q6WltMHoMlTQXXqmpOvn6kJGGehreNazKlNwTrY0o8SaNEFH07KWIjObbcBwdTWg', '2025-08-01 10:48:46', '2025-07-18 07:56:41', '2025-07-18 10:48:46'),
(135, 1, 'g0HthferWRrL7ajW9F1V4gvh37Ib67Y5qBzF8lrdIwXLhoDqXZGvzIcPnxXhJ64m', '2025-08-01 23:58:23', '2025-07-18 11:51:57', '2025-07-18 23:58:23'),
(136, 1, 'jjnGDG7Zz7PeMfKubhhQFjzAsLwTd0AKTAaBQdrkrMyn6MYWE1t6xEQlBcrjJ3Jd', '2025-08-02 12:42:53', '2025-07-19 10:46:35', '2025-07-19 12:42:53'),
(137, 1, 'qF4qGT9avsHVWx2GlYPnvumG7s6CElwTJrMVSq7Qrvrl76tx1j32arLwCaK89S0w', '2025-08-02 13:36:11', '2025-07-19 13:21:00', '2025-07-19 13:36:11'),
(138, 1, 'PA0YFbNrYfBFmrNMtQ8OEILoMpIcCJD4AXvaMVUIWRYm8VSmqnjx321YSi8gZphJ', '2025-08-02 13:52:19', '2025-07-19 13:52:19', '2025-07-19 13:52:19'),
(139, 1, '8K9chrQTubuCZ32W041WQc86xDzX7wcjoPGVWUi8XykkAKu0QdRseVxIhXfg34n3', '2025-08-02 14:01:59', '2025-07-19 14:01:59', '2025-07-19 14:01:59'),
(140, 1, 'wMCHPlFxUTYlXPgq5Ne1lTrTrFrWyWNKEweODYp1LiPJG78S64GdkmlaE1IIGXii', '2025-08-03 12:31:52', '2025-07-20 12:31:52', '2025-07-20 12:31:52'),
(141, 1, '2kEo5gzKuAaax4m4jcA1W5P9zscLv8CwR9AJGHHVmHfUjaKRI7iNJqCvA3PIIqNW', '2025-08-03 13:42:42', '2025-07-20 13:42:42', '2025-07-20 13:42:42'),
(142, 1, 'kYPAi86Qe24J7fFz91VEqDZJCN6TInQJVYDeFv5JNQrqmO0anBqhMeKdsqZboPGb', '2025-08-03 22:49:43', '2025-07-20 22:49:43', '2025-07-20 22:49:43'),
(143, 1, 'UM3PHqDl9WEk4wwpyRiYx088SwgT4cPLFDp2j1S0kWedAOU4WSTorgJIXke4EDZM', '2025-08-03 23:21:22', '2025-07-20 23:06:20', '2025-07-20 23:21:22'),
(144, 1, 'yXCSnXIKsUQ0u6VV2jLpK0YSzKFAnjJ68E8npW4CMcxmS6IA3Z54CxpcGNYYKyOT', '2025-08-04 00:32:32', '2025-07-20 23:37:15', '2025-07-21 00:32:32'),
(145, 1, 'SN2AdHWk0DCjHSPNa58vjRJooIpvB5RsbterhFNXZQN1yGNEsT9GCsH3WkS6sh3I', '2025-09-18 12:34:15', '2025-09-04 12:34:16', '2025-09-04 12:34:16'),
(146, 1, 'QAv4hCx08Vk058OydoIspAfZNXG7VqVDcs5ZGF0Z2K6eEhkp7CXRxwRURuJ521Tw', '2025-09-18 12:50:38', '2025-09-04 12:50:38', '2025-09-04 12:50:38'),
(152, 29, 'ArblDSbRW5iMgFEXTUJIq6CrEchUQvD9cJgGUu3EAqwjFwWLHc4JeR0dF0pAGAXa', '2025-09-19 00:25:52', '2025-09-05 00:25:52', '2025-09-05 00:25:52');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `roleId` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `roleName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`roleId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`roleId`, `roleName`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'CANDIDATE', NULL, NULL, NULL),
(2, 'VERIFICATION', NULL, NULL, NULL),
(3, 'ADMIN', NULL, NULL, NULL),
(4, 'DIRECTOR', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `rolePermissionId` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `roleId` bigint UNSIGNED NOT NULL,
  `permissionId` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`rolePermissionId`),
  KEY `role_permissions_roleid_foreign` (`roleId`),
  KEY `role_permissions_permissionid_foreign` (`permissionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `otherNames` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phoneNumber` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `role` bigint UNSIGNED DEFAULT NULL,
  `applicationType` bigint UNSIGNED DEFAULT NULL,
  `jambId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_foreign` (`role`),
  KEY `users_applicationtype_foreign` (`applicationType`),
  KEY `users_jambid_foreign` (`jambId`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `otherNames`, `email`, `phoneNumber`, `password`, `email_verified_at`, `role`, `applicationType`, `jambId`, `remember_token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Nicli', 'Gogol', 'Edolite', 'vctroseji@gmail.com', '08137054875', '$2y$12$ae5XOYVWsB/XUB1Q/lYKDOPmwCb2a35oqhsqsiA1xFBNx4l3NkdnW', NULL, 3, 1, NULL, NULL, '2025-07-08 04:22:21', '2025-07-08 04:22:21', NULL),
(15, 'Tyokyaa', 'Veronica', NULL, 'info@resilience.ng', '08137054879', '$2y$12$tVNlqZRnxzgfjRiCjciYiu6W/3K7mFnu0wRYP.xptpsi6XYdb9Tom', NULL, 1, 1, '202331195', NULL, '2025-07-08 12:28:46', '2025-07-08 12:28:46', NULL),
(16, 'James', 'Terry', NULL, 'example@example.com', '08137054870', '$2y$12$OvLs.BAhJW6APt5iRnok6OvAhHZWzyV/x9j5c/UsIuU8u9IMzQ/Su', NULL, 1, 1, '202331192', NULL, '2025-07-08 14:55:33', '2025-07-08 14:55:33', NULL),
(17, 'Jonah', 'John', 'Nguvan', 'vctroseji2@gmail.com', '08137054875', '$2y$12$I.XSzWpqdHetE3K.CMIon.C5w.VGNzvvrpwTQ.Rou3wFGd6pdks8e', NULL, 1, 1, '202331185', NULL, '2025-07-11 20:02:29', '2025-07-11 20:02:29', NULL),
(18, 'Ndidi', 'Borrofice', 'Edmond', 'vctroseji00@gmail.com', '08137054875', '$2y$12$wiIW8PPyU9lcDCp76OzWEuoEXxVPQ7wege41LinLaVgwhvXOGOGGS', NULL, 1, 1, '202331191', NULL, '2025-07-14 00:28:02', '2025-07-14 00:28:02', NULL),
(19, 'Amzing', 'Grace', NULL, 'vctroseji22@gmail.com', '08137054875', '$2y$12$XGYYOAmJSCY3ldJ5CkoeGe0gg3tykKhZtp93Vf81oE9aUlUZ8SPEO', NULL, 1, 1, '202331194', NULL, '2025-07-14 15:40:23', '2025-07-14 15:40:23', NULL),
(23, 'Tyokyaa', 'Veronica', NULL, 'ernedicool@gmail.com', '08082775076', '$2y$12$RxXXhS9ra5PONZCVILmyHe92YB3qn.DomQXUD7Uw4wvhRLsNGs10W', NULL, 1, 1, '202331207', NULL, '2025-07-17 20:59:20', '2025-07-17 20:59:20', NULL),
(24, 'Tyokyaa', 'Veronica', NULL, 'chuks4god87@yahoo.com', '08082775076', '$2y$12$OTAdv9TRpIQvIaOEN59.M.UkWTezGSoksg7of.v9YEeWVr0hFxZc2', NULL, 1, 1, '202331218', NULL, '2025-07-18 07:51:04', '2025-07-18 07:51:04', NULL),
(25, 'Victor', 'Oseji', NULL, 'vctroseji222@gmail.com', '08105121608', '$2y$12$ae5XOYVWsB/XUB1Q/lYKDOPmwCb2a35oqhsqsiA1xFBNx4l3NkdnW', NULL, 1, 1, NULL, NULL, '2025-07-18 09:36:27', '2025-07-18 09:36:27', NULL),
(29, 'John', 'G', 'Lake', 'vctrosej344i@gmail.com', '09137054875', '$2y$12$6C/Cnx5zuHOPaZvnJLkh6eILnwGNKekiW/9rlkf7F9cSPKa44WELK', NULL, 1, 1, '202331193', NULL, '2025-09-05 00:25:06', '2025-09-05 00:25:06', NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_applicationtype_foreign` FOREIGN KEY (`applicationType`) REFERENCES `application_types` (`typeId`) ON DELETE CASCADE,
  ADD CONSTRAINT `applications_batch_foreign` FOREIGN KEY (`batch`) REFERENCES `batches` (`batchId`) ON DELETE CASCADE,
  ADD CONSTRAINT `applications_hall_foreign` FOREIGN KEY (`hall`) REFERENCES `halls` (`hallId`) ON DELETE CASCADE,
  ADD CONSTRAINT `applications_jambid_foreign` FOREIGN KEY (`jambId`) REFERENCES `jamb` (`jambId`) ON DELETE CASCADE,
  ADD CONSTRAINT `applications_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `batched_candidates`
--
ALTER TABLE `batched_candidates`
  ADD CONSTRAINT `batched_candidates_applicationid_foreign` FOREIGN KEY (`applicationId`) REFERENCES `applications` (`applicationId`) ON DELETE CASCADE,
  ADD CONSTRAINT `batched_candidates_batchid_foreign` FOREIGN KEY (`batchId`) REFERENCES `batches` (`batchId`) ON DELETE CASCADE;

--
-- Constraints for table `hall_assignment`
--
ALTER TABLE `hall_assignment`
  ADD CONSTRAINT `hall_assignment_applicationid_foreign` FOREIGN KEY (`applicationId`) REFERENCES `applications` (`applicationId`) ON DELETE CASCADE,
  ADD CONSTRAINT `hall_assignment_batch_foreign` FOREIGN KEY (`batch`) REFERENCES `batches` (`batchId`) ON DELETE CASCADE,
  ADD CONSTRAINT `hall_assignment_hall_foreign` FOREIGN KEY (`hall`) REFERENCES `halls` (`hallId`) ON DELETE CASCADE,
  ADD CONSTRAINT `hall_assignment_verifiedby_foreign` FOREIGN KEY (`verifiedBy`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `olevel_results`
--
ALTER TABLE `olevel_results`
  ADD CONSTRAINT `olevel_results_applicationid_foreign` FOREIGN KEY (`applicationId`) REFERENCES `applications` (`applicationId`) ON DELETE CASCADE;

--
-- Constraints for table `passport_photographs`
--
ALTER TABLE `passport_photographs`
  ADD CONSTRAINT `passport_photographs_applicationid_foreign` FOREIGN KEY (`applicationId`) REFERENCES `applications` (`applicationId`) ON DELETE CASCADE,
  ADD CONSTRAINT `passport_photographs_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_applicationid_foreign` FOREIGN KEY (`applicationId`) REFERENCES `applications` (`applicationId`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payment_settings`
--
ALTER TABLE `payment_settings`
  ADD CONSTRAINT `payment_settings_applicationtype_foreign` FOREIGN KEY (`applicationType`) REFERENCES `application_types` (`typeId`) ON DELETE CASCADE;

--
-- Constraints for table `rebatched_candidates`
--
ALTER TABLE `rebatched_candidates`
  ADD CONSTRAINT `rebatched_candidates_applicationid_foreign` FOREIGN KEY (`applicationId`) REFERENCES `applications` (`applicationId`) ON DELETE CASCADE,
  ADD CONSTRAINT `rebatched_candidates_newbatchid_foreign` FOREIGN KEY (`newBatchId`) REFERENCES `batches` (`batchId`) ON DELETE CASCADE,
  ADD CONSTRAINT `rebatched_candidates_oldbatchid_foreign` FOREIGN KEY (`oldBatchId`) REFERENCES `batches` (`batchId`) ON DELETE CASCADE,
  ADD CONSTRAINT `rebatched_candidates_rebatchedby_foreign` FOREIGN KEY (`rebatchedBy`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rebatched_candidates_history`
--
ALTER TABLE `rebatched_candidates_history`
  ADD CONSTRAINT `rebatched_candidates_history_applicationid_foreign` FOREIGN KEY (`applicationId`) REFERENCES `applications` (`applicationId`) ON DELETE CASCADE,
  ADD CONSTRAINT `rebatched_candidates_history_newbatchid_foreign` FOREIGN KEY (`newBatchId`) REFERENCES `batches` (`batchId`) ON DELETE CASCADE,
  ADD CONSTRAINT `rebatched_candidates_history_oldbatchid_foreign` FOREIGN KEY (`oldBatchId`) REFERENCES `batches` (`batchId`) ON DELETE CASCADE,
  ADD CONSTRAINT `rebatched_candidates_history_rebatchedby_foreign` FOREIGN KEY (`rebatchedBy`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_permissionid_foreign` FOREIGN KEY (`permissionId`) REFERENCES `permissions` (`permissionId`),
  ADD CONSTRAINT `role_permissions_roleid_foreign` FOREIGN KEY (`roleId`) REFERENCES `roles` (`roleId`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_applicationtype_foreign` FOREIGN KEY (`applicationType`) REFERENCES `application_types` (`typeId`) ON DELETE CASCADE,
  ADD CONSTRAINT `users_jambid_foreign` FOREIGN KEY (`jambId`) REFERENCES `jamb` (`jambId`) ON DELETE CASCADE,
  ADD CONSTRAINT `users_role_foreign` FOREIGN KEY (`role`) REFERENCES `roles` (`roleId`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
