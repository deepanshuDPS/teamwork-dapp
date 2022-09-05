import React from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Teamwork from '../../ethereum/teamwork';
import { Link } from '../../routes';
import PayForServicesForm from '../../components/PayForServices';
import BaseComponent from '../../components/BaseComponent';


class ShowTeam extends BaseComponent {

    state = {
        teamMembers: {},
        transactions: 0,
        teamLoaded: false
    }

    static async getInitialProps(props) {
        // props has slug for the redirect path
        
        const teamwork = Teamwork(props.query.address);
        const summary = await teamwork.methods.getSummary().call();
        const payable = await teamwork.methods.isPayable().call();

        return {
            address: props.query.address,
            isPayable: payable,
            membersEntered: summary[0],
            totalMembers: summary[1],
            teamStatus: summary[2],
            teamName: summary[3],
            manager: summary[4]
        };
    }

    onStatusChange = async () => {
        this.setIsLoading(true);
        try{
            await Teamwork(this.props.address).methods
                    .changeStatus(!this.props.teamStatus)
                    .send({
                        from:this.state.currentAccount
                    });
            this.onReload();
        }catch(err){
            console.log(err);
        }

        this.setIsLoading(false);
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
            this.onReload();
        } catch (err) {
            console.log(err);
        }
        this.setIsLoading(false);
    }

    getWage = async () => {
        this.setIsLoading(true);
        try {
            // metamask automatically decides gas for transactions
            var teamwork = Teamwork(this.props.address);
            await teamwork.methods
                .getMyWage()
                .send({
                    from: this.state.currentAccount
                });
            this.onReload();
        } catch (err) {
            console.log(err);
        }
        this.setIsLoading(false);
    }

    getIsMember = () => {
        const { teamLoaded, teamMembers, currentAccount } = this.state;
        return teamLoaded && teamMembers[this.getLowerCase(currentAccount)] !== undefined;
    }

    getLowerCase = (str) => str==undefined ? '': str.toString().toLowerCase();

    isWageCollected = () => {
        const { transactions, teamMembers, currentAccount } = this.state;
        return teamMembers[this.getLowerCase(currentAccount)] != transactions;
    }

    getAllMembers = async () => {
        this.setIsLoading(true)
        let teamDetails = await Teamwork(this.props.address).methods.getTeamMembers().call();
        this.setIsLoading(false)
        let members = {};
        for (var i = 0; i < teamDetails[0].length; i++) {
            members[this.getLowerCase(teamDetails[0][i])] = teamDetails[1][i];
        }
        this.setState({
            teamMembers: members,
            transactions: teamDetails[2],
            teamLoaded: true
        })
    }

    componentDidMount = async () => {
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
                header: this.getIsOwner() ? "It's You" : manager.substring(0, 5) + 'xxxxx' + manager.substring(40, 44),
                meta: 'Address of Manager',
                description: 'The manager who created or manage the team.',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: teamName,
                meta: 'Team Name',
                description: 'The name is known as their team name.'
            },
            {
                header: membersEntered + ' | ' + totalMembers,
                meta: 'Members in Team | Members allowed',
                description: 'Members in the team who is working for team.'
            },
            {
                header: teamStatus ? 'Active' : 'Not-Active',
                meta: 'Team Status',
                description: 'Is this team active to work or not?'
            },
            {
                header: `${100/totalMembers}%`,
                meta: 'Percentage',
                description: 'Percentage of total payment to be given to each employee'
            }
        ];
        if (!this.getIsMember() && this.state.teamLoaded && this.state.isWallet)
            items.push({
                header: isPayable ? "Yes, you can pay" : "No, you can't pay",
                meta: 'Is team ready to get paid?',
                description: 'If all team members collected their wages then team is payable.'
            })

        return <Card.Group items={items} />
    }

    getIsPayableForClient = () => !this.getIsMember() && this.state.isWallet && this.props.isPayable;

    isRegister = () => this.props.membersEntered != this.props.totalMembers && !this.getIsMember();
    
    getIsOwner = () => this.state.isWallet && this.props.manager.toString().toLowerCase() === this.state.currentAccount.toString().toLowerCase()

    render() {

        return (
            <Layout setLoading={this.setIsLoading} setWallet={(isWallet, currentAccount) => this.setWallet(isWallet, currentAccount)} >

                <h3>Team - {this.props.teamName}</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>
                        {
                            this.getIsPayableForClient() ?
                                <Grid.Column width={6}>
                                    <PayForServicesForm
                                        address={this.props.address}
                                        currentAccount={this.state.currentAccount}
                                        teamMembers={this.props.totalMembers}
                                        onReload={this.onReload} />
                                </Grid.Column> : <></>

                        }
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {
                                this.getIsOwner() ?
                                    <Link href={`${this.props.address}/members`} >
                                        <a>
                                            <Button secondary loading={this.state.isLoading}>Team Members</Button>
                                        </a>
                                    </Link> : <></>

                            }
                            {this.isRegister() ? <Button primary onClick={this.onRegister} loading={this.state.isLoading}>Register as Member</Button> : <></>}
                            {this.getIsOwner() ? <Button primary onClick={this.onStatusChange} disabled={!this.props.isPayable} loading={this.state.isLoading}>{this.props.teamStatus ? 'Disable Team' : 'Enable Team'}</Button> : <></>}
                            {this.getIsMember() ? <Button secondary onClick={this.getWage} loading={this.state.isLoading} disabled={this.isWageCollected()}>Get My Wage</Button> : <></>}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default ShowTeam;