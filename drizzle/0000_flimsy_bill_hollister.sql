CREATE TABLE `healthMaterials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`healthMaterialType` enum('report','medical_history','patient_image') NOT NULL,
	`title` varchar(160) NOT NULL,
	`originalFilename` varchar(255) NOT NULL,
	`mimeType` varchar(127) NOT NULL,
	`sizeBytes` int NOT NULL,
	`storageKey` varchar(700) NOT NULL,
	`storageUrl` varchar(800) NOT NULL,
	`notes` text,
	`materialDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `healthMaterials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patientAssessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`patientName` varchar(100) NOT NULL,
	`riskScore` int NOT NULL,
	`riskLevel` varchar(24) NOT NULL,
	`heartRate` int NOT NULL,
	`systolicBP` int NOT NULL,
	`diastolicBP` int NOT NULL,
	`oxygenSaturation` int NOT NULL,
	`temperature` varchar(16) NOT NULL,
	`assessmentPayload` text NOT NULL,
	`assessedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `patientAssessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patientProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`displayName` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patientProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `patientProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
ALTER TABLE `healthMaterials` ADD CONSTRAINT `healthMaterials_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patientAssessments` ADD CONSTRAINT `patientAssessments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patientProfiles` ADD CONSTRAINT `patientProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `healthMaterials_userId_createdAt_idx` ON `healthMaterials` (`userId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `patientAssessments_userId_assessedAt_idx` ON `patientAssessments` (`userId`,`assessedAt`);