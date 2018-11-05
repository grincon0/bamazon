CREATE DATABASE bamazon_db;
USE bamazon_db;
CREATE TABLE products(
	item_id INT(100) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
	VALUES('NIKE-Air', 'Shoes', 99.99, 10),
			('Nike Golf-Tee', 'Clothing' , 75.00, 20),
            ('Nintendo Switch', 'Gaming', 259.99, 5),
            ('Kuregg', 'Appliances', 69.99, 25),
            ('Samsung Smart-TV', 'Electronics', 499.99, 10),
            ('Gameboy Color', 'Electronics', 99.99, 35),
            ('Alienware Gaming Desktop', 'Electronics', 1685.99, 5),
            ('Golf Drivers','Outdoor Sports', 199.99, 20),
            ('Ultra-Soft Kleanex', 'Tolietries', 6.99, 400),
            ('Hunting Sling-shot', 'Outdoor Sports', 29.99, 200);
            

SELECT * FROM products;