-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: proj_db
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `club_announcements`
--

DROP TABLE IF EXISTS `club_announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `club_announcements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `club_id` varchar(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `club_announcements_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`club_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club_announcements`
--

LOCK TABLES `club_announcements` WRITE;
/*!40000 ALTER TABLE `club_announcements` DISABLE KEYS */;
INSERT INTO `club_announcements` VALUES (2,'owasp','Original try','TRYING TO EDIT','2025-05-05 04:14:16'),(3,'owasp','trying again','trial content','2025-05-05 04:16:53'),(4,'owasp','time time','Uhh 3rd try?','2025-05-06 18:31:26'),(5,'owasp','CLUB APPLICATIONS OUT!!','Are you ready to take your college experience to the next level?\r\n\r\nOWASP is excited to announce that club applications are now open! Whether you\'re into tech, arts, culture, entrepreneurship, or social impact — there\'s a club for you!\r\n\r\n?️ Application Deadline:\r\n12/05/2025\r\n\r\n? Who can apply?\r\nAll students are welcome — first-years to final-years. No prior experience required, just passion and a willingness to learn!\r\n\r\n? How to apply?\r\nVisit the Club Activities section on CampusConnect.\r\n\r\nBrowse through the available clubs.\r\n\r\nClick Apply and fill out the application form.\r\n\r\n⚠️ Don’t miss out!\r\nBeing part of a club is a great way to build your resume, meet new people, and explore your interests.\r\n\r\nApply now and be a part of something bigger!','2025-05-06 18:33:45'),(8,'onyx','Onyx first announcement','Onyx first announcement','2025-05-07 21:35:42');
/*!40000 ALTER TABLE `club_announcements` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-18 14:08:04
