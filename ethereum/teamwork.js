import web3 from './web3';
import Teamwork from './build/Teamwork.json';

// get current address team contract from dApp
export default (address) => {
    return new web3.eth.Contract(Teamwork.abi, address);
}