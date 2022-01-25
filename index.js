'use strict';


const PATH = require('path');
const FS = require('fs');
const MyFiles = {
    EJS: {
        Index: FS.readFileSync(PATH.join(__dirname, 'EJS', 'index.ejs'), 'utf8')
    },
    ClientScript: {
        Client: FS.readFileSync(PATH.join(__dirname, 'ClientScript', 'client.js'), 'utf8')
    },
    Images: {
        cl: FS.readFileSync(PATH.join(__dirname, 'Images', 'cl01.png')),
        check: FS.readFileSync(PATH.join(__dirname, 'Images', 'green-check.png')),
        favicon: FS.readFileSync(PATH.join(__dirname, 'Images', 'favicon.ico'))
    }
};



const DBInterface = require('./db-interface');
let DBClient = new DBInterface;



const HTTP = require('http');
const TheServer = HTTP.createServer(async(req, res) => {
    let URLQuery;
    const reqHostName = req.headers['x-forwarded-host'];
    if (reqHostName) {
        URLQuery = new URL(req.url, `https://${reqHostName}`);
    } else {
        URLQuery = new URL(req.url, 'http://localhost:3002');
    };


    //console.log(URLQuery.origin);
    //URLQuery.searchParams.get('APIKey');

    switch (URLQuery.pathname) {
        case '/':
            {
                const EJS = require('ejs');
                const resultHTML = EJS.render(MyFiles.EJS.Index, {});
                res.end(resultHTML);
                return;
            };
        case '/client.js':
            {
                res.end(MyFiles.ClientScript.Client);
                return;
            };
        case '/favicon.ico':
            {
                res.end(MyFiles.Images['favicon']);
                return;
            };
        case '/Images':
            {
                const ImageID = URLQuery.searchParams.get('id');
                res.end(MyFiles.Images[ImageID]);
                return;
            };
        case '/run':
            {
                try {
                    const Common = require('./common');
                    const dataJSON = await Common.GetPostData(req);
                    switch (dataJSON.Action) {
                        case 'SaveCRT':
                            {
                                DBClient = new DBInterface;
                                DBClient.SetCRT(dataJSON.CRTFile);
                                res.end('{"ok":true}');
                                return;
                            };
                        case 'Connect':
                            {
                                await DBClient.ConnectUsingCS(dataJSON.ConnectionString);
                                res.end(JSON.stringify({
                                    SecurityToken: DBClient.SecurityToken
                                }));
                                return;
                            };
                        case 'RunSQL':
                            {
                                const Results = await DBClient.RunSQL(
                                    dataJSON.SecurityToken,
                                    dataJSON.SQLStmt);
                                res.end(JSON.stringify(Results));
                                return;
                            };
                        case 'RecreateTable':
                            {
                                const dropRes = await DBClient.RunSQL(
                                    dataJSON.SecurityToken,
                                    'DROP TABLE IF EXISTS MZTABLE CASCADE;'
                                );
                                const Results = await DBClient.RunSQL(
                                    dataJSON.SecurityToken,
                                    'CREATE TABLE MZTABLE (MYNAME VARCHAR(32), MYVALUE FLOAT(8));'
                                );
                                res.end(JSON.stringify(Results));
                                return;
                            }
                        case 'Create100':
                            {
                                let lastResult;
                                // Note that we add 2 rows at a time (why 50 instead of 100 in the for loop)
                                for (let count = 0; count < 50; count++) {
                                    const insertSQL = `insert into MZTABLE VALUES ('Hi${Math.random()}', ${Math.random()}), ('Hi${Math.random()}', ${Math.random()})`;
                                    lastResult = await DBClient.RunSQL(
                                        dataJSON.SecurityToken,
                                        insertSQL);
                                };
                                res.end(JSON.stringify(lastResult));
                                return;
                            };
                        case 'RandomQuery':
                            {
                                const queryResult = await DBClient.RunSQL(
                                    dataJSON.SecurityToken,
                                    `SELECT * FROM MZTABLE WHERE MYVALUE > ${Math.random()}`);
                                res.end(JSON.stringify({
                                    rows: queryResult.rows
                                }));
                                return;
                            };
                        default:
                            {
                                throw new Error(`Invalid URL: ${req.url}`)
                            };
                    };
                } catch (err) {
                    res.end(JSON.stringify({
                        Error: err.message
                    }));
                    return;
                };
            };
        case '/Reset':
            {
                DBClient = null;
                res.writeHead(302, {
                    'content-length': 0,
                    'location': '/'
                });

                res.end();
            };
    };

    res.end();
});


setTimeout(() => {
    TheServer.listen(3002, () => {
        console.log('Server running');
    });
}, 1000);