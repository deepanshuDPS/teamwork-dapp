import {Component} from 'react';

export default class BaseComponent extends Component{

    state = {
        isWallet: false,
        currentAccount:'',
        isLoading: false
    }

    setIsLoading = (loading) =>{
        this.setState({ isLoading: loading })
    }

    setWallet = (isWallet,currentAccount) => {
        this.setState(
            { isWallet, currentAccount }
        );
    }

    onReload = () =>{
        window.location.reload();
    }

}
