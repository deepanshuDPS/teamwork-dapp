// compile code will go here

const path = require('path');
const solc = require('solc');
// improved version of 'fs'
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname,'build');
fs.removeSync(buildPath)

// __dirname -> path to root directory
const teamworkPath = path.resolve(__dirname, 'contracts', 'Teamwork.sol');

const source = fs.readFileSync(teamworkPath, 'utf8');

function findImports(relativePath) {
    //my imported sources are stored under the node_modules folder!
    const absolutePath = path.resolve(__dirname, "..", 'node_modules', relativePath);
    const source = fs.readFileSync(absolutePath, 'utf8');
    return { contents: source };
  }

//module.exports = solc.compile(source,1).contracts[':Lottery'];

const input = {
    language : 'Solidity',
    sources: {
        'Teamwork.sol':{
            content:source,
        },
    },
    settings: {
        outputSelection: {
            '*':{
                '*' :['*'],
            },
        },
    },
};
const output =  JSON.parse(solc.compile(JSON.stringify(input), { import: findImports })).contracts['Teamwork.sol']
fs.ensureDirSync(buildPath);

for (let contract in output){
    fs.outputJSONSync(
        path.resolve(buildPath, contract + '.json'),
        output[contract]
    )
}

// module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
//     'Lottery.sol'
// ].Lottery;