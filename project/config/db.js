const knex = require("knex");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT, 
        PGHOST2, PGDATABASE2, PGUSER2, PGPASSWORD2, PGPORT2} = process.env;

module.exports = {
  db: knex({
    client: "pg",
    connection: {
        host: PGHOST,
        port: PGPORT,
        user: PGUSER,
        database: PGDATABASE,
        password: PGPASSWORD,
      ssl: { rejectUnauthorized: false },
    },
  }),
  food: knex({
    client: "pg",
    connection: {
        host: PGHOST2,
        port: PGPORT2,
        user: PGUSER2,
        database: PGDATABASE2,
        password: PGPASSWORD2,
      ssl: { rejectUnauthorized: false },
    },
  }),
};
