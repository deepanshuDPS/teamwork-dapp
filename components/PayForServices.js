import { Router } from '../routes';
import React, { Component } from 'react';
import {Form, Input, Message, Button } from 'semantic-ui-react';
import Teamwork from '../ethereum/teamwork';
import web3 from '../ethereum/web3';

class PayForServicesForm extends Component{

    state = {
        value: '',
        processing:false,
        errorMessage:'',
        valueInWei:''
    };

    onSubmit = async (event) =>{
        event.preventDefault();
        const {address, currentAccount, teamMembers} = this.props;
        const teamwork = Teamwork(address);
        this.setState({ processing:true, errorMessage:'' })
        try{
            let percentDivided = 100/teamMembers;
            let amountToTransfer = this.state.valueInWei;
            let onePersonGet = Math.floor((amountToTransfer * percentDivided) / 100);
            if(amountToTransfer % onePersonGet !=0){
                    let aboveRange = ( onePersonGet + 1 ) * teamMembers;
                    let belowRange = onePersonGet * teamMembers;
                    this.setState(
                        {
                            errorMessage:`this amount cannot divided properly into team members. \n Choose this amount: ${belowRange} or this amount: ${aboveRange}`,
                            processing:false 
                        });
                    return;
            }

            await teamwork.methods.payForServices().send({
                from: currentAccount,
                // always takes value in wei
                value: web3.utils.toWei( this.state.value,'ether')
            });
            this.setState({ processing:false });
            this.props.onReload();
        } catch(err){
            this.setState({errorMessage:err.message, processing:false});
        }


    };

    render(){
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount you want to pay for services</label>
                    <Input label="ether" labelPosition='right'
                        value={this.state.value}
                        onChange={ event=>{
                            this.setState({value:event.target.value, valueInWei:web3.utils.toWei(event.target.value,'ether')})
                         }
                        }
                        onKeyPress={(event) => {
                            if (!/[0-9.]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}/>
                    <br></br><br></br>
                    <Input 
                        label="wei"     
                        labelPosition='right'
                        value={this.state.valueInWei} 
                        disabled
                        />
                </Form.Field>
                <Message error header='Oops!!' content={this.state.errorMessage}/>
                <Button secondary loading={this.state.processing} >Pay!</Button>
            </Form>
        );
    }
}

export default PayForServicesForm;