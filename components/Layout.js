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
                    <meta name="application-name" content="Teamwork" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                    <meta name="apple-mobile-web-app-title" content="Teamwork" />
                    <meta name="description" content="Teamwork - Blockchain use case" />
                    <meta name="format-detection" content="telephone=no" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta name="msapplication-config" content="/icons/browserconfig.xml" />
                    <meta name="msapplication-TileColor" content="#000000" />
                    <meta name="msapplication-tap-highlight" content="no" />
                    <meta name="theme-color" content="#ffffff" />

                    <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
                    <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-48x48.png" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-72x72.png" />
                    <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-72x72.png" />

                    <link rel="icon" type="image/png" sizes="48x48" href="/icons/icon-48x48.png" />

                    <link rel="manifest" href="/manifest.webmanifest" />
                    <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" />

                    {/* <meta name="twitter:card" content="summary" />
                    <meta name="twitter:url" content="https://yourdomain.com" />
                    <meta name="twitter:title" content="PWA App" />
                    <meta name="twitter:description" content="Best PWA App in the world" />
                    <meta name="twitter:image" content="https://yourdomain.com/icons/android-chrome-192x192.png" />
                    <meta name="twitter:creator" content="@DavidWShadow" />
                    <meta property="og:type" content="website" /> */}
                    <meta property="og:title" content="Teamwork" />
                    <meta property="og:description" content="A team with equal power. A blockchain use case on ethereum blockchain." />
                    <meta property="og:site_name" content="PWA App" />
                    <meta property="og:url" content="https://dpskreations.com" />
                    <meta property="og:image" content="https://raw.githubusercontent.com/deepanshuDPS/docs_and_pics/master/intro_overlay.gif" />

                </Head>
    
                <Header/>
                {this.props.children}
            </Container>
        )
    
    };

    

}

export default Layout;