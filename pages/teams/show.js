import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Teamwork from '../../ethereum/teamwork';
import { Link } from '../../routes';
import PayForServicesForm from '../../components/payForServices';

class ShowTeam extends Component{

    state = {
        isWallet: false,
        currentAccount:'',
        isLoading: false,
        teamMembers : [],
        isOwner:false
    }

    setIsLoading = (loading) =>{
        this.setState({ isLoading: loading })
    }


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

    onRegister = async () => {
        this.setIsLoading(true);
        try {
            // metamask automatically decides gas for transactions
            var teamwork = Teamwork(this.props.address);
            await teamwork.methods
                .registerAsMember()
                .send({
                    from: this.state.currentAccount
                });
            Router.pushRoute(`/teams/${this.props.address}`);
        } catch(err){
            console.log(err);
        }
        this.setIsLoading(false);
    }

    getWage = async () => {
        this.setIsLoading(true);
        try{
            // metamask automatically decides gas for transactions
            var teamwork = Teamwork(this.props.address);
            await teamwork.methods
                .getMyWage()
                .send({
                    from: this.state.currentAccount
                });
            Router.pushRoute(`/teams/${this.props.address}`);
        }catch(err){
            console.log(err);
        }
        this.setIsLoading(false);
    }

    getIsMember = () => {
        const { isWallet, teamMembers, currentAccount } = this.state;
        return isWallet && teamMembers.find((it)=> this.getLowerCase(it) === this.getLowerCase(currentAccount)) !== undefined;
    }

    getLowerCase = (str) => str.toString().toLowerCase();

    getAllMembers = async () =>{
        this.setIsLoading(true)
        let members = await Teamwork(this.props.address).methods.getTeamMembers().call();
        this.setState({ teamMembers: members[0] })
        this.setIsLoading(false)
    }

    componentDidMount = async () =>{
        await this.getAllMembers();
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
        
        let items = [
            {
                header: this.state.isOwner ? "It's You" : manager.substring(0,5)+'xxxxx'+manager.substring(40,44),
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

    setWallet = (isWallet,currentAccount) =>{
        this.setState(
            {
                isWallet:isWallet, 
                currentAccount:currentAccount, 
                isOwner: isWallet && this.props.manager.toString().toLowerCase() === currentAccount.toString().toLowerCase()
            }
        );
        }

    isRegister = () => this.props.membersEntered != this.props.totalMembers;

    render(){

        return (
            <Layout setLoading={this.setIsLoading} setWallet={this.setWallet} >
            
                <h3>Team - {this.props.teamName}</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>
                        {
                        this.getIsMember()? <div></div>:
                            <Grid.Column width={6}>
                                <PayForServicesForm address={this.props.address} currentAccount={this.state.currentAccount} teamMembers={this.props.totalMembers} /> 
                            </Grid.Column>
                        }
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {
                                this.state.isOwner?
                                    <Link route={`${this.props.address}/members`} >
                                    <a>
                                        <Button secondary loading={this.state.isLoading}>Team Members</Button>
                                    </a>
                                    </Link>:<></>
                                
                            }
                            {this.isRegister()? <Button primary onClick={this.onRegister} loading={this.state.isLoading}>Register as Member</Button>:<></>}
                            {this.state.isOwner? <Button primary disabled={!this.isRegister} loading={this.state.isLoading}>{this.props.teamStatus?'Disable Team':'Enable Team'}</Button>:<></>}
                            {this.getIsMember()? <Button secondary onClick={this.getWage} loading={this.state.isLoading}>Get My Wage</Button>:<></>}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default ShowTeam;