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
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `branch` varchar(50) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (1,'Data Structures and Algorithms','CSE','Fundamentals of data structures and algorithms including time complexity, stacks, queues, trees, and graphs.'),(2,'Operating Systems','CSE','Concepts of operating systems such as processes, memory management, and file systems.'),(3,'Computer Networks','CSE','Study of computer networking concepts including TCP/IP, routing, and protocols.'),(4,'Database Management Systems','CSE','Design and use of relational databases, SQL, normalization, and transactions.'),(5,'Object-Oriented Programming','CSE','Introduction to object-oriented programming principles using languages like Java or C++.'),(6,'Software Engineering','CSE','Software development life cycle, agile methodology, testing, and maintenance.'),(7,'System Design','CSE','High-level system architecture, scalability, and design patterns for large systems.'),(8,'Machine Learning','AIML','Core concepts and algorithms in machine learning including supervised and unsupervised learning.'),(9,'Deep Learning','AIML','Deep neural networks, CNNs, RNNs, and practical applications of deep learning.'),(10,'Data Science','AIML','Introduction to data science including data wrangling, analysis, and visualization.'),(11,'NLP','AIML','Natural Language Processing fundamentals including text processing, sentiment analysis, and transformers.'),(12,'Python for AI','AIML','Python programming with applications in AI and machine learning.'),(13,'Digital Electronics','ECE','Digital logic design, number systems, flip-flops, counters, and registers.'),(14,'Analog Electronics','ECE','Design and analysis of analog circuits, amplifiers, and filters.'),(15,'Signals and Systems','ECE','Mathematical tools for analyzing and designing signal systems.'),(16,'Communication Systems','ECE','Analog and digital communication techniques, modulation, and transmission.'),(17,'Microprocessors and Microcontrollers','ECE','Microprocessor architecture and interfacing with microcontrollers.'),(18,'Electrical Machines','EEE','Principles and operation of electrical machines such as motors and generators.'),(19,'Power Systems','EEE','Generation, transmission, and distribution of electric power.'),(20,'Control Systems','EEE','Control theory, system modeling, and feedback systems.'),(21,'Power Electronics','EEE','Power semiconductor devices and converters used in power electronics.'),(22,'Electrical Measurements','EEE','Techniques and instruments used for measuring electrical quantities.'),(23,'Structural Analysis','Civil','Analysis of structures under various loads and conditions.'),(24,'Geotechnical Engineering','Civil','Study of soil behavior and its applications in foundation engineering.'),(25,'Transportation Engineering','Civil','Design and analysis of highways, railways, and other transportation systems.'),(26,'Surveying','Civil','Measurement and mapping of land using various surveying techniques.'),(27,'Environmental Engineering','Civil','Study of environmental impact and methods for pollution control.'),(28,'Thermodynamics','Mech','Laws of thermodynamics, heat engines, and applications in mechanical systems.'),(29,'Strength of Materials','Mech','Stress-strain analysis of materials and their mechanical properties.'),(30,'Machine Design','Mech','Design principles of machine components under various loading conditions.'),(31,'Heat Transfer','Mech','Modes of heat transfer including conduction, convection, and radiation.'),(32,'Fluid Mechanics','Mech','Fluid behavior under static and dynamic conditions.'),(33,'Java Programming','ISE','Java language syntax, OOP principles, and application development.'),(34,'Cyber Security','ISE','Principles of information security, cryptography, and threat management.'),(35,'DevOps','ISE','Tools and practices for continuous integration, delivery, and automation.'),(36,'Cloud Computing','ISE','Concepts of cloud services, virtualization, and cloud infrastructure.'),(37,'Big Data Analytics','ISE','Techniques for processing and analyzing large volumes of data.');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-18 14:08:06
