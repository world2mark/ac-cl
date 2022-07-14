'use strict';



const { Pool } = require('pg');


exports.Connect = async (CS, CA_CRT) => {
    const config = {
        connectionString: CS,
    };

    if(CA_CRT) {
        config.ssl = {
            rejectUnauthorized: false,
            ca: CA_CRT
        };
    };

    const pool = new Pool(config);

    const ClientConns = [];

    for(let myPool = 0; myPool < 3; myPool++) {
        const myConn = await pool.connect();
        myConn.on('error', err => {
            console.log(`Error in PG pool (ConnID: {myPool}): ${err.message}`);
        });
        ClientConns.push(myConn);
    };

    return ClientConns;
};


exports.RunSQL = (clientConn, SQL) => {
    return new Promise((resolve, reject) => {
        clientConn.query(SQL, (err, SQLResult) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(SQLResult);
            };
        });
    });
};
