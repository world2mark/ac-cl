'use strict';



exports.Action = '/writes_are_blocking';



let ClientJS;



const CRDB = require('../../CRDB');



exports.HandleRequest = (req, res) => {
    const resourceID = req.MyURLQuery.searchParams.get('id');
    switch (resourceID) {
        case 'client.js': {
            res.setHeader('content-type', 'text/javascript');
            return res.end(ClientJS);
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
