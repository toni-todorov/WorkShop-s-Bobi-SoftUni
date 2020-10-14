const express = require('express')
const { saveUser , verifyUser ,guestAccess , checkAuthentication} = require('../services/user-service')


module.exports = (app) => {

app.get('/login' , guestAccess , (req , res) => {
    res.status(200).render('loginPage')
})

app.get('/signup' , guestAccess, (req , res) => {
    res.status(200).render('registerPage')
})

app.get('/edit' ,checkAuthentication, (req , res) => {
    res.status(200).render('editCubePage')
})

app.get('/delete' ,checkAuthentication, (req , res) => {
    res.status(200).render('deleteCubePage')
})

app.post('/signup' ,guestAccess , async (req ,res) => {
    
    const status = await saveUser(req , res)

    if (status){
       return res.redirect('/')
    }

    res.redirect('/')
})

app.post('/login' , guestAccess, async (req , res) => {
    const statusLogin = await verifyUser(req , res)

    if(statusLogin){
       return res.redirect('/')
    }
    res.redirect('/')
})

app.get('/logout' , ( req ,res ) =>{
    res.clearCookie('aid')
    res.status(302).redirect('/')
})
}