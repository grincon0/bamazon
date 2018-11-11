//author: George Rincon
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

//config objects that connects the app with the bamazon_db
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon_db'
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

//starts the CLI app by giviving the user two choices to select
//If the user selects 'View Products Sales by Department, the app will start the process of printing total profits of each department
const start = () => {
    console.log('\n******** Bamazon Supervisor Interface **********\n');

    inquirer.prompt({
        name: 'choice',
        type: 'list',
        message:
            'Select',
        choices: ['View Product Sales By Department', 'Create New Department']

    }).then(function (answer) {
        switch (answer.choice) {
            case 'View Product Sales By Department':
                getDeptsFromProducts();
                break;
            case 'Create New Department':
                createNewDept();
                break;
            default:
                break;
        }
    });
}

//Dynamically gets the departments of the products currently in stock, filters out any duplicates dept returned, then ..
//.. inserts those departments into the 'departments' table with overhead costs
const getDeptsFromProducts = () => {
    let depts = [];
    connection.query('SELECT * FROM products', function (err, results) {
        console.log(results);
        for (let i = 0; i < results.length; i++) {
            depts.push(results[i].dept_name);

        }

        let count = {};
        for (let name of depts) {
            if (!count[name]) {
                count[name] = 1;
            } else {
                count[name]++;
            }

        }

        let realDepts = Object.keys(count);
        console.log(realDepts);
        //for every deparment, inset each one into the 'departments table'
        for (let name of realDepts) {
            insertIntoDepts(name);

        }
        //once we finish dynamically inserting all the departments into the table, calculate total sales per dept
        getSales();


    });

}


//inserts each department name and overhaead cost to the 'departments' table
const insertIntoDepts = (name) => {
    let rnd = (Math.floor(Math.random() * 5000) + 1000);
    connection.query('INSERT INTO departments SET ?', {
        department_name: name,
        over_head_costs: rnd,

    }, function (err) {
        if (err) {
            throw err;
        } else {
            console.log(`The ${name} department has been added.`);


        }
    })

}


//get total sales for each dept
const getSales = () => {
    //obj where we will store each dept and their total sales as key-value pairs
    let productSales = {};

    connection.query('SELECT * FROM products', function (err, results) {

        for (let i = 0; i < results.length; i++) {
            //if there is not a property with the name of 'dept_name' in productSales
            if (!productSales[results[i].dept_name]) {
                //create a property with dept_name
                //set its value to that row's product sales
                productSales[results[i].dept_name] = results[i].product_sales;
            } else {
                //increment that property's value with product sales
                productSales[results[i].dept_name] += results[i].product_sales;
            }
        }

        //console.log(productSales);

        //updates total sales column for every department
        for (let sales in productSales) {
            updateTotalSales(productSales[sales], sales);

        }

        getTotalProfits();
    })

}

//Updates total sales column in the departments table
const updateTotalSales = (totalSales, deptName) => {
    connection.query('UPDATE departments SET ? WHERE ?',
        [
            {
                total_sales: totalSales
            }, {
                department_name: deptName

            }

        ],
        function (err, results) {
            if (err) {
                throw err;
            } else {
                console.log(`The ${deptName}'s total sales have been updated.`);


            }

        });

}

//calculates total profits and prints the departments table with the total profits for each department
const getTotalProfits = () => {

    connection.query('SELECT * FROM departments', function (err, results) {
        let totalProfits = [];
        for(let i = 0; i < results.length; i++){
            let profitObj = {};
            profitObj['total_profits'] = (results[i].total_sales - results[i].over_head_costs); 
            totalProfits.push(profitObj);
        }

        console.table(results,totalProfits);
        //console.log(totalProfits);
    })
}

//prompts the user with questions about the department that will be added
const createNewDept = () => {
    inquirer.prompt(
        [

            {
                name: 'dept',
                type: 'input',
                message: 'What is the name of the department you want to create?'
            },

            {
                name: 'costs',
                type: 'input',
                message: 'What are the approximate upkeep costs for this department?',
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]
    ).then(function (answer) {
        let cost = parseInt(answer.costs);
        //inserts departmen and over head costs to the table
        connection.query('INSERT INTO departments SET ?', {

            department_name: answer.dept,
            over_head_costs: cost


        }, function (err) {
            if (err) {
                throw err;
            } else {
                console.log(`Your new department has been successfully created.`);
                timeoutStart(start, 2000);
            }
        })
    });
}

//passes callback function with setTimeout 
const timeoutStart = (func, time) => {
    setTimeout(function () {
        func();
    }, time)
}

