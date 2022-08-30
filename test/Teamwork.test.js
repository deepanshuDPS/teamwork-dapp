const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/TeamworkFactory.json');
const compiledTeamwork = require('../ethereum/build/Teamwork.json');

let accounts;
let factory;

let teamworkAddress;
let teamwork;

beforeEach(async ()=> {
    accounts = await web3.eth.getAccounts();
    var { abi, evm } = compiledFactory;

    // increased the gas size because need more than 1000000
    factory = await new web3.eth.Contract(abi)
                .deploy({data: evm.bytecode.object})
                .send({ from:accounts[0], gas:'3000000' });

    await factory.methods.createTeam('Mob Devs', 2, 50).send({
            from: accounts[0],
            gas: '2000000'
        });

    // assign to index 0 to the variable campaignAddress
    [teamworkAddress]= await factory.methods.getTeamworks().call();

    // access campaign from address
    teamwork = await new web3.eth.Contract(compiledTeamwork.abi, teamworkAddress.split(":")[1]);

});

describe('Teamworks', ()=>{

    it('deployes a factory and a teamwork', () =>{
        assert.ok(factory.options.address);
        assert.ok(teamwork.options.address);
    });

    it('marks caller as the teamwork manager', async () =>{
        const manager = (await teamwork.methods.getSummary().call())['4'];
        assert.equal(accounts[0],manager);
    });

    // ganache provides 10 different accounts generated 
    // here using account at 1
    it('allow to resgister a team member and eligible to sendWage', async () =>{
        await teamwork.methods.registerAsMember().send({
            from: accounts[1]
        });
        let isEnabled = await teamwork.methods.isPayable().call();
        assert(isEnabled);
    });

    it('requires no team member will send wage', async () =>{
        try{
            await teamwork.methods.registerAsMember().send({
                from: accounts[1]
            });

            await teamwork.methods.payForServices().send({
                value : '50',
                from: accounts[1]
            });
            // to fail case
            assert(false);
        }catch(e){
            assert(e);
        }
    });

    it('requires to registertions as per required count', async () =>{
        try{
            await teamwork.methods.registerAsMember().send({
                from: accounts[1]
            });

            await teamwork.methods.registerAsMember().send({
                from: accounts[2]
            });
            // to fail case
            assert(false);
        }catch(e){
            assert(e);
        }
    });

    // receiptent is at account at 2
    it('allows a manager to send wage', async ()=>{

        await teamwork.methods.registerAsMember().send({
            from: accounts[1]
        });

        await teamwork.methods.payForServices().send({
            value : '51',
            from: accounts[2]
        });

        await teamwork.methods.getMyWage().send({
            from: accounts[0]
        });

        await teamwork.methods.sendWage(accounts[1]).send({
            from: accounts[0]
        });

        var balance = await teamwork.methods.getBalance().call();
        assert.equal(balance, 1);
    });

    it('processes a client and block team', async ()=> {
        try{
            await teamwork.methods.registerAsMember().send({
                from: accounts[1]
            });

            await teamwork.methods.payForServices().send({
                value : '101',
                from: accounts[2]
            });

            await teamwork.methods.getMyWage().send({
                from: accounts[0]
            });

            await teamwork.methods.changeStatus(false).send({
                from: accounts[0]
            });

            await teamwork.methods.payForServices().send({
                value : '56',
                from: accounts[2]
            });
            assert(false);
        }
        catch(e){
            assert(e);
        }
    });
});