const Cubes = require('../models/cube');


function getCubes() {
    return Cubes.find({}).lean()
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

module.exports = {
    getCubes,
    getCubeById,
    searchCubes,
};