CREATE TABLE `memoirs` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`content` text,
	`date` text,
	`createdAt` text,
	`updatedAt` text,
	`media` text,
	`titleVisible` integer DEFAULT 1 NOT NULL,
	`features` text
);
