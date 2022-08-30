import { Router } from '../routes';
import React, { Component } from 'react';
import {Form, Input, Message, Button } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

class ContributeForm extends Component{

    state = {
        value: '',
        processing:false,
        errorMessage:''
    };

    onSubmit = async (event) =>{
        event.preventDefault();
        const campaign = Campaign(this.props.address);
        this.setState({processing:true,errorMessage:''})
        try{
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                // always takes value in wei
                value: web3.utils.toWei(this.state.value,'ether')
            });
            this.setState({processing:false});
            Router.replaceRoute(`/campaigns/${this.props.address}`);
        } catch(err){
            this.setState({errorMessage:err.message, processing:false});
        }


    };

    render(){
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input label="ether" labelPosition='right'
                        value={this.state.value}
                        onChange={event=>this.setState({value:event.target.value})}/>
                </Form.Field>
                <Message error header='Oops!!' content={this.state.errorMessage}/>
                <Button primary loading={this.state.processing}>Contribute!</Button>
            </Form>
        );
    }
}

export default ContributeForm;