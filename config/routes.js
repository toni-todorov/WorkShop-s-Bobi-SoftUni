// TODO: Require Controllers...


const { save, getCubes , getCubeById , searchCubes } = require('../services/cube-service')
const Cube = require('../models/cube')


module.exports = (app) => {
    app.get('/', (req, res) => {

        if (Object.keys(req.query).length > 0){
               searchCubes(req.query.search ,  req.query.from , req.query.to)
                .then ( searchResult => {
                    res.status(200).render('index' , {
                        cubes: searchResult.cubes,
                        search: searchResult.search
                    });
                })
                .catch(error => {
                    throw new Error(error)
                })

        }else {

            getCubes()
                .then(data => {
                    res.status(200).render('index', { cubes: data })
                })
                .catch(error => {
                    throw new Error (error)
                })
        }
    })

    app.get('/about', (req, res) => {
        res.status(200).render('about')
    })

    app.get('/create', (req, res) => {
        res.status(200).render('create')
    })

    app.get('/details/:id(\\d+)', (req, res) => {
        getCubeById(parseInt(req.params.id))
        .then(cube =>{
            res.status(200).render('details' , { cube })
        })
        .catch(err => {
            res.status(403).render('error' , {
                statusCode: 404,
                statusMessage: 'Forbidden ' + err.message,
                statusImageUrl: 'https://cdn3.iconfinder.com/data/icons/people-125/24/icon-people-angry-face-512.png'
            })
        })
    })

    app.all('*', (req, res) => {
        res.status(404).render('error' , {
            statusCode: 404,
            statusMessage: 'Not Found',
            statusImageUrl: 'http://clipart-library.com/new_gallery/843798_sad-smileys-png.png'
        })
    })

    app.post('/create', (req, res) => {
        let { name, description, imageUrl, difficultyLevel } = req.body;

        let cube = new Cube(name, description, imageUrl, difficultyLevel);
        save(cube);
        res.status(302).redirect('/')
    })
};