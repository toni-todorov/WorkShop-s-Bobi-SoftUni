const Cubes = require('../models/cube');
const Accessory = require('../models/accessories')

function getAccessories(idsToExclude) {
    return Accessory.find({ '_id': { $nin: idsToExclude }}).lean()
}

async function updateCube(cubeId, accessoryId) {
    const CubsforAccessory = await Cubes.findById(cubeId);
    const AccessoryForCubs = await Accessory.findById(accessoryId);
    CubsforAccessory.accessories.push(accessoryId)
    AccessoryForCubs.cubes.push(cubeId)
    CubsforAccessory.save()
    AccessoryForCubs.save()
}

module.exports = {
    getAccessories,
    updateCube,
};