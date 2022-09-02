import React, { Component } from "react";
import { Container } from "semantic-ui-react";
import Header from './Header';
import Head from 'next/head';
import web3 from '../ethereum/web3';
import currentWindow from '../ethereum/ethereum';

class Layout extends Component {

    constructor(props){
        super(props);
    }

    setAccount = async (accounts) => {
        let haveAccounts = accounts > 0;
        this.props.setWallet(haveAccounts, haveAccounts ? accounts[0] : '');
        setTimeout(() => this.props.setLoading(false), 500)
    }


    componentDidMount = async () => {
        // subscribed for web3 events to check accounts data
        if(currentWindow != undefined){
            let accounts = await web3.eth.getAccounts();
            this.setAccount(accounts);
            currentWindow.ethereum.on('accountsChanged', (accounts) => {
                this.props.setLoading(true);
                this.setAccount(accounts);
            })

            currentWindow.ethereum.on('chainChanged', (chainId) => {
                console.log(chainId)
            })
        }
    }
    render(){
        return (
            <Container>
                <Head>
                    <link async rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css" />
                    <script src="https://cdn.jsdelivr.net/npm/semantic-ui-react/dist/umd/semantic-ui-react.min.js"></script>
                </Head>
    
                <Header/>
                {this.props.children}
            </Container>
        )
    
    };

    

}

export default Layout;