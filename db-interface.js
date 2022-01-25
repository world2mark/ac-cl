'use strict';


const { Pool } = require('pg');


module.exports = class {


    SecurityToken;
    // MZMZ: Bypass
    CRTFileData;
    ConnectionString;
    ClientConn;


    constructor() {
        this.SecurityToken = null;
    };

    SetCRT(CRTFileData) {
        this.CRTFileData = CRTFileData;
    };


    async ConnectUsingCS(ConnectionString) {
        const config = {
            connectionString: ConnectionString,
            ssl: {
                rejectUnauthorized: false,
                ca: this.CRTFileData
            }
        };

        // MZMZ: Bypass
        if (!config.connectionString) {
            //          config.connectionString = this.ConnectionString;
        };

        const pool = new Pool(config);

        // Connect to database
        this.ClientConn = await pool.connect();

        this.ClientConn.on('error', err => {
            this.ClientConn = null;
            console.log(err);
        });

        this.SecurityToken = `s-${Date.now()}-t${Math.random()}`;
    };


    get SecurityToken() {
        return this.SecurityToken;
    };


    RunSQL(SecurityToken, SQL) {
        return new Promise((resolve, reject) => {
            if (!this.ClientConn) {
                reject(new Error('Please reconnect'));
            };
            if (this.SecurityToken !== SecurityToken) {
                reject(new Error('Please Reauthenticate'));
            };
            this.ClientConn.query(SQL, (err, SQLResult) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(SQLResult);
                };
            });
        });
    };
};