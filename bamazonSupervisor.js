//author: George Rincon
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

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

        for (let name of realDepts) {
            insertIntoDepts(name);

        }

        getSales();


    });

}



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



const getSales = () => {
    let productSales = {};
    connection.query('SELECT * FROM products', function (err, results) {
        for (let i = 0; i < results.length; i++) {
            if (!productSales[results[i].dept_name]) {
                productSales[results[i].dept_name] = results[i].product_sales;
            } else {
                productSales[results[i].dept_name] += results[i].product_sales;
            }
        }

        //console.log(productSales);

        for (let sales in productSales) {
            updateTotalSales(productSales[sales], sales);

        }

        getTotalProfits();
    })

}

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

const timeoutStart = (func, time) => {
    setTimeout(function () {
        func();
    }, time)
}

