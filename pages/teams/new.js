import React from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';
import BaseComponent from '../../components/BaseComponent';

class NewTeam extends BaseComponent{

    state = {
        teamName: '',
        teamCount:'',
        percentDivided:0,
        errorMessage: '',
        isLoading:false,
        isWallet:false,
        currentAccount:''
    };


    onSubmit = async (event) =>{
        event.preventDefault();
        this.setState({loading: true, errorMessage: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            // metamask automatically decides gas for transactions
            await factory.methods
                .createTeam(
                    this.state.teamName,
                    this.state.teamCount,
                    this.state.percentDivided)
                .send({
                    from: accounts[0]
                });
            Router.pushRoute("/");
        } catch(err){
            this.setState({errorMessage: err.message });
        }
        this.setState({ loading:false });
    };



    render(){
        let paddingVertical = {padding:" 10px 0px 10px 0px "};
        return <Layout setLoading={(isLoading) => this.setState({isLoading})} setWallet={(isWallet,currentAccount) => this.setState({isWallet,currentAccount})}>
            <h3>New Team</h3>
            { /** !! "" => true
                 !! "false" => false **/  }
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label style={paddingVertical}>Team Name </label>
                    <Input
                        value={this.state.teamName} 
                        onChange={event => this.setState({
                            teamName: event.target.value
                        })}/> 
                    
                    <label style={paddingVertical}> Members count (2, 4, 5, 10, 20, 25 or 50 count will be valid for a team)</label>
                    <Input 
                        label="Factors of Hundred"     
                        labelPosition='right'
                        value={this.state.teamCount} 
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                        onChange={event => {
                            var percent = 0;
                            var value = event.target.value;
                            if(100 % value == 0 && value>1 && value<100)
                                percent = 100/value;
                            this.setState({
                                teamCount: value,
                                percentDivided: percent
                            })
                        }}/>

                    <label style={paddingVertical}> What percent a member of team member will get?</label>
                    <Input 
                        label="%"     
                        labelPosition='right'
                        value={this.state.percentDivided} 
                        onKeyPress={(event) => {
                              event.preventDefault();
                          }}
                        />
                </Form.Field>
                <Message error header = "Oops!" content={this.state.errorMessage} />
                <Button secondary loading={this.state.loading} disabled={!this.state.isWallet}>Create</Button>
            </Form>
        </Layout>
    }

}

export default NewTeam;