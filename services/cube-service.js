const Cubes = require('../models/cube');
const Accessory = require('../models/accessories')


function getCubes() {
    return Cubes.find({}).lean()
}

function getAccessories(idsToExclude) {
    return Accessory.find({ '_id': { $nin: idsToExclude }}).lean()
}

function getCubeById(id , returnAccessories = false) {
    if( returnAccessories ){
        return Cubes.findById(id).populate('accessories').lean()
    } 
        return Cubes.findById(id).lean()
   
}

function searchCubes(search, difficultyFrom, difficultyTo) {
    let fromDifficultyParsed = parseInt(difficultyFrom);
    let toDifficultyParsed = parseInt(difficultyTo);

    if (fromDifficultyParsed === '' || isNaN(fromDifficultyParsed)) {
        fromDifficultyParsed = 1
    };

    if (toDifficultyParsed === '' || isNaN(toDifficultyParsed)) {
        toDifficultyParsed = 6
    };
    async function database() {
        let result = Cubes.find({
            $or: [
                { name: { $regex: new RegExp(search, 'i') } },
                { description: { $regex: new RegExp(search, 'i') } }
            ],
            difficultyLevel: { $gte: fromDifficultyParsed, $lte: toDifficultyParsed }

        }).lean()
        return await result
    }
    return database()
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
    getCubes,
    getAccessories,
    updateCube,
    getCubeById,
    searchCubes
};