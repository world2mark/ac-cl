'use strict';



const { Pool } = require('pg');



exports.CreatePool = (CS, CA_CRT) => {
    const config = {
        connectionString: CS,
        max: 10, // MZMZ: 2022-10-03 (connection pooling issues... https://node-postgres.com/api/pool)
        idleTimeoutMillis: 30000 // 30 seconds
    };

    if (CA_CRT) {
        config.ssl = {
            rejectUnauthorized: false,
            ca: CA_CRT
        };
    };

    return new Pool(config);
};



exports.RunSQL = async (pgPool, SQL) => {
//    const clientConn = await pgPool.connect();
    try {
        return pgPool.query(SQL);
    } finally {
//        clientConn.release();
    };
};
