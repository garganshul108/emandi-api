create table ADMIN(
	admin_name VARCHAR(50) PRIMARY KEY,
    password VARCHAR(150) NOT NULL
);

create table STATE(
	state_id TINYINT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(25) UNIQUE NOT NULL
);


create table CITY(
	city_id SMALLINT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(25) NOT NULL,
	state_id TINYINT NOT NULL,
    UNIQUE(state_id, name),
    FOREIGN KEY (state_id)
    REFERENCES STATE(state_id)
    ON DELETE CASCADE 
);



create table VENDOR (
	--- PROFILE ---
	-- SIGN UP VIA OTP --
	vendor_id INT AUTO_INCREMENT PRIMARY KEY,
	contact BIGINT UNIQUE NOT NULL,
	-- PROFILE --
	type VARCHAR(25),
	name VARCHAR(25), 
	state_id  TINYINT,
	city_id SMALLINT,
	pin_code INT,
	address VARCHAR(1000),
	profile_picture VARCHAR(1000),
	-- AUTOMATIC --
	reg_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
	unreg_timestamp TIMESTAMP,
	--- DEVICE RELATED --- SENT ON LOGIN/SIGNUP
	device_fcm_token VARCHAR(500),
	--- ORDER RELATED --- HANDLED INTERNALLY
	orders_recieved INT DEFAULT 0,
	orders_cancelled_by_user INT DEFAULT 0,
	orders_cancelled_by_vendor INT DEFAULT 0,
	order_domino_number TINYINT DEFAULT 0, -- after a limit, don't allow cancellation
	--- BAN RELATED --- HANDLED BY ADMIN
	defaulter_status VARCHAR(30) DEFAULT "NO_ISSUE", -- 0: no issue, 1: suspended, 2: banned
	--- BAN RELATED --- HANDLED INTERNALLY
	defaulter_timestamp TIMESTAMP,
	defaulter_period TIMESTAMP,
    FOREIGN KEY (state_id)
    REFERENCES STATE(state_id)
    ON DELETE CASCADE,
    FOREIGN KEY (city_id)
    REFERENCES CITY(city_id)
    ON DELETE CASCADE

);


create table USER(
	--- SIGNUP LOGIN ----
	user_id INT PRIMARY KEY AUTO_INCREMENT,
    device_fcm_token VARCHAR(500),
	contact BIGINT UNIQUE NOT NULL,
	--- PROFILE ---
	name VARCHAR(25), 
	state_id  TINYINT,
	city_id SMALLINT,
	pin_code INT,
	reg_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
	unreg_timestamp TIMESTAMP,
	address VARCHAR(1000),
	profile_picture VARCHAR(1000),
	--- DEVICE RELATED ---
	
	--- ORDER RELATED --- HANDLED INTERNALLY
	orders_issued INT DEFAULT 0,
	orders_cancelled_by_user INT DEFAULT 0,
	order_domino_number TINYINT DEFAULT 0, -- after a limit, don't allow cancellation
	--- BAN RELATED --- HANDLED BY ADMIN 
	defaulter_status VARCHAR(30) DEFAULT "NO_ISSUE", -- 0: no issue, 1: suspended, 2: banned
	--- BAN RELATED --- HANDLED INTERNALLY
	defaulter_timestamp TIMESTAMP,
	defaulter_period TIMESTAMP,
    FOREIGN KEY (state_id)
    REFERENCES STATE(state_id)
    ON DELETE CASCADE,
    FOREIGN KEY (city_id)
    REFERENCES CITY(city_id)
    ON DELETE CASCADE
);


create table OTP_SIGNUP(
    subscriber_type VARCHAR(20) NOT NULL,
    contact BIGINT NOT NULL,
    otp INT NOT NULL,
    reg_timestamp TIMESTAMP DEFAULT NOW()
);

create table OTP_LOGIN(
	subscriber_id INT NOT NULL,
	subscriber_type VARCHAR(20) NOT NULL,
    contact BIGINT NOT NULL,
    otp INT NOT NULL,
    reg_timestamp TIMESTAMP DEFAULT NOW()
);



---- in dev db ----




-- relates distributor participation in sale
-- create table SALE_HISTORY(
-- 	vendor_id INT NOT NULL,
-- 	sale_id INT NOT NULL,
-- 	sale_status BOOLEAN DEFAULT 0
-- );

-- relates distributor and consumer


create table CROP_TYPE(
	crop_type_id INT PRIMARY KEY AUTO_INCREMENT,
	crop_type_name VARCHAR(200) NOT NULL,
	crop_class VARCHAR(200) NOT NULL DEFAULT "OTHER"
);

create table CROP(
	crop_id INT PRIMARY KEY AUTO_INCREMENT,
	vendor_id INT NOT NULL,
	crop_qty DECIMAL(10,2) UNSIGNED NOT NULL,
	crop_price DECIMAL(10,2) UNSIGNED NOT NULL,
	crop_name VARCHAR(200) NOT NULL,
	crop_type_id INT,
	packed_timestamp TIMESTAMP DEFAULT NOW(),
	exp_timestamp TIMESTAMP DEFAULT "1999-01-01 00:00:00",
	description VARCHAR(200),
	FOREIGN KEY (crop_type_id)
    REFERENCES CROP_TYPE(crop_type_id),
	FOREIGN KEY (vendor_id)
    REFERENCES VENDOR(vendor_id)
    ON DELETE CASCADE 
);



-- relates custumer to the choosen product
create table CART(
	item_id INT PRIMARY KEY AUTO_INCREMENT,
	user_id INT NOT NULL,
	crop_id INT NOT NULL,
	item_qty DECIMAL(10,2) UNSIGNED NOT NULL,
	item_cost DECIMAL(10,2),
	FOREIGN KEY (crop_id)
    REFERENCES CROP(crop_id)
    ON DELETE CASCADE,
	FOREIGN KEY (user_id)
    REFERENCES USER(user_id)
    ON DELETE CASCADE
);






	
create table ORDERS(
	order_id INT PRIMARY KEY AUTO_INCREMENT,
	issue_timestamp TIMESTAMP DEFAULT NOW(),
	user_id INT NOT NULL,
	delivery_address VARCHAR(300) NOT NULL,
	vendor_id INT NOT NULL,
	order_status VARCHAR(20) DEFAULT "PENDING",
	FOREIGN KEY (user_id)
    REFERENCES USER(user_id)
    ON DELETE CASCADE,
	FOREIGN KEY (vendor_id)
    REFERENCES VENDOR(vendor_id)
    ON DELETE CASCADE
);

-- relates the order to the product
create table ORDERED_ITEM(
	order_id INT NOT NULL,
	crop_id INT NOT NULL,
	item_qty DECIMAL(10,2) UNSIGNED NOT NULL,
	item_freezed_cost DECIMAL(10,2) UNSIGNED NOT NULL,
	FOREIGN KEY (order_id)
    REFERENCES ORDERS(order_id)
    ON DELETE CASCADE,
	FOREIGN KEY (crop_id)
    REFERENCES CROP(crop_id)
    ON DELETE CASCADE
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
	issue_timestamp TIMESTAMP DEFAULT NOW(),
	view_status BOOLEAN DEFAULT 0,
	view_timestamp TIMESTAMP
);

create table COMPLAINT(
	complaint_id INT AUTO_INCREMENT,
	order_id INT NOT NULL,
	type VARCHAR(200),
	status TINYINT DEFAULT 0, -- 0: OPEN, 1: CLOSED, 2: REOPEN 
	reg_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
	resolve_timestamp TIMESTAMP
);

create table PROOF(
	proof_id INT AUTO_INCREMENT,
	complaint_id INT,
	type TINYINT, -- 0: IMAGE, 1:PDF, 3:OTHER
	resource_url VARCHAR(100),
	description VARCHAR(500)
);




-- crop type table

('Potato','VEGETABLE'),
('Tomato','VEGETABLE'),
('Onion','VEGETABLE'),
('Lady Finger','VEGETABLE'),
('Apple','FRUITS'),
('Banana','FRUITS'),
('Mango','FRUITS'),
('Orange','FRUITS'),
('Rice','GRAINS'),
('Wheat','GRAINS'),
('Masoor Dal','GRAINS')
('Maize','GRAINS')
