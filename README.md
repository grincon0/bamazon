# bamazon

This applications is an Amazon-esque storefront for customers, a inventory management application for Managers, and a data analytics platform for performing calculations such as determining overhead costs and total revenue and profits per department for Supervisors.

All the data the applications needs to operate is on a MySQL.

Make sure you create a database called **bamazon_db** before running the application.

You can run the SQL querys provided by **schema.sql** within the application.

To begin run the bamazon node file you want to take a look at.

Let's start with running **bamazonCustomer.js**

`node bamazonCustomer.js`

You should see the following interface:

![bamazonCustomer Order Example 1](/instruc/bamazonC1.jpg)

Now select an item you want to purchase.

Type in the number of units you want to purchase.

If there are enough units of the products, then the order will go through!

![bamazonCustomer Order Example 2](/instruc/bamazonC3.png)



The application is really intuitive and easy to use.

To view the Mananger or Supervisor versions of the application, simply run:

`node bamazonManager.js`

or

`node bamazonSupervisor.js`



# Tools

* Node
* MySQL
* Inquirer
* ECMAScript 6








