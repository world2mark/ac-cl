'use strict';



exports.GetPostData = req => new Promise((resolve, reject) => {
    const Formidable = require('formidable');
    const myForm = new Formidable.IncomingForm();
    myForm.parse(req, (err, fields, files) => {
        if (err) {
            reject(err);
        } else {
            resolve(fields);
        };
    });
});