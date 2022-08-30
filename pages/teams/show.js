import React, {Component} from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Teamwork from '../../ethereum/teamwork';
import { Link } from '../../routes';

class ShowTeam extends Component{

    static async getInitialProps(props){
        // props has slug for the redirect path
        const teamwork = Teamwork(props.query.address);
        const summary = await teamwork.methods.getSummary().call();
        const payable = await teamwork.methods.isPayable().call();

        return { 
            address: props.query.address,
            isPayable: payable,
            membersEntered : summary[0],
            totalMembers : summary[1],
            teamStatus: summary[2],
            teamName:summary[3],
            manager: summary[4]
        };
    }

    renderCards() {
        const {
            teamName,
            manager,
            totalMembers,
            membersEntered,
            teamStatus,
            isPayable
        } = this.props

        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this team and have more access than normal team members',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: teamName,
                meta: 'Team Name',
                description: 'You must contribute at least this much wei to become an approver'
            },
            {
                header: membersEntered +' | '+ totalMembers,
                meta: 'Members in Team | Members allowed',
                description: 'The request tries to withdraw money from the campaign. Requests must be approved by approvers'
            },
            {
                header: teamStatus? 'Active': 'Not-Active',
                meta: 'Team Status',
                description: 'Number of people who have already donated to this campaign'
            },
            {
                header: isPayable? 'You can pay or donate': 'You cannot pay for now',
                meta: 'Is team ready to get paid?',
                description: 'The balance is how much money this campaign has left to spend'
            }
        ];

        return <Card.Group items={items} />
    }

    render(){
        return (
            <Layout>
                <h3>Team - {this.props.teamName}</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            {/* <ContributeForm address={this.props.address}/> */}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {/** /campaigns/ path not working in this route */}
                            <Link route={`${this.props.address}/requests`}>
                                <a>
                                    <Button secondary>Pending wages</Button>
                                </a>
                            </Link>
                            <Link route={`${this.props.address}/requests`}>
                                <a>
                                    <Button primary disabled={this.props.membersEntered/this.props.totalMembers != 1}>{this.props.teamStatus?'Disable Team':'Enable Team'}</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default ShowTeam;