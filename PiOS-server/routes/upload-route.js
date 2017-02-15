"use strict";

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const boom = require('boom');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
const jwt = require('jsonwebtoken');
const privateKey = 'my_awesome_cookie_signing_key';
var http = require('http');


const authorize = function(req, res, next) {

    const token = req.cookies.token;
    jwt.verify(token, privateKey, (err, decoded) => {
        if (err) {
            next(boom.create(400, 'Failed to decode token'));
        }
        req.token = decoded;
        next();
    });
};

router.get('/', function(req, res, next) {

    knex('uploads')
        .join('users', 'users.id', '=', 'uploads.user_id')
        .select('uploads.name', 'uploads.category', 'users.username', 'uploads.created_at', 'uploads.file_name')
        .orderBy('users.username')
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            next(boom.create(500, 'Database query failed'));
        });
});

router.post('/', function(req, res, next) {

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '../public/uploads');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        ////// duplicate file name handling attempt 3
        // create a unique string of characters plus the original file's name
        // this allows a file to be uploaded multiple times, but not overwrite existing files in the filesystem
        // for example '.../upload_39fe0713af8bbbbcc7ceceeeac031a69' + "_" 'G36_Notes.txt'
        var uniqueFileName = file.path + "_" + file.name;
        console.log(file);
        // const userId = function () {
        //   // knex('users').where({
        //   //   first_name: 'Test',
        //   //   last_name:  'User'
        //   // }).select('id')
        //   // console.log(req.token);
        //  knex('users')
        //   .where({email: req.token})
        //   .select('id')
        //   .first()
        //   .then((result) => {
        //     console.log(result);
        //   });
        // };
        // console.log(userId());

        fs.rename(file.path, uniqueFileName, function() {
            // get uploader's user id
            knex('users')
                .where({
                    email: 'dinkydinky@gmail.com'
                })
                .select('id')
                .first()
                .then((user) => {
                    knex('uploads')
                        .insert({
                            name: file.name,
                            file_name: uniqueFileName.split('uploads/')[1],
                            // TODO: change category to the download_path, category is temporarily being used as the download path for client's 'file download' links
                            category: 'movie',
                            user_id: user.id
                        }, '*')
                        .then((result) => {
                            res.end('success\n'+result);
                        })
                        .catch((err) => {
                            next(boom.create(500, 'Failed to upload file'));
                        });
                });
        });
    });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

const authorizeAdmin = function(req, res, next) {
    const token = req.cookies.token;
    jwt.verify(token, privateKey, (err, decoded) => {
        if (err) {
            next(boom.create(400, 'Failed to decode token'));
        }
        req.token = decoded;
        if(req.token === 'dinkydinky@gmail.com'){
     next();
   } else {
     next(boom.create(401, 'Unauthorized User'));
   }
    });
};

router.delete('/', authorizeAdmin, (req, res, next) => {
    fs.unlink(__dirname + "/../public/" + req.body.fileName, function() {
        knex('uploads')
            .where({
                category: req.body.fileName
            })
            .first()
            .then((result) => {
                if (result.id) {
                    return knex('uploads')
                        .del()
                        .where('id', result.id)
                        .then((result) => {
                            res.end('success\n' + result);
                        })
                        .catch((err) => {
                            next(boom.create(500, 'Failed to delete file'));
                        });
                }
            });
        });
   });
module.exports = router;
