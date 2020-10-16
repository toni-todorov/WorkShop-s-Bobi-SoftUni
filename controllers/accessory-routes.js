const { getCubeById } = require('../services/cube-service')
const { getAccessories, updateCube } = require('../services/accessory-service')
const Accessory = require('../models/accessories')
const { checkAuthentication } = require('../services/user-service')

module.exports = (app) => {

    app.get('/create/accessory', checkAuthentication, (req, res) => {
        res.status(200).render('createAccessory')
    })

    app.post('/create/accessory', checkAuthentication, async (req, res) => {
        let { name, imageUrl, description } = req.body;
        let accessory = new Accessory({ name, imageUrl, description });
        try {
            await accessory.save()
            res.status(302).redirect('/create/accessory')
        } catch(err){
            return res.render('createAccessory' , { error: 'Accessory is not valid'})
        }
    })

    app.get('/attach/accessory/:id', checkAuthentication, async (req, res) => {
        let cube = await getCubeById(req.params.id)
        let accessories = await getAccessories(cube.accessories)
        accessories = accessories.length === 0 ? false : accessories
        res.status(200).render('attachAccessory', { cube, accessories })
    })

    app.post('/attach/accessory/:id', checkAuthentication, async (req, res) => {
        let { accessory } = req.body
        await updateCube(req.params.id, accessory)
        res.status(302).redirect(`/details/${req.params.id}`)

    })

}