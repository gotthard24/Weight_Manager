const knex = require('knex')
require('dotenv').config()

const {CONNECTIONSTRING} = process.env

const dbf = knex({
    client:'pg',
    connection:{
        connectionString:CONNECTIONSTRING
    }
})

module.exports = dbf