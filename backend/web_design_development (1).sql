-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 23, 2025 at 05:08 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `web_design_development`
--

-- --------------------------------------------------------

--
-- Table structure for table `abonnees`
--

CREATE TABLE `abonnees` (
  `id` int(11) NOT NULL,
  `email_telephone` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `abonnees`
--

INSERT INTO `abonnees` (`id`, `email_telephone`) VALUES
(3, 'yassinemalal@gmail.com'),
(4, 'yassinemalal2@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id_admin` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('superAdmin','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id_admin`, `email`, `password`, `role`) VALUES
(3, 'nouvel.email@example.com', '$2y$10$ngk4nNw4dslSeteyHtxLEeVI.JMiKe6RhnW3pRak4I.nW1VdtZM82', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `avis_utilisateurs`
--

CREATE TABLE `avis_utilisateurs` (
  `id` int(11) NOT NULL,
  `nom_prenom` varchar(255) NOT NULL,
  `message` longtext NOT NULL,
  `approuve` tinyint(1) DEFAULT NULL,
  `id_publication` int(11) DEFAULT NULL,
  `id_service` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `avis_utilisateurs`
--

INSERT INTO `avis_utilisateurs` (`id`, `nom_prenom`, `message`, `approuve`, `id_publication`, `id_service`, `created_at`) VALUES
(4, 'Nouveau Nom', 'Nouveau message modifié', 0, NULL, NULL, '2025-04-23 14:11:21'),
(7, 'Ali Benali', 'Super service !', 0, NULL, 1, '2025-04-23 14:26:24');

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id_contact` bigint(20) NOT NULL,
  `nom_prenom` varchar(60) NOT NULL,
  `adresse_email` varchar(60) NOT NULL,
  `telephone` varchar(15) NOT NULL,
  `sujet` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact`
--

INSERT INTO `contact` (`id_contact`, `nom_prenom`, `adresse_email`, `telephone`, `sujet`) VALUES
(2, 'Nouveau Nom', 'Nouveau message modifié', '0655246069', 'je veut de faire un site web'),
(4, 'Nouveau Nom', 'Nouveau message modifié', '0655246069', 'je veut de faire un site de design web comme vos ');

-- --------------------------------------------------------

--
-- Table structure for table `projects_requests`
--

CREATE TABLE `projects_requests` (
  `id` int(20) NOT NULL,
  `nom_prenom` varchar(255) NOT NULL,
  `telephone` varchar(15) NOT NULL,
  `categorie_publication` int(11) NOT NULL,
  `message` longtext NOT NULL,
  `id_publication` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects_requests`
--

INSERT INTO `projects_requests` (`id`, `nom_prenom`, `telephone`, `categorie_publication`, `message`, `id_publication`) VALUES
(4, 'Ahmed Benali', '0612345678', 2, 'Je souhaite créer un site vitrine pour mon entreprise.', NULL),
(5, 'Ahmed Benali', '0612345678', 2, 'Je souhaite créer un site vitrine pour mon entreprise.', NULL),
(6, 'Ahmed Benali', '0612345678', 2, 'Je souhaite créer un site vitrine pour mon entreprise.', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `publications`
--

CREATE TABLE `publications` (
  `id_publication` int(11) NOT NULL,
  `image` varchar(1000) NOT NULL,
  `lien_web_site` varchar(1000) DEFAULT NULL,
  `id_service` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `service_id` int(11) NOT NULL,
  `nom_service` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `image` varchar(1000) NOT NULL,
  `ia_active` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`service_id`, `nom_service`, `description`, `image`, `ia_active`) VALUES
(1, 'creation des site web', 'this service is to create the web sites', 'image.png', NULL),
(2, 'design graphique', 'this part is related to the design graphique', 'picture.jpg', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `abonnees`
--
ALTER TABLE `abonnees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id_admin`);

--
-- Indexes for table `avis_utilisateurs`
--
ALTER TABLE `avis_utilisateurs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_avis_publication` (`id_publication`),
  ADD KEY `fk_avis_service` (`id_service`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id_contact`);

--
-- Indexes for table `projects_requests`
--
ALTER TABLE `projects_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_avis_project_requests_publications` (`id_publication`),
  ADD KEY `fk_projects_requests_services` (`categorie_publication`);

--
-- Indexes for table `publications`
--
ALTER TABLE `publications`
  ADD PRIMARY KEY (`id_publication`),
  ADD KEY `fk_avis_publication_service` (`id_service`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`service_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `abonnees`
--
ALTER TABLE `abonnees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `avis_utilisateurs`
--
ALTER TABLE `avis_utilisateurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `id_contact` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `projects_requests`
--
ALTER TABLE `projects_requests`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `publications`
--
ALTER TABLE `publications`
  MODIFY `id_publication` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `avis_utilisateurs`
--
ALTER TABLE `avis_utilisateurs`
  ADD CONSTRAINT `fk_avis_publication` FOREIGN KEY (`id_publication`) REFERENCES `publications` (`id_publication`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_avis_service` FOREIGN KEY (`id_service`) REFERENCES `services` (`service_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `projects_requests`
--
ALTER TABLE `projects_requests`
  ADD CONSTRAINT `fk_avis_project_requests_publications` FOREIGN KEY (`id_publication`) REFERENCES `publications` (`id_publication`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_projects_requests_services` FOREIGN KEY (`categorie_publication`) REFERENCES `services` (`service_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `publications`
--
ALTER TABLE `publications`
  ADD CONSTRAINT `fk_avis_publication_service` FOREIGN KEY (`id_service`) REFERENCES `services` (`service_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
