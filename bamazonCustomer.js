const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '---',
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
                console.log(`Done!\n Thank you for your purchase for ${answer.units} units of ${chosenItem.product_name}.`)
            } else {
                console.log('Sorry. There are not enough units your purchase. \n Please try again later.');
            }

        })
    });

}




