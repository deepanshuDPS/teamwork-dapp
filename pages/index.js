import React from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import { Link } from '../routes';
import Layout from '../components/Layout';
import BaseComponent from '../components/BaseComponent';

class TeamworkIndex extends BaseComponent {

    static async getInitialProps(){
        const teams = await factory.methods.getTeamworks().call();
        console.log(teams);
        return { teams };
    }

    renderTeams = () => {
        const items = this.props.teams.map( team => {
            var teamName = team.split(":")[0];
            var teamAddress = team.split(":")[1];
            return {
                header : teamName,
                description:(
                    <Link route={`/teams/${teamAddress}`}>
                        <a><h5>View Team</h5></a>
                    </Link>
                ),
                fluid: true
            };
        });

        return <Card.Group items={items} />
    };

    render() {
        return <Layout setLoading={this.setIsLoading} setWallet={(isWallet,currentAccount) => this.setWallet(isWallet,currentAccount)}>
            <div>
                <h3>All Teams</h3>
                <Link route="/teams/new">
                    <a>
                    <Button floated="right" content = "Create Your Team" icon="add" secondary disabled={!this.state.isWallet} loading={this.state.isLoading}/>
                    </a>
                </Link>
                { this.props.teams.length>0 ? this.renderTeams():(<h3>No Teams Yet</h3>) }
                </div>
        </Layout>
    }

}

export default TeamworkIndex;