//author: George Rincon
const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon_db'
});

connection.connect(function (err) {
    if (err) throw err;
    startAndBuy();
});

const startAndBuy = () => {
    connection.query('SELECT * FROM products', function (err, results) {
        inquirer.prompt([{
            name: 'choice',
            type: 'list',
            message:
                'Welcome to BAMAZON \n Which of following items do you want to buy?',
            choices: function () {
                let products = [];
                for (let i = 0; i < results.length; i++) {
                    products.push(results[i].product_name);
                }
                return products;
            },
        },
        {
            name: 'units',
            type: 'input',
            message: 'How many units of the product would you want to purchase?'

        }
        ]).then(function (answer) {
            let chosenItem;
            for (let i = 0; i < results.length; i++) {
                if (answer.choice === results[i].product_name) {
                    chosenItem = results[i];
                }
            }

            if (chosenItem.stock_quantity >= parseInt(answer.units)) {

                let unitsBought = parseInt(answer.units);
                let priceOfUnits = (unitsBought * chosenItem.price).toFixed(2);
                

                let stockLeft = parseInt(chosenItem.stock_quantity - unitsBought);

                connection.query(
                    'UPDATE products SET ? WHERE ?',
                    [
                        {
                            product_sales: priceOfUnits,
                            stock_quantity: stockLeft
                        },
                        {
                            item_id: chosenItem.item_id
                        }
                    ],
                    function (error) {
                        if (error) {
                            throw err;

                        } else {
                            console.log(`\nDone!\nThank you for your purchase of ${answer.units} units of ${chosenItem.product_name}.\nYour total cost for this purchase is ${priceOfUnits}\n \n \n`);
                            setTimeout(function () {
                                startAndBuy();
                            }, 1500);
                        }


                    }
                );

            } else {
                console.log('\nSorry. There are not enough units your purchase. \n Please try again later or select a different product to purchase.\n \n \n \n');
                setTimeout(function () {
                    startAndBuy();
                }, 1500);

            }

        })
    });

}




