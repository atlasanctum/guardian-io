CREATE TABLE `biodiversity_incidents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`incidentId` varchar(16) NOT NULL,
	`userId` int,
	`incidentType` enum('poaching','habitat-loss','trafficking','sighting') NOT NULL,
	`species` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`severity` enum('critical','high','medium','low') NOT NULL,
	`description` text NOT NULL,
	`reportCount` int NOT NULL DEFAULT 1,
	`attachments` json DEFAULT ('[]'),
	`status` enum('active','monitoring','resolved') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `biodiversity_incidents_id` PRIMARY KEY(`id`),
	CONSTRAINT `biodiversity_incidents_incidentId_unique` UNIQUE(`incidentId`)
);
--> statement-breakpoint
CREATE TABLE `community_contributions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`contributionType` enum('report','observation','support','purchase') NOT NULL,
	`amount` decimal(10,2),
	`points` int NOT NULL DEFAULT 0,
	`description` text,
	`relatedId` varchar(16),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `community_contributions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hotspot_zones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`status` enum('active','monitoring','resolved') NOT NULL DEFAULT 'active',
	`incidentCount` int NOT NULL DEFAULT 0,
	`species` json NOT NULL,
	`color` varchar(7) NOT NULL,
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`radius` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hotspot_zones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `impact_ledger` (
	`id` int AUTO_INCREMENT NOT NULL,
	`metricType` enum('workers-protected','species-protected','forest-preserved','wages-improved','community-fund') NOT NULL,
	`value` decimal(15,2) NOT NULL,
	`unit` varchar(50) NOT NULL,
	`description` text,
	`relatedId` varchar(16),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `impact_ledger_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` varchar(16) NOT NULL,
	`name` varchar(255) NOT NULL,
	`origin` varchar(255) NOT NULL,
	`workerCount` int NOT NULL,
	`fairWageInfo` text NOT NULL,
	`environmentalImpact` text NOT NULL,
	`biodiversityProtection` text NOT NULL,
	`communityBenefits` text NOT NULL,
	`story` text NOT NULL,
	`impactMetrics` json NOT NULL,
	`verificationStatus` enum('pending','verified','certified') NOT NULL DEFAULT 'verified',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_productId_unique` UNIQUE(`productId`)
);
--> statement-breakpoint
CREATE TABLE `worker_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportId` varchar(16) NOT NULL,
	`userId` int,
	`incidentType` enum('harassment','wage-theft','unsafe-conditions','trafficking','other') NOT NULL,
	`description` text NOT NULL,
	`location` varchar(255) NOT NULL,
	`escalationPath` enum('ngo','government','internal','anonymous') NOT NULL,
	`status` enum('submitted','under-review','escalated','resolved') NOT NULL DEFAULT 'submitted',
	`severity` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
	`attachments` json DEFAULT ('[]'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `worker_reports_id` PRIMARY KEY(`id`),
	CONSTRAINT `worker_reports_reportId_unique` UNIQUE(`reportId`)
);
--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `loginMethod`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `lastSignedIn`;