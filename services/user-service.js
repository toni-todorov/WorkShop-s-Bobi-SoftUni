const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const generateToken = data => {
    const token = jwt.sign(data, config.privateKey)
    return token
}

const saveUser = async (req, res) => {

    //hashing
    let { username, password } = req.body
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = new User({ username, password: hashedPassword })
    const userObject = await user.save()

    const token = generateToken({
        userID: userObject._id,
        username: userObject.username
    })
    res.cookie('aid', token)
    return true
}

const verifyUser = async (req, res) => {

    let { username, password } = req.body

    //get User by username
    const user = await User.findOne({ username })


    const status = await bcrypt.compare(password, user.password)
    if (status) {
        const token = generateToken({
            userID: user._id,
            username: user.username
        })
        res.cookie('aid', token)
    }
    return status

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

const isLogin = (req , res , next) => {
    const token = req.cookies['aid']
    try {
        jwt.verify(token, config.privateKey)
        res.locals.isLogin = true
    } catch (e) {
        res.locals.isLogin = false
    }
    next()

}

module.exports = {
    saveUser,
    verifyUser,
    checkAuthentication,
    guestAccess,
    isLogin
}