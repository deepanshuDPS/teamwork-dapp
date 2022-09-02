import web3 from './web3';
import TeamworkFactory from './build/TeamworkFactory.json';

const addressV1 = '0x07b1b6083FB1F69655d762eFc6f0B9Ef6f4af29E'
const addressV2 = '0xb25E2994324e7687CFf707385A78CCBd8507A3B8'

const instance = new web3.eth.Contract(
    TeamworkFactory.abi,
    addressV2
);

// getting teamwork-factory contract to get teams and create new team
export default instance;