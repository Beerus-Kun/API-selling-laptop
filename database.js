const { Pool } = require("pg");

const pool = new Pool({
    host: 'localhost',
    database: "selllaptop",
    user: "postgres",
    password: "123456",
    port: 5432
});

// const pool = new Pool({
//     connectionString: 'postgres://mfpqqtlmfrhvvp:bd865a3a17dc4480e1b17f85cc2787a76dde4eb603a304cb92703801f3bffcae@ec2-3-219-111-26.compute-1.amazonaws.com:5432/d827st910p3o7b',
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

pool.on('error', (err) => {
    console.log("Error: " + err);
    process.exit(-1);
})

module.exports = pool;