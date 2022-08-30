// deploy code will go here
const path = require('path');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/TeamworkFactory.json');



// configuring the .env file
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })

const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    process.env.RPC_URL
);

const web3 = new Web3(provider);

const deploy = async () =>{
    const accounts = await web3.eth.getAccounts();
    const { abi, evm } = compiledFactory;

    console.log('Attempting to deploy from account', accounts[0]);
    console.log(abi);

    const result = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object })
        .send({ gas: '3000000', from: accounts[0]});

    console.log('Contract deployed to', result.options.address);
    provider.engine.stop();
    
    
    // https://rinkeby.etherscan.io/
}

deploy();