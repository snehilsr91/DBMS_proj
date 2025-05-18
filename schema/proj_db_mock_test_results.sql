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
-- Table structure for table `mock_test_results`
--

DROP TABLE IF EXISTS `mock_test_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mock_test_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usn` varchar(15) DEFAULT NULL,
  `test_type` varchar(10) DEFAULT NULL,
  `score` int DEFAULT NULL,
  `attempted_questions` int DEFAULT NULL,
  `correct_answers` int DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `total_questions` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mock_test_results`
--

LOCK TABLES `mock_test_results` WRITE;
/*!40000 ALTER TABLE `mock_test_results` DISABLE KEYS */;
INSERT INTO `mock_test_results` VALUES (1,'','technical',0,10,0,'2025-05-03 14:56:37',10),(2,'112','technical',0,10,0,'2025-05-03 15:45:40',10),(3,'112','technical',0,10,0,'2025-05-03 15:51:34',10),(4,'112','technical',0,10,0,'2025-05-03 15:53:44',10),(5,'112','technical',9,10,9,'2025-05-03 15:57:39',10),(6,'112','technical',10,10,10,'2025-05-03 16:01:33',10),(7,'112','technical',9,10,9,'2025-05-03 16:03:39',10),(8,'112','technical',9,10,9,'2025-05-03 16:05:29',10),(9,'112','technical',9,10,9,'2025-05-03 16:06:20',10),(10,'112','technical',4,10,4,'2025-05-03 16:17:03',10),(11,'112','hr',9,10,9,'2025-05-03 16:56:38',10),(12,'1234','technical',6,10,6,'2025-05-03 18:20:33',10),(13,'112','hr',3,10,3,'2025-05-04 18:13:20',10),(14,'112','technical',9,10,9,'2025-05-04 22:54:41',10),(15,'112','technical',6,10,6,'2025-05-04 22:57:30',10),(16,'112','technical',6,10,6,'2025-05-04 22:58:42',10),(17,'112','technical',8,10,8,'2025-05-04 22:59:51',10),(18,'112','technical',5,10,5,'2025-05-04 23:08:31',10),(19,'112','technical',6,10,6,'2025-05-04 23:30:11',10),(20,'112','hr',5,10,5,'2025-05-04 23:41:48',10),(21,'168','technical',6,10,6,'2025-05-05 02:10:17',10),(22,'112','technical',6,10,6,'2025-05-05 08:55:31',10),(23,'4NI23CI101','technical',4,10,4,'2025-05-05 14:59:44',10),(24,'112','technical',4,10,4,'2025-05-07 14:16:05',10),(25,'112','technical',3,5,3,'2025-05-08 12:51:32',5),(26,'112','technical',3,5,3,'2025-05-08 13:00:33',5),(27,'112','technical',5,5,5,'2025-05-08 13:01:02',5),(28,'112','technical',2,5,2,'2025-05-08 13:21:11',5),(29,'112','technical',1,2,1,'2025-05-08 19:16:34',5),(30,'112','technical',2,2,2,'2025-05-08 19:43:36',10),(31,'112','hr',10,10,10,'2025-05-08 21:16:58',10),(32,'112','technical',0,0,0,'2025-05-08 22:19:01',20),(33,'112','technical',1,1,1,'2025-05-08 22:48:07',20),(34,'112','technical',1,1,1,'2025-05-08 22:48:25',20),(35,'112','technical',3,5,3,'2025-05-08 22:50:45',5),(36,'112','technical',3,5,3,'2025-05-08 23:00:28',5),(37,'112','technical',1,1,1,'2025-05-08 23:00:46',5),(38,'112','technical',2,2,2,'2025-05-08 23:01:00',5),(39,'112','technical',2,5,2,'2025-05-08 23:15:10',5),(40,'112','technical',2,5,2,'2025-05-08 23:15:59',5),(41,'112','technical',4,5,4,'2025-05-08 23:23:38',5),(42,'112','technical',6,11,6,'2025-05-08 23:24:10',20),(43,'112','technical',3,5,3,'2025-05-08 23:29:36',5),(44,'112','technical',4,5,4,'2025-05-08 23:30:49',5),(45,'112','technical',3,5,3,'2025-05-08 23:36:02',5),(46,'112','technical',3,5,3,'2025-05-08 23:46:21',5),(47,'112','hr',5,5,5,'2025-05-08 23:48:01',5),(48,'112','hr',5,5,5,'2025-05-08 23:48:20',5),(49,'112','technical',4,5,4,'2025-05-08 23:48:49',5),(50,'112','hr',4,5,4,'2025-05-08 23:52:07',5),(51,'112','technical',3,5,3,'2025-05-09 00:05:45',5),(52,'112','technical',3,5,3,'2025-05-09 00:06:53',5),(53,'4NI23CI105','technical',3,5,3,'2025-05-09 21:26:11',5),(54,'4NI23CI105','hr',3,5,3,'2025-05-09 21:29:32',5),(55,'112','technical',3,5,3,'2025-05-09 22:03:20',5),(56,'112','technical',3,5,3,'2025-05-15 13:24:15',5),(57,'112','technical',2,5,2,'2025-05-15 22:12:03',5),(58,'112','technical',5,5,5,'2025-05-15 23:59:03',5);
/*!40000 ALTER TABLE `mock_test_results` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-18 14:08:05
