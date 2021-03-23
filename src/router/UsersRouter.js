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
    .get(bodyParser, (req,res,next) => {
        res.send("working").status(200)
    })

module.exports = UsersRouter