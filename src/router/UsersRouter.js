const express = require('express')
const UsersRouter = express.Router()
const bodyParser = express.json()
const UsersService = require('./UsersService')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const { JWT_SECRET } = require('../config')
const logger = require('../logger.js')
//xss

UsersRouter
    .route('/api/test')
    .get((req,res,next) => {
        res.status(200).send("working")
        next()
    })
    .post(bodyParser, (req,res,next) => {
        const { title } = req.body
        res.status(201).send(title)
        next()
    })

module.exports = UsersRouter