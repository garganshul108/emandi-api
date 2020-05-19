SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `ADMIN` (
  `admin_name` varchar(50) NOT NULL,
  `password` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `ADMIN` (`admin_name`, `password`) VALUES
('anshulgarg', '$2b$10$k3ySYhj06xf1D7bHyhrg2OBCEjfDb1LLyoBDQeELQeXvMNrNJvkWm');

CREATE TABLE `CART` (
  `item_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `crop_id` int(11) NOT NULL,
  `item_qty` decimal(10,2) UNSIGNED NOT NULL,
  `item_cost` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `CITY` (
  `city_id` smallint(6) NOT NULL,
  `name` varchar(25) NOT NULL,
  `state_id` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `CITY` (`city_id`, `name`, `state_id`) VALUES
(2, 'Ghaziabad', 1),
(1, 'Kanpur', 1);

CREATE TABLE `CROP` (
  `crop_id` int(11) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `crop_qty` decimal(10,2) UNSIGNED NOT NULL,
  `crop_price` decimal(10,2) UNSIGNED NOT NULL,
  `crop_name` varchar(200) NOT NULL,
  `crop_type_id` int(11) DEFAULT NULL,
  `packed_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `exp_timestamp` timestamp NOT NULL DEFAULT '1998-12-31 18:30:00',
  `description` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `CROP_TYPE` (
  `crop_type_id` int(11) NOT NULL,
  `crop_type_name` varchar(200) NOT NULL,
  `crop_class` varchar(200) NOT NULL DEFAULT 'OTHER',
  `crop_type_image` varchar(500) DEFAULT 'https://st2.depositphotos.com/6778576/12429/v/950/depositphotos_124298052-stock-illustration-wheat-crop-icon.jpg'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `CROP_TYPE` (`crop_type_id`, `crop_type_name`, `crop_class`, `crop_type_image`) VALUES
(1, 'Garlic', 'VEGETABLES', 'https://emandi-api.herokuapp.com/defaults/crop_type/vegetables/garlic.jpg'),
(2, 'Okra', 'VEGETABLES', 'https://emandi-api.herokuapp.com/defaults/crop_type/vegetables/okra.jpg'),
(3, 'Cucumber', 'VEGETABLES', 'https://emandi-api.herokuapp.com/defaults/crop_type/vegetables/cucumber.jpg'),
(4, 'Peas', 'VEGETABLES', 'https://emandi-api.herokuapp.com/defaults/crop_type/vegetables/frozen_peas.jpg'),
(5, 'Apple', 'FRUITS', 'https://emandi-api.herokuapp.com/defaults/crop_type/fruits/apple.jpg'),
(6, 'Banana', 'FRUITS', 'https://emandi-api.herokuapp.com/defaults/crop_type/fruits/banana.jpg'),
(7, 'Grapes', 'FRUITS', 'https://emandi-api.herokuapp.com/defaults/crop_type/fruits/grapes.jpg'),
(8, 'Orange', 'FRUITS', 'https://emandi-api.herokuapp.com/defaults/crop_type/fruits/orange.jpg'),
(9, 'Barley', 'GRAINS', 'https://emandi-api.herokuapp.com/defaults/crop_type/grains/barley.jpg'),
(10, 'Oats', 'GRAINS', 'https://emandi-api.herokuapp.com/defaults/crop_type/grains/oats.jpg'),
(11, 'Quinoa', 'GRAINS', 'https://emandi-api.herokuapp.com/defaults/crop_type/grains/quinoa.jpg'),
(12, 'Rice', 'GRAINS', 'https://emandi-api.herokuapp.com/defaults/crop_type/grains/rice.jpg');


CREATE TABLE `ORDERED_ITEM` (
  `order_id` int(11) NOT NULL,
  `crop_id` int(11) NOT NULL,
  `item_qty` decimal(10,2) UNSIGNED NOT NULL,
  `item_freezed_cost` decimal(10,2) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `ORDERS` (
  `order_id` int(11) NOT NULL,
  `issue_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int(11) NOT NULL,
  `delivery_address` varchar(300) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `order_status` varchar(20) DEFAULT 'PENDING'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `OTP_LOGIN` (
  `subscriber_id` int(11) NOT NULL,
  `subscriber_type` varchar(20) NOT NULL,
  `contact` bigint(20) NOT NULL,
  `otp` int(11) NOT NULL,
  `reg_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `OTP_SIGNUP` (
  `subscriber_type` varchar(20) NOT NULL,
  `contact` bigint(20) NOT NULL,
  `otp` int(11) NOT NULL,
  `reg_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `STATE` (
  `state_id` tinyint(4) NOT NULL,
  `name` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `STATE` (`state_id`, `name`) VALUES
(1, 'Uttar Pradesh');

CREATE TABLE `USER` (
  `user_id` int(11) NOT NULL,
  `device_fcm_token` varchar(500) DEFAULT NULL,
  `contact` bigint(20) NOT NULL,
  `name` varchar(25) DEFAULT NULL,
  `state_id` tinyint(4) DEFAULT NULL,
  `city_id` smallint(6) DEFAULT NULL,
  `pin_code` int(11) DEFAULT NULL,
  `reg_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `address` varchar(1000) DEFAULT NULL,
  `profile_picture` varchar(1000) DEFAULT NULL,
  `orders_issued` int(11) DEFAULT '0',
  `orders_cancelled_by_user` int(11) DEFAULT '0',
  `order_domino_number` tinyint(4) DEFAULT '0',
  `defaulter_status` varchar(30) DEFAULT 'NO_ISSUE',
  `defaulter_timestamp` timestamp NOT NULL DEFAULT '1998-12-31 18:30:00',
  `defaulter_period` timestamp NOT NULL DEFAULT '1998-12-31 18:30:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `VENDOR` (
  `vendor_id` int(11) NOT NULL,
  `contact` bigint(20) NOT NULL,
  `type` varchar(25) DEFAULT NULL,
  `name` varchar(25) DEFAULT NULL,
  `state_id` tinyint(4) DEFAULT NULL,
  `city_id` smallint(6) DEFAULT NULL,
  `pin_code` int(11) DEFAULT NULL,
  `address` varchar(1000) DEFAULT NULL,
  `profile_picture` varchar(1000) DEFAULT NULL,
  `reg_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `device_fcm_token` varchar(500) DEFAULT NULL,
  `orders_recieved` int(11) DEFAULT '0',
  `orders_cancelled_by_user` int(11) DEFAULT '0',
  `orders_cancelled_by_vendor` int(11) DEFAULT '0',
  `order_domino_number` tinyint(4) DEFAULT '0',
  `defaulter_status` varchar(30) DEFAULT 'NO_ISSUE',
  `defaulter_timestamp` timestamp NOT NULL DEFAULT '1998-12-31 18:30:00',
  `defaulter_period` timestamp NOT NULL DEFAULT '1998-12-31 18:30:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


ALTER TABLE `ADMIN`
  ADD PRIMARY KEY (`admin_name`);

ALTER TABLE `CART`
  ADD PRIMARY KEY (`item_id`),
  ADD UNIQUE KEY `crop_id` (`crop_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `CITY`
  ADD PRIMARY KEY (`city_id`),
  ADD UNIQUE KEY `state_id` (`state_id`,`name`);

ALTER TABLE `CROP`
  ADD PRIMARY KEY (`crop_id`),
  ADD KEY `crop_type_id` (`crop_type_id`),
  ADD KEY `vendor_id` (`vendor_id`);

ALTER TABLE `CROP_TYPE`
  ADD PRIMARY KEY (`crop_type_id`);

ALTER TABLE `ORDERED_ITEM`
  ADD KEY `order_id` (`order_id`),
  ADD KEY `crop_id` (`crop_id`);

ALTER TABLE `ORDERS`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `vendor_id` (`vendor_id`);

ALTER TABLE `STATE`
  ADD PRIMARY KEY (`state_id`),
  ADD UNIQUE KEY `name` (`name`);

ALTER TABLE `USER`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `contact` (`contact`),
  ADD KEY `state_id` (`state_id`),
  ADD KEY `city_id` (`city_id`);

ALTER TABLE `VENDOR`
  ADD PRIMARY KEY (`vendor_id`),
  ADD UNIQUE KEY `contact` (`contact`),
  ADD KEY `state_id` (`state_id`),
  ADD KEY `city_id` (`city_id`);


ALTER TABLE `CART`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `CITY`
  MODIFY `city_id` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
ALTER TABLE `CROP`
  MODIFY `crop_id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `CROP_TYPE`
  MODIFY `crop_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
ALTER TABLE `ORDERS`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `STATE`
  MODIFY `state_id` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
ALTER TABLE `USER`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `VENDOR`
  MODIFY `vendor_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `CART`
  ADD CONSTRAINT `CART_ibfk_1` FOREIGN KEY (`crop_id`) REFERENCES `CROP` (`crop_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `CART_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `USER` (`user_id`) ON DELETE CASCADE;

ALTER TABLE `CITY`
  ADD CONSTRAINT `CITY_ibfk_1` FOREIGN KEY (`state_id`) REFERENCES `STATE` (`state_id`) ON DELETE CASCADE;

ALTER TABLE `CROP`
  ADD CONSTRAINT `CROP_ibfk_1` FOREIGN KEY (`crop_type_id`) REFERENCES `CROP_TYPE` (`crop_type_id`),
  ADD CONSTRAINT `CROP_ibfk_2` FOREIGN KEY (`vendor_id`) REFERENCES `VENDOR` (`vendor_id`) ON DELETE CASCADE;

ALTER TABLE `ORDERED_ITEM`
  ADD CONSTRAINT `ORDERED_ITEM_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `ORDERS` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ORDERED_ITEM_ibfk_2` FOREIGN KEY (`crop_id`) REFERENCES `CROP` (`crop_id`) ON DELETE CASCADE;

ALTER TABLE `ORDERS`
  ADD CONSTRAINT `ORDERS_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `USER` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ORDERS_ibfk_2` FOREIGN KEY (`vendor_id`) REFERENCES `VENDOR` (`vendor_id`) ON DELETE CASCADE;

ALTER TABLE `USER`
  ADD CONSTRAINT `USER_ibfk_1` FOREIGN KEY (`state_id`) REFERENCES `STATE` (`state_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `USER_ibfk_2` FOREIGN KEY (`city_id`) REFERENCES `CITY` (`city_id`) ON DELETE CASCADE;

ALTER TABLE `VENDOR`
  ADD CONSTRAINT `VENDOR_ibfk_1` FOREIGN KEY (`state_id`) REFERENCES `STATE` (`state_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `VENDOR_ibfk_2` FOREIGN KEY (`city_id`) REFERENCES `CITY` (`city_id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
