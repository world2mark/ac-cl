'use strict';



const PATH = require('path');
const FS = require('fs');



let FavIcon;
let CRDBLogo;



const MyServices = {
    '/favicon.ico': {
        Reset: () => {
            FavIcon = FS.readFileSync(PATH.join(__dirname, 'Images', 'favicon.ico'));
        },
        HandleRequest: (req, res) => res.end(FavIcon)
    },
    '/Images': {
        Reset: () => {
            CRDBLogo = FS.readFileSync(PATH.join(__dirname, 'Images', 'cl01.png'));
        },
        HandleRequest: (req, res) => res.end(CRDBLogo)
    },
    '/Reset': {
        Reset: () => { },
        HandleRequest: async (req, res) => {
            await ResetApp();
            RedirectHome(req, res);
        }
    }
};



const MainPageService = require('./Services/MainPage');
MyServices[MainPageService.Action] = MainPageService;

const ConnectCRDBService = require('./Services/ConnectCRDB');
MainPageService.AddSlide(ConnectCRDBService);
MyServices[ConnectCRDBService.Action] = ConnectCRDBService;

const BasicOpsService = require('./Services/BasicOps');
MainPageService.AddSlide(BasicOpsService);
MyServices[BasicOpsService.Action] = BasicOpsService;


const WritesAreBlockingService = require('./Services/WritesAreBlocking');
MainPageService.AddSlide(WritesAreBlockingService);
MyServices[WritesAreBlockingService.Action] = WritesAreBlockingService;


function RedirectHome(req, res) {
    res.writeHead(302, {
        'content-length': 0,
        'location': '/'
    });
    res.end();
};



async function ResetApp() {
    const ServiceInterfaces = Object.values(MyServices);
    for (const MyService of ServiceInterfaces) {
        await MyService.Reset();
    };
};



function ExtractPostValues(req) {
    return new Promise((resolve, reject) => {
        let body = [];

        req.on('data', data => {
            body.push(data);

            if (body.length > 1e6) {
                // Too much POST data, kill the connection!
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                req.connection.destroy();
                reject();
            };
        });

        req.on('end', () => {
            const fields = new URLSearchParams(body.join());
            resolve(fields);
        });
    });
};



const MyGlobals = {};



const HTTP = require('http');
const TheServer = HTTP.createServer(async (req, res) => {
    req.MyURLQuery = new URL(req.url, 'http://localhost:3002');

    req.MyGlobals = MyGlobals;

    if (req.method === 'POST') {
        req.MyFields = await ExtractPostValues(req);
    };

    const myHandler = MyServices[req.MyURLQuery.pathname];
    if (myHandler) {
        try {
            await myHandler.HandleRequest(req, res);
        } catch (err) {
            res.end(JSON.stringify({
                Error: true,
                Message: err.message,
                Stack: err.stack
            }));
        };
    } else {
        RedirectHome(req, res);
    };
});



setTimeout(async () => {
    await ResetApp();

    await new Promise(resolve => {
        TheServer.listen(3002, () => {
            resolve();
        });
    });

    console.log('Server running');

}, 250);
