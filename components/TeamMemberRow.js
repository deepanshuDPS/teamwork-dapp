import React, { Component} from 'react';
import { Table, Button } from 'semantic-ui-react';
import Teamwork from '../ethereum/teamwork';
import { Router } from '../routes';

class TeamMemberRow extends Component {

    onSendWage = async () =>{
        this.props.onLoading(true);
        try{
            console.log(this.props.address);
            const teamwork = Teamwork(this.props.address);
            await teamwork.methods.sendWage(this.props.memberAddress).send({
                from: this.props.manager
            });
            Router.replaceRoute(`/teams/${this.props.address}`);
        }catch(err){
            console.log(err.message);
        }
        this.props.onLoading(false);

    }

    render(){
        const { Row, Cell } = Table;
        const { id , memberAddress, isTransacted, manager } = this.props;
        return(
            <Row disabled = {isTransacted} positive={isTransacted}>
                <Cell>{id+1}</Cell>
                <Cell>{memberAddress}</Cell>
                <Cell>
                    {manager!=memberAddress?
                    <Button color="green" basic
                        onClick={this.onSendWage} disabled={isTransacted}>SendWage</Button>
                        :<></>}
                </Cell>
            </Row>
        );
    }

}

export default TeamMemberRow;