import React from 'react';
import BaseComponent from '../../../components/BaseComponent';
import Layout from '../../../components/Layout';
import Teamwork from '../../../ethereum/teamwork';
import {Table, Progress} from 'semantic-ui-react';
import TeamMemberRow from '../../../components/TeamMemberRow';

class TeamMembers extends BaseComponent{

    static async getInitialProps(props){
        const {address} = props.query;
        console.log(address);
        let teamDetails = await Teamwork(address).methods.getTeamMembers().call();
        return {address:address, teamMembers: teamDetails[0], manager:teamDetails[3], teamTransactions: teamDetails[1], transactions: teamDetails[2]};
    }


    renderRows(){
        const {teamMembers, teamTransactions, address, manager} = this.props;
        var members = [];
        for(var i=0; i < teamMembers.length;i++){
            members.push(
                <TeamMemberRow  
                    key={i}
                    sno={i+1}
                    memberAddress={teamMembers[i]}
                    manager={manager}
                    isTransacted={teamTransactions[i]!=this.props.transactions}
                    address={address}
                    onLoading={isLoading => this.setIsLoading(isLoading)}
                    />
            )
        }
        console.log('here'+members.length);
        return members;
    }


    render() {
        const {Header, Row, HeaderCell, Body } = Table;
        return <Layout setLoading={this.setIsLoading} setWallet={(isWallet, currentAccount) => this.setWallet(isWallet, currentAccount)} >
            <h3>Team Members</h3>
            {
                this.state.isLoading?(
                    <Progress active>
                        Processing Transaction Please Wait...
                    </Progress>
                ):(
                    <Table >
                <Header>
                    <Row>
                        <HeaderCell>SNo.</HeaderCell>
                        <HeaderCell>Address</HeaderCell>
                        <HeaderCell>Send Wage</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    {this.renderRows()}
                </Body>
            </Table>
                )
            }
            
            <div>{this.props.teamMembers.length} members found.</div>
        </Layout>
    }
}

export default TeamMembers;