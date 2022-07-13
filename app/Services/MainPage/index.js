'use strict';



exports.Action = '/';



const Slides = [];



exports.AddSlide = slidePage => {
    Slides.push(slidePage);
};



let MainPageEJSTemplate;
let ClientJS;
let MZSpinnerCSS;
let MZSpinnerJS;



exports.HandleRequest = async (req, res) => {
    const resourceID = req.MyURLQuery.searchParams.get('id');
    switch (resourceID) {
        case 'client.js': {
            res.setHeader('content-type', 'text/javascript');
            return res.end(ClientJS);
        };
        case 'mz_spinner.css': {
            res.setHeader('content-type', 'text/css');
            return res.end(MZSpinnerCSS);
        };
        case 'mz_spinner.js': {
            res.setHeader('content-type', 'text/javascript');
            return res.end(MZSpinnerJS);
        };
    };

    return res.end(MainPageEJSTemplate({
        Slides: Slides.map(mySlide => mySlide.CreateEJSOutput())
    }));
};



exports.Reset = () => {
    const PATH = require('path');
    const FS = require('fs');

    ClientJS = FS.readFileSync(PATH.join(__dirname, 'client.js'));
    MZSpinnerCSS = FS.readFileSync(PATH.join(__dirname, 'MZSpinner', 'mz_spinner.css'));
    MZSpinnerJS = FS.readFileSync(PATH.join(__dirname, 'MZSpinner', 'mz_spinner.js'));

    const EJSString = FS.readFileSync(PATH.join(__dirname, 'page.ejs'), 'utf8');
    const EJS = require('ejs');
    MainPageEJSTemplate = EJS.compile(EJSString);
};
