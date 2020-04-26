create table ADMIN(
	admin_id INT PRIMARY KEY AUTO_INCREMENT,
	api_key VARCHAR(500),
	name VARCHAR(25)
);

create table STATE(
	--- HANDLED BY ADMIN ---
	state_id TINYINT AUTO_INCRMENT,
	name VARCHAR(25)
);


create table CITY(
	--- HANDLED BY ADMIN ---
	city_id SMALLINT AUTO_INCREMENT,
	name VARCHAR(25),
	state_id TINYINT
);


create table VENDOR (
	--- PROFILE ---
	vendor_id INT AUTO_INCREMENT,
	type CHAR(1) NOT NULL,
	name VARCHAR(25) NOT NULL, 
	state_id  TINYINT NOT NULL,
	city_id SMALLINT NOT NULL,
	pin_code SMALLINT NOT NULL,
	reg_date TIMESTAMP NOT NULL,
	unreg_date TIMESTAMP,
	address VARCHAR(1000),
	contact BIGINT,
	profile_picture VARCHAR(1000),	
	--- DEVICE RELATED --- SENT ON LOGIN/SIGNUP
	device_fcm_token VARCHAR(500),
	--- ORDER RELATED --- HANDLED INTERNALLY
	orders_recieved INT DEFAULT 0,
	orders_cancelled_by_user INT DEFAULT 0,
	orders_cancelled_by_vendor INT DEFAULT 0,
	order_domino_number TINYINT DEFAULT 0, -- after a limit, don't allow cancellation
	--- BAN RELATED --- HANDLED BY ADMIN
	defaulter_status TINYINT DEFAULT 0, -- 0: no issue, 1: suspended, 2: banned
	--- BAN RELATED --- HANDLED INTERNALLY
	defaulter_timestamp TIMESTAMP,
	defaulter_period TIMESTAMP,
	--- SALE RELATED ---
	current_sale_ID INT
);


create table USER(
	--- PROFILE ---
	user_id INT AUTO_INCREMENT,
	name VARCHAR(25) NOT NULL, 
	state_id  TINYINT NOT NULL,
	city_id SMALLINT NOT NULL,
	pin_code SMALLINT NOT NULL,
	reg_date TIMESTAMP NOT NULL,
	unreg_date TIMESTAMP,
	address VARCHAR(1000),
	contact BIGINT,
	profile_picture VARCHAR(1000),
	--- DEVICE RELATED ---
	device_fcm_token VARCHAR(500),
	--- ORDER RELATED --- HANDLED INTERNALLY
	orders_issued INT DEFAULT 0,
	orders_cancelled_by_user INT DEFAULT 0,
	order_domino_number TINYINT DEFAULT 0, -- after a limit, don't allow cancellation
	--- BAN RELATED --- HANDLED BY ADMIN 
	defaulter_status TINYINT DEFAULT 0, -- 0: no issue, 1: suspended, 2: banned
	--- BAN RELATED --- HANDLED INTERNALLY
	defaulter_timestamp TIMESTAMP,
	defaulter_period TIMESTAMP
);



-- relates distributor participation in sale
-- create table SALE_HISTORY(
-- 	vendor_id INT NOT NULL,
-- 	sale_id INT NOT NULL,
-- 	sale_status BOOLEAN DEFAULT 0
-- );

-- relates distributor and consumer
create table ORDER(
	--- PROFILE ---
	order_id INT AUTO_INCREMENT,
	issue_date TIMESTAMP NOT NULL,
	user_id INT NOT NULL,
	vendor_id INT NOT NULL,
	delivery_address VARCHAR(300) NOT NULL,
price DECIMAL(10,2),
	--- ORDER STATUS ---
	order_status TINYINT DEFAULT 0, -- 0: placed 1: delivered 2: cancelled
	user_delivery_confirmation BOOLEAN DEFAULT 0,
	vendor_delivery_confirmation BOOLEAN DEFAULT 0
);

-- relates the order to the product
create table ORDERED_ITEM(
	order_id INT NOT NULL,
	product_id INT NOT NULL
);

-- relates custumer to the choosen product
create table CART(
	user_id INT NOT NULL,
	product_id INT NOT NULL
);


create table PRODUCT(
	product_id INT AUTO_INCREMENT,
	crop_id INT NOT NULL,
	qty DECIMAL(10,2) NOT NULL,
	cost DECIMAL(10,2) NOT NULL
);



create table CROP(
	crop_id INT AUTO_INCREMENT,
	vendor_id INT,
	qty DECIMAL(10,2) NOT NULL,
	crop_name VARCHAR(200) NOT NULL,
	crop_type_id INT,
	packed_date TIMESTAMP NOT NULL DEFAULT NOW(),
	exp_date TIMESTAMP,
	freeze_status TINYINT DEFAULT 0, -- 0: can be edited, 1: cannot be edited
	description VARCHAR(200)
);

create table CROP_TYPE(
	crop_type_id INT AUTO_INCREMENT,
	crop_type_name VARCHAR(200)
);

-- create table OFFER(
-- 	offer_id INT AUTO_INCREMENT,
-- 	vendor_id INT NOT NULL,
-- 	crop_id INT NOT NULL,
-- 	new_price DECIMAL(10,2),
-- 	discount_precentage DECIMAL(4,2),
-- 	status BOOLEAN DEFAULT 1, -- 0: off 1:on
-- 	reg_timestamp TIMESTAMP DEFAULT NOW(),
-- 	offer_period TIMESTAMP
-- );

-- create table SALE(
-- 	sale_id INT AUTO_INCREMENT,
-- 	crop_type_id INT,
-- 	new_price DECIMAL(10,2),
-- 	discount_precentage DECIMAL(4,2),
-- 	reg_timestamp TIMESTAMP DEFAULT NOW(),
-- 	sale_period TIMESTAMP
-- );


create table NOTIFICATION(
	vendor_id INT,
	user_id INT,
	device_fcm_token INT,
	message VARCHAR(300) NOT NULL,
	issue_date TIMESTAMP DEFAULT NOW(),
	view_status BOOLEAN DEFAULT 0,
	view_date TIMESTAMP
);

create table COMPLAINT(
	complaint_id INT AUTO_INCREMENT,
	order_id INT NOT NULL,
	type VARCHAR(200),
	status TINYINT DEFAULT 0, -- 0: OPEN, 1: CLOSED, 2: REOPEN 
	reg_date TIMESTAMP NOT NULL DEFAULT NOW(),
	resolve_date TIMESTAMP
);

create table PROOF(
	proof_id INT AUTO_INCREMENT,
	complaint_id INT,
	type TINYINT, -- 0: IMAGE, 1:PDF, 3:OTHER
	resource_url VARCHAR(100),
	description VARCHAR(500)
);

