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
	vendor_id INT AUTO_INCREMENT PRIMARY KEY,
	-- device fcm code ---
	contact BIGINT UNIQUE NOT NULL,
	type VARCHAR(25),
	name VARCHAR(25), 
	state_id  TINYINT,
	city_id SMALLINT,
	pin_code INT,
	address VARCHAR(1000),
	profile_picture VARCHAR(1000),
	reg_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
	device_fcm_token VARCHAR(500),
	orders_recieved INT DEFAULT 0,
	orders_cancelled_by_user INT DEFAULT 0,
	orders_cancelled_by_vendor INT DEFAULT 0,
	order_domino_number TINYINT DEFAULT 0, 
	defaulter_status VARCHAR(30) DEFAULT "NO_ISSUE",
	defaulter_timestamp TIMESTAMP DEFAULT "1999-01-01 00:00:00",
	defaulter_period TIMESTAMP DEFAULT "1999-01-01 00:00:00",
    FOREIGN KEY (state_id)
    REFERENCES STATE(state_id)
    ON DELETE CASCADE,
    FOREIGN KEY (city_id)
    REFERENCES CITY(city_id)
    ON DELETE CASCADE

);


create table USER(
	user_id INT PRIMARY KEY AUTO_INCREMENT,
    device_fcm_token VARCHAR(500),
	contact BIGINT UNIQUE NOT NULL,
	name VARCHAR(25), 
	state_id  TINYINT,
	city_id SMALLINT,
	pin_code INT,
	reg_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
	address VARCHAR(1000),
	profile_picture VARCHAR(1000),	
	orders_issued INT DEFAULT 0,
	orders_cancelled_by_user INT DEFAULT 0,
	order_domino_number TINYINT DEFAULT 0,
	defaulter_status VARCHAR(30) DEFAULT "NO_ISSUE",
	defaulter_timestamp TIMESTAMP DEFAULT "1999-01-01 00:00:00",
	defaulter_period TIMESTAMP DEFAULT "1999-01-01 00:00:00",
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