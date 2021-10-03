-- Khởi tạo múi giờ --
SET timezone = 'Asia/Ho_Chi_Minh';

-- Tạo bảng hãng -- 

CREATE TABLE brand (
	id_brand serial PRIMARY KEY,
	name varchar(30) UNIQUE
);

INSERT INTO brand (name)
VALUES
('Apple'),
('Asus'),
('Acer'),
('Dell'),
('Lenovo'),
('MSI'),
('Surface'),
('huawei');


-- Tạo bảng hình ảnh  --

CREATE TABLE image (
	id_image serial PRIMARY KEY,
	path text
);

INSERT INTO image (path)
VALUES
('/public');

-- Tạo bảng sản phẩm --

CREATE TABLE product (
	id_product serial PRIMARY KEY,
	id_brand serial NOT NULL,
	id_image serial ,
	name text,
	information text,
	released_year smallint,
	warranty smallint,
	price int,
	current_price int,
	note text,
	status smallint default 1,
	--status:
		-- 0: het hang
		-- 1: co san
		-- 2: hang uu tien
		-- 3: khuyen mai

	FOREIGN KEY (id_brand) REFERENCES brand(id_brand),
	FOREIGN KEY (id_image) REFERENCES image(id_image)
);

INSERT INTO product (id_brand, name, price, id_image)
VALUES
(3, 'Aspire 7 Gaming A71541G R150', 20490000, 1),
(4, 'Gaming G3 15 i7 10750H', 31490000, 1),
(2, 'TUF Gaming FX506FH i5 10300H', 21490000, 1),
(5, 'Ideapad Gaming 315IMH05 i7 10750H', 24990000, 1),
(6, 'Gaming GF65 10UE i7 10750H', 31990000, 1),
(3, 'Aspire 7 Gaming A71575G 52S5 i5 9300H', 20990000, 1),
(1, 'MacBook Pro M1 2020', 37990000, 1);

-- Tạo bảng tài khoản --

CREATE TABLE account(
	id_account serial PRIMARY KEY,
	email text UNIQUE,
	password text NOT NULL,
	name text,
	phone varchar(15),
	address text,
	sex smallint default 1,
	-- sex:
		-- 1: nam
		-- 0: nu
	position smallint default 0,
	-- position 
		-- 0: khach hang
		-- 1: nguoi nhap hang
		-- 2: nguoi quan ly
	status smallint default 1
	-- status
		-- 0: bi khoa
		-- 1: binh thuong
);

INSERT INTO account (email, password, name)
VALUES
('test1@gmail.com', '123', 'beerus1'),
('test2@gmail.com', '123', 'beerus2'),
('test3@gmail.com', '123', 'beerus3'),
('test4@gmail.com', '123', 'beerus4');

-- Tạo bảng hóa đơn --

CREATE TABLE bill (
	id_bill serial PRIMARY KEY,
	id_account serial,
	date_time timestamp without time zone default CURRENT_TIMESTAMP NOT NULL,
	address text,
	total_money int default 0,
	status smallint default 1,
	-- status
		-- 0: huy hang
		-- 1: nhan don
		-- 2: dang giao
		-- 3: da giao
	FOREIGN KEY (id_account) REFERENCES account(id_account)
);


-- Tạo bảng sản phẩm trong hóa đơn --

CREATE TABLE bill_item (
	id_bill serial NOT NULL,
	id_product serial NOT NULL,
	quantity smallint NOT NULL,
	price int NOT NULL,
	warranty smallint,

	FOREIGN KEY (id_bill) REFERENCES bill(id_bill),
	FOREIGN KEY (id_product) REFERENCES product(id_product)
);


-- Tạo bảng phản hồi --

CREATE TABLE feedback (
	id_feedback serial PRIMARY KEY,
	id_account serial NOT NULL,
	subject text,
	content text,
	date_time timestamp without time zone default CURRENT_TIMESTAMP NOT NULL,
	status smallint default 0,
	-- status
		-- 0: chua doc
		-- 1: doc roi
	FOREIGN KEY (id_account) REFERENCES account(id_account)
);


-- Tạo bảng giỏ hàng --

CREATE TABLE cart (
	id_cart serial PRIMARY KEY,
	id_account serial NOT NULL, 
	id_product serial NOT NULL,
	quantity smallint,

	FOREIGN KEY (id_account) REFERENCES account(id_account),
	FOREIGN KEY (id_product) REFERENCES product(id_product)
);

-- Tạo bảng tồn kho --

CREATE TABLE inventory (
	id_product serial UNIQUE,
	amount int default 0,
	sold int default 0,

	FOREIGN KEY (id_product) REFERENCES product(id_product)
);


-- Tạo bảng nhập hàng --

CREATE TABLE import (
	id_import serial PRIMARY KEY,
	id_account serial NOT NULL,
	id_product serial NOT NULL,
	quantity int,
	date_time timestamp without time zone default CURRENT_TIMESTAMP NOT NULL,

	FOREIGN KEY (id_account) REFERENCES account(id_account),
	FOREIGN KEY (id_product) REFERENCES product(id_product)
);

-- Tạo bảng xác thực -- 

CREATE TABLE verification(
	id_verification serial PRIMARY KEY,
	id_account serial NOT NULL,
	code text,
	date_time timestamp without time zone default CURRENT_TIMESTAMP NOT NULL,

	FOREIGN KEY (id_account) REFERENCES account(id_account)
);