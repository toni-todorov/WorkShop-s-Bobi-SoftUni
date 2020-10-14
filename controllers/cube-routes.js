const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const { getCubes, getCubeById, searchCubes, } = require('../services/cube-service')
const Cube = require('../models/cube')
const jwt  = require('jsonwebtoken')
const { checkAuthentication } = require('../services/user-service')

module.exports = (app) => {
    app.get('/', async (req, res) => {

        const data = await getCubes()
        res.status(200).render('index', { cubes: data })
    })


    app.get('/about', (req, res) => {
        res.status(200).render('about')
    })

    app.get('/search', async (req, res) => {

        const searchResult = await searchCubes(req.query.search, req.query.from, req.query.to)

        res.status(200).render('index', {
            cubes: searchResult,
            search: req.query.search
        });
    })

    app.get('/create', checkAuthentication , (req, res) => {
        res.status(200).render('create')
    })

    app.get('/details/:id', async (req, res) => {
        let cube = await getCubeById(req.params.id, true)
        let accessories = cube.accessories.length === 0 ? false : cube.accessories
        res.status(200).render('updatedDetailsPage', { cube, accessories })
    })

    app.post('/create', checkAuthentication , (req, res) => {
        let { name, description, imageUrl, difficultyLevel } = req.body;

        const token = req.cookies['aid']
        const decodedObject = jwt.verify(token , config.privateKey)

        let cube = new Cube({ name, description, imageUrl, difficultyLevel , creatorId: decodedObject.userID });
        cube.save((err) => {
            if (err) {
                console.log('Error', err)
                res.status(302).redirect('/create')
            }
            res.status(302).redirect('/')
        })
    })
}