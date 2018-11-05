const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '---',
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
                viewSalesDept();
            

                break;
            case 'Create New Department':
                viewLowInventory();
                
                break;

            default:
                break;
        }


    });
}


const viewSalesDept = () => {


}

