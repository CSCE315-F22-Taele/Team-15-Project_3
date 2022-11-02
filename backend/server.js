const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv')
const path = require('path')
const { Pool } = require('pg')

dotenv.config({path: './.env'})
const PORT = process.env.PORT || 1111 // this needs to match proxy in front-end package.json

const app = express()
app.use(cors())
app.use(express.static(path.join(__dirname + "/public")))

// start database connection
const connectionParams = {
    connectionString: process.env.URL,
    ssl: {
        rejectUnauthorized: false
    }
}
const pool = new Pool(connectionParams);
pool.connect()

// start listening
app.listen(PORT, () => console.log('Server on PORT: ' + PORT))

app.get('/orders', (req, response) => {})

app.get('/inventory', (req, response) => {
    pool.query(`SELECT * FROM INVENTORY ORDER BY INGREDIENT_ID`, (err, res) => {
        if(err) {
            response.json({err: err})
            return
        }
        response.json({rows: res.rows})
    })
})

app.get('/itemIngredients', (req, response) => {
    pool.query(`SELECT ITEM.NAME AS ITEM, ITEM.ID, ITEM.EXTRA_PRICE, ITEM.CATEGORY, INVENTORY.NAME AS INGREDIENT_NAME, INVENTORY.INGREDIENT_ID, ITEM_INGREDIENTS.AMOUNT FROM ITEM JOIN ITEM_INGREDIENTS ON ITEM.ID = ITEM_INGREDIENTS.ITEM_ID JOIN INVENTORY ON INVENTORY.INGREDIENT_ID = ITEM_INGREDIENTS.INVENTORY_ID`, (err, res) => {
        if(err) {
            response.json({err: err})
            return
        }
        response.json({rows: res.rows})
    })
})

app.get('/salesReport', (req, response) => {
    let queryThing = `SELECT ITEM.NAME, SUM(AMOUNT) AS AMOUNT_SOLD FROM TICKET JOIN ORDERS ON TICKET.ID = ORDERS.TICKET_ID JOIN BRIDGE ON ORDERS.ID = BRIDGE.ORDER_ID JOIN ITEM ON BRIDGE.ITEM_ID = ITEM.ID WHERE TICKET.ORDER_TIME BETWEEN TIMESTAMP '${req.query.start}' AND TIMESTAMP '${req.query.end}' GROUP BY ITEM.NAME ORDER BY SUM(AMOUNT) DESC`
    
    pool.query(queryThing, (err, res) => {
        if(err) {
            response.json({err: err})
            return
        }
        response.json({rows: res.rows})
    })
})