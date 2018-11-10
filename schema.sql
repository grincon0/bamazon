DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;


CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    dept_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    product_sales INT DEFAULT 0,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments(
	department_id INT(100) NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs INT NOT NULL,
    total_sales DECIMAL(10.2),
    PRIMARY KEY (department_id)
);

--add seeds for products table
INSERT INTO products(product_name, dept_name, price, stock_quantity, product_sales)
	VALUES('NIKE-Air', 'Shoes', 99.99, 10, 0),
			('Nike Golf-Tee', 'Clothing' , 75.00, 20, 0),
            ('Nintendo Switch', 'Gaming', 259.99, 5, 0),
            ('Kuregg', 'Appliances', 69.99, 25, 0),
            ('Smart-TV', 'Electronics', 499.99, 10, 0),
            ('Gameboy Color', 'Electronics', 99.99, 35, 0),
            ('Gaming Desktop', 'Electronics', 1685.99, 5, 0),
            ('Golf Drivers','Outdoor Sports', 199.99, 20, 0),
            ('Soft Kleanex', 'Tolietries', 6.99, 400, 12),
            ('Sling-shot', 'Outdoor Sports', 29.99, 200, 0);
            
            
SELECT * FROM products;