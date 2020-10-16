const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const { getCubes, getCubeById, searchCubes, } = require('../services/cube-service')
const Cube = require('../models/cube')
const jwt = require('jsonwebtoken')
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

    app.get('/create', checkAuthentication, (req, res) => {
        res.status(200).render('create')
    })

    app.get('/details/:id', async (req, res) => {
        let cube = await getCubeById(req.params.id, true)
        const isCreator = res.locals.userID == cube.creatorId
        let accessories = cube.accessories.length === 0 ? false : cube.accessories
        res.status(200).render('updatedDetailsPage', { cube, accessories, isCreator })
    })

    app.post('/create', checkAuthentication, async (req, res) => {
        let { name, description, imageUrl, difficultyLevel } = req.body;

        const token = req.cookies['aid']
        const decodedObject = jwt.verify(token, config.privateKey)

        let cube = new Cube({
            name: name.trim(),
            description: description.trim(),
            imageUrl,
            difficultyLevel,
            creatorId: decodedObject.userID
        });

        try {
            await cube.save()
            return res.redirect('/')
        } catch (err) {
            return res.render('create' , { error: 'Can not create a cube , please try again'})
        }
    })
}