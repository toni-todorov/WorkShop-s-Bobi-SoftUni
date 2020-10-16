const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { getCubeById } = require('./cube-service')


const generateToken = data => {
    const token = jwt.sign(data, config.privateKey)
    return token
}

const saveUser = async (req, res) => {

    //hashing
    let { username, password } = req.body
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    try {

        const user = new User({ username, password: hashedPassword })
        const userObject = await user.save()

        const token = generateToken({
            userID: userObject._id,
            username: userObject.username
        })
        res.cookie('aid', token)

        return token
        
    } catch (err) {
        return {
            error: true,
            message: err
        }
    }

}

const verifyUser = async (req, res) => {

    let { username, password } = req.body
    try {

        //get User by username
        const user = await User.findOne({ username })
        if (!user) {
            return {
                error: true,
                message: 'There is no such user'
            }
        }
        const status = await bcrypt.compare(password, user.password)
        if (status) {
            const token = generateToken({
                userID: user._id,
                username: user.username
            })
            res.cookie('aid', token)
        }
        return { error: !status }
    } catch (err) {
        return {
            error: true,
            message: 'The user is not verified'
        }
    }
}

const checkAuthentication = (req, res, next) => {
    const token = req.cookies['aid']
    if (!token) {
        return res.status(302).redirect('/')
    }

    try {
        jwt.verify(token, config.privateKey)
        next()
    } catch (e) {
        return res.status(302).redirect('/')
    }
}

const guestAccess = (req, res, next) => {
    const token = req.cookies['aid']
    if (token) {
        return res.status(302).redirect('/')
    }
    next()
}

const isLogin = (req, res, next) => {
    const token = req.cookies['aid']
    try {
        const payload = jwt.verify(token, config.privateKey)
        res.locals.isLogin = true
        res.locals.userID = payload.userID
    } catch (e) {
        res.locals.isLogin = false
    }
    next()

}

const verifyCreator = async (req, res, next) => {
    try {
        const cube = await getCubeById(req.params.id)
        if (res.locals.userID == cube.creatorId) {
            return next()
        }

        return res.redirect(`/details/${req.params.id}`)
    } catch (e) {
        return res.redirect(`/details/${req.params.id}`)
    }
}



module.exports = {
    saveUser,
    verifyUser,
    checkAuthentication,
    guestAccess,
    isLogin,
    verifyCreator
}