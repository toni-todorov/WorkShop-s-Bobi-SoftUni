// TODO: Require Controllers...

const { getCubes, getCubeById, searchCubes, getAccessories, updateCube } = require('../services/cube-service')
const Cube = require('../models/cube')
const Accessory = require('../models/accessories')


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

    app.get('/create', (req, res) => {
        res.status(200).render('create')
    })

    app.get('/details/:id', async (req, res) => {
        let cube = await getCubeById(req.params.id, true)
        let accessories = cube.accessories.length === 0 ? false : cube.accessories
        res.status(200).render('updatedDetailsPage', { cube, accessories })
    })

    app.post('/create', async (req, res) => {
        let { name, description, imageUrl, difficultyLevel } = req.body;

        let cube = new Cube({ name, description, imageUrl, difficultyLevel });
        await cube.save((err) => {
            if (err) {
                console.log('Error', err)
                return
            }

            res.status(302).redirect('/')
        })
    })

    app.get('/create/accessory', (req, res) => {
        res.status(200).render('createAccessory')
    })

    app.post('/create/accessory', (req, res) => {
        let { name, imageUrl, description } = req.body;
        let accessory = new Accessory({ name, imageUrl, description });
        accessory.save((err) => {
            if (err) {
                console.log('Error', err)
                return
            }
            res.status(302).redirect('/')
        })
    })

    app.get('/attach/accessory/:id', async (req, res) => {
        let cube = await getCubeById(req.params.id)
        let accessories = await getAccessories(cube.accessories)
        accessories = accessories.length === 0 ? false : accessories
        res.status(200).render('attachAccessory', { cube, accessories })
    })

    app.post('/attach/accessory/:id', async (req, res) => {
        let { accessory } = req.body
        await updateCube(req.params.id, accessory)
        res.status(302).redirect(`/details/${req.params.id}`)

    })

    app.all('*', (req, res) => {
        res.status(404).render('error', {
            statusCode: 404,
            statusMessage: 'Not Found',
            statusImageUrl: 'http://clipart-library.com/new_gallery/843798_sad-smileys-png.png'
        })
    })
};