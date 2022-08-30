import Web3 from 'web3';

let web3;

if (typeof window!== "undefined" 
        && typeof window.ethereum !== "undefined"){
            // we are in the browser and metamask is running
            window.ethereum.request({ method: "eth_requestAccounts" });
            web3 = new Web3(window.ethereum);
} else {
    // we are on the browser OR user is not running metamask
    // url to deploy on rinkby network
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/0309cd6b0e174e24971961233c79bd00'
    );
    web3 = new Web3(provider);
}

export default web3;