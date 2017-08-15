const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', (req, res) => {
    User.findOne({username: req.body.username})
        .then(user => {
            if (user) {
                user.comparePassword(req.body.password).then(value => {
                    if (value) {
                        res.send({
                            username: user.username,
                            email: user.email
                        });
                    } else {
                        res.status(401);
                        res.send('Invalid username or password.');
                    }
                })
            } else {
                res.status(404);
                res.send('User does not exist.');
            }
        })
        .catch(() => {
            res.status(500);
            res.end('Internal Server Error.');
        })
});

router.post('/register', (req, res) => {
    User.findOne({username: req.body.username})
        .then(user => {
            if (!user) {
                User.create({
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email
                }).then(user => {
                    res.send(user);
                }).catch(() => {
                    res.status(500);
                    res.end('Internal Server Error.');
                })
            } else {
                res.status(500);
                res.end('User already exists.');
            }
        })
        .catch(() => {
            res.status(500);
            res.end('Internal Server Error.');
        })
});

module.exports = router;
