'use strict';



exports.Action = '/connect_crdb';



let ClientJS;



const CRDB = require('../../CRDB');



async function CreatePGPool(req, res) {
    const ConnStr = req.MyFields.get('ConnectionString');
    const CRTData = req.MyFields.get('CRTData');

    req.MyGlobals.MyPool = await CRDB.CreatePool(ConnStr, CRTData);

    res.end(JSON.stringify({
        Success: true
    }));
};



exports.HandleRequest = async (req, res) => {
    const resourceID = req.MyURLQuery.searchParams.get('id');
    switch (resourceID) {
        case 'client.js': {
            res.setHeader('content-type', 'text/javascript');
            return res.end(ClientJS);
        };
        case 'connect': return await CreatePGPool(req, res);
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
    return MyEJSTemplate({
        ConnectionString: 'postgresql://mark:zlamal@crlMBP-C02FL0LJMD6TMzE1.local:26257/defaultdb'
    });
};
