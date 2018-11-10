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
    startMenu();
});


const startMenu = () => {
    console.log('\n******** Bamazon Inventory Manager Interface **********\n');
    inquirer.prompt({
        name: 'choice',
        type: 'list',
        message:
            'Select',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']

    }).then(function (answer) {
        switch (answer.choice) {
            case 'View Products for Sale':
                viewProducts();
                timeoutStart(startMenu, 2000);

                break;
            case 'View Low Inventory':
                viewLowInventory();
                timeoutStart(startMenu, 2000);
                break;
            case 'Add to Inventory':
                addToInventory();
                break;
            case 'Add New Product':
                addNewProduct();
                break;
            default:
                break;
        }


    });
}

const viewProducts = () => {
    connection.query('SELECT * FROM products', function (err, results) {
        console.table(results);
    });

}

const viewLowInventory = () => {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (err, results) {
        if (!results) {
            console.log('No items are currently low in stock');
        } else {

            console.table(results);

        }

    });
}

const addToInventory = () => {
    connection.query('SELECT * FROM products', function (err, results) {
        inquirer.prompt([{
            name: 'choice',
            type: 'list',
            message:
                'Which of the following inventory do you want to add stock?',
            choices: function () {
                let products = [];
                for (let i = 0; i < results.length; i++) {
                    products.push(results[i].product_name);
                }
                return products;
            },

        }, {
            name: 'units',
            type: 'input',
            message: 'How many more units do you want to add?'


        }]).then(function (answer) {
            let chosenItem;
            for (let i = 0; i < results.length; i++) {
                if (answer.choice === results[i].product_name) {
                    chosenItem = results[i];
                }
            }
            let unitsToAdd = chosenItem.stock_quantity + parseInt(answer.units);


            connection.query(
                'UPDATE products SET ? WHERE ?',
                [
                    {
                        stock_quantity: unitsToAdd

                    }, {
                        item_id: chosenItem.item_id
                    }
                ],
                function (error) {
                    if (error) {
                        throw err;
                    } else {
                        console.log(`Your transaction has been processed\n${parseInt(answer.units)} ${chosenItem.product_name}s have been added`);
                        timeoutStart(startMenu, 2000);

                    }
                }

            );

        });

    });

}

const addNewProduct = () => {
    inquirer.prompt(
        [
            {
                name: 'item_name',
                type: 'input',
                message: "What is the name of the product you are adding to your inventory?"
            },
            {
                name: 'dept_name',
                type: 'input',
                message: 'What department would it product fall under?'
            },
            {
                name: 'price',
                type: 'input',
                message: 'What would its selling price be?',
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: 'stock',
                type: 'input',
                message: 'How much stock do you have of this product?',
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]


    ).then(function (answer) {
        let price = parseInt(answer.price);
        let stock = parseInt(answer.stock);
        connection.query('INSERT INTO products SET ?', {
            product_name: answer.item_name,
            dept_name: answer.dept_name,
            price: price,
            stock_quantity: stock

        }, function (err) {
            if (err) {
                throw err;
            } else {
                console.log(`Your new item has been successfully added to the inventory.`);
                timeoutStart(startMenu, 2000);
            }
        })
    });

}

const timeoutStart = (func, time) => {
    setTimeout(function () {
        func();
    }, time)
}