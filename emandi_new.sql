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
    contact BIGINT PRIMARY KEY,
    otp INT NOT NULL,
    reg_timestamp TIMESTAMP DEFAULT NOW()
);

create table OTP_LOGIN(
	subscriber_id INT NOT NULL,
	subscriber_type VARCHAR(20) NOT NULL,
    contact BIGINT PRIMARY KEY,
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



create table CROP(
	crop_id INT AUTO_INCREMENT,
	vendor_id INT,
	qty DECIMAL(10,2) NOT NULL,
	crop_name VARCHAR(200) NOT NULL,
	crop_type_id INT,
	packed_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
	exp_timestamp TIMESTAMP,
	description VARCHAR(200),
	freeze_status TINYINT DEFAULT 0 -- 0: can be edited, 1: cannot be edited
	
);

create table ORDER(
	--- PROFILE ---
	order_id INT AUTO_INCREMENT,
	issue_timestamp TIMESTAMP NOT NULL,
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
