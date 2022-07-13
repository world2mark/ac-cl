'use strict';



exports.Action = '/basic_ops';



let ClientJS;



const CRDB = require('../../CRDB');



exports.HandleRequest = (req, res) => {
    const resourceID = req.MyURLQuery.searchParams.get('id');
    switch (resourceID) {
        case 'client.js': {
            res.setHeader('content-type', 'text/javascript');
            return res.end(ClientJS);
        };
        case 'RunSQL': {
            if (!req.MyGlobals.MyConns) {
                throw new Error('Please connect first');
            };
            return CRDB.RunSQL(req.MyGlobals.MyConns[0], req.MyFields.get('SQLStmt')).then(sqlResults => {
                res.end(JSON.stringify(sqlResults));
            }).catch(err => {
                res.end(JSON.stringify({
                    Error: true,
                    Message: err.message,
                    Stack: err.stack
                }));
            });
        };
    };

    res.end();
};



let MyEJSTemplate;



exports.Reset = () => {
    const PATH = require('path');
    const FS = require('fs');

    ClientJS = FS.readFileSync(PATH.join(__dirname, 'client.js'), 'utf8');

    const EJSString = FS.readFileSync(PATH.join(__dirname, 'slide.ejs'), 'utf8');
    const EJS = require('ejs');
    MyEJSTemplate = EJS.compile(EJSString);
};



exports.CreateEJSOutput = (req, res) => {
    return MyEJSTemplate();
};
