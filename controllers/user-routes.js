const express = require('express')
const { saveUser, verifyUser, guestAccess, checkAuthentication , verifyCreator} = require('../services/user-service')
const { editCube, getCubeById, deleteCube } = require('../services/cube-service')

module.exports = (app) => {

    app.get('/login', guestAccess, (req, res) => {
        res.status(200).render('loginPage')
    })

    app.get('/signup', guestAccess, (req, res) => {
        res.status(200).render('registerPage')
    })

    app.get('/edit/:id', checkAuthentication, verifyCreator,  async (req, res) => {
        const id = req.params.id
        const currentCube = await getCubeById(id)
        res.status(200).render('editCubePage', { id, currentCube })
    })

    app.get('/delete/:id', checkAuthentication, verifyCreator, async (req, res) => {
        const id = req.params.id
        const currentCube = await getCubeById(id)
        res.status(200).render('deleteCubePage' , { id , currentCube})
    })

    app.post('/signup', guestAccess, async (req, res) => {
        const { password } = req.body

        if (!password || password.length < 8 || !password.match(/^[A-Za-z0-9]+$/)){
            return res.render('registerPage' , {
                error : "Username or password is not valid"
            })
        } 
        const { error } = await saveUser(req, res)

        if (error) {
            return res.render('registerPage' , {
                error : "Username or password is not valid"
            })
        }

        res.redirect('/')
    })

    app.post('/login', guestAccess, async (req, res) => {
        const { error } = await verifyUser(req, res)

        if (error) {
            return res.render('loginPage' , {
                error : "Username or password is not correct"
            })
        }
        res.redirect('/')
    })

    app.get('/logout', (req, res) => {
        res.clearCookie('aid')
        res.status(302).redirect('/')
    })

    app.post('/edit/:id', verifyCreator, async (req, res) => {
        const cubes = { name, description, imageUrl, difficultyLevel } = req.body
        await editCube(req.params.id, cubes)
        res.redirect(`/details/${req.params.id}`)
    })

    app.post('/delete/:id' , verifyCreator, async (req , res) => {
        await deleteCube(req.params.id)
        res.redirect('/')
    })
}