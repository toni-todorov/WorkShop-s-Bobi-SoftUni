
const fs = require('fs');
const path = require('path');

const DATABASE_PATH = path.join(__dirname, '/../config/database.json');
const DESCRIPTION_MAX_LENGTH = 200;

let nextId = 1
getCubes().then(cubes => {
    let maxId = -1;
    cubes.forEach(c => {
        if (c.id > maxId) {
            maxId = c.id
        }
    });
    nextId = maxId + 1
});
let isDbAccessed = false;

function getCubes() {
    return new Promise((resolve, reject) => {
        fs.readFile(DATABASE_PATH, 'utf-8', (error, data) => {
            if (error) {
                reject(error)
            }

            data = JSON.parse(data);
            resolve(data)
        })
    })
}

function getCubeById(id) {
    return getCubes()
        .then(cubes => {
            let cube = cubes.find(c => c.id === id);
            if (!cube) {
                throw new Error(`Cube with id ${id} does not exist.`)
            }

            return cube;
        })
}

function searchCubes(search, difficultyFrom, difficultyTo) {
    let fromDifficultyParsed = parseInt(difficultyFrom);
    let toDifficultyParsed = parseInt(difficultyTo);
    return getCubes()
        .then(cubes => {
            let filterCubes = cubes.filter(c => {
                let lowercaseSearch = search.trim().toLowerCase()
                let searchIncluded = !search ||
                    c.name.toLowerCase().includes(lowercaseSearch) ||
                    c.description.toLowerCase().includes(lowercaseSearch);

                let isFromDifficulty = !fromDifficultyParsed ||
                    c.difficultyLevel >= fromDifficultyParsed

                let isToDifficulty = !toDifficultyParsed ||
                    c.difficultyLevel <= toDifficultyParsed;

                return searchIncluded && isFromDifficulty && isToDifficulty
            })

            return { cubes: filterCubes, search: search };
        })
}

function validateCube(cube) {
    if (!cube.name || typeof (cube.name) !== 'string') {
        throw new TypeError('Name is required and must be a non-empty string.')
    }

    if (cube.description && (cube.description.length > DESCRIPTION_MAX_LENGTH)) {
        throw new RangeError(`Description cannot be longer than ${DESCRIPTION_MAX_LENGTH} symbols.`)
    }

    if (cube.imageUrl &&
        !cube.imageUrl.startsWith('http://') &&
        !cube.imageUrl.startsWith('https://')) {
        throw new RangeError('Invalid image URL')
    }

    let integerDifficulty = parseInt(cube.difficultyLevel);
    if (integerDifficulty && (integerDifficulty <= 0 || integerDifficulty > 6)) {
        throw new TypeError('Difficultty is required and must be integer value between 1 and 6')
    }
}

function save(cube) {
    const newCube = {
        id: nextId++,
        name: cube.name,
        description: cube.description,
        imageUrl: cube.imageUrl,
        difficultyLevel: cube.difficultyLevel
    };

    validateCube(newCube);

    newCube.difficultyLevel = parseInt(newCube.difficultyLevel)

    addEntryToDb(newCube);

}

function addEntryToDb(newEntry) {
    if (isDbAccessed) {
        setTimeout(addEntryToDb, 0, newEntry);
        return;
    }

    isDbAccessed = true;
    fs.readFile(DATABASE_PATH, 'utf-8', (error, data) => {
        if (error) {
            throw error;
        }

        let db = JSON.parse(data);
        db.push(newEntry);

        fs.writeFile(DATABASE_PATH, JSON.stringify(db), error => {
            if (error) {
                throw error
            }

            isDbAccessed = false;
            console.log('New cube has been successfully added');
        });
    });
}

module.exports = {
    save,
    getCubes,
    getCubeById,
    searchCubes
};