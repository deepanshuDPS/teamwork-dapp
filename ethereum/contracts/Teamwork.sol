// SPDX-License-Identifier: MIT
// export NODE_OPTIONS=--openssl-legacy-provider
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Strings.sol";

contract TeamworkFactory {
    string[] public teams;

    // 2, 4, 5, 10, 20, 25 and 50 team members will be valid for a team
    function createTeam(
        string memory teamName,
        uint16 teamMembers,
        uint16 percentDivided
    ) public {
        require(
            teamMembers > 1 && 100 % teamMembers == 0 && teamMembers != 100
        );
        Teamwork newTeam = new Teamwork(
            teamName,
            teamMembers,
            msg.sender,
            percentDivided
        );
        string memory name = string(string.concat(bytes(teamName), ":"));
        string memory teamAddress = string(
            string.concat(bytes(name), bytes(Strings.toHexString(address(newTeam))))
        );
        teams.push(teamAddress);
    }

    function getTeamworks() public view returns (string[] memory) {
        return teams;
    }
}

contract Teamwork {
    /** 
    currentPay is the key where the balance is checked
    with currentPay that currentpay must be >= then balance 
    so client can give us the another transaction
    **/
    uint256 private currentPay = 0;
    uint16 private paymentNumber = 0; // in summary
    uint16 private totalMembers; // in summary
    uint16 public membersEntered = 0; // in summary
    uint16 private percentDivided = 100;

    // if team status is true and its full then eligible to work
    bool private teamStatus = false; // in summary

    string private teamName; // in summary
    mapping(address => uint16) private teamMembers;

    address[] private members;
    address private manager; // in summary

    constructor(
        string memory name,
        uint16 count,
        address creator,
        uint16 percent
    ) {
        manager = creator;
        totalMembers = count;
        teamName = name;
        // 1 means member initiated for first payment
        teamMembers[manager] = 1;
        members.push(manager);
        membersEntered++;
        percentDivided = percent;
    }

    // just like utility function to restrict something
    // use any line of code to make your custom modifier
    modifier restricted() {
        // only manager can do restricted works
        require(msg.sender == manager);
        _;
        // _; replaced by the code which is in the
        // function where we use this modifier
    }

    function registerAsMember() public {
        // team members not be equal to total members means the team if full
        require(totalMembers != membersEntered);
        // check wheather team member already exist or not
        require(teamMembers[msg.sender] == 0);
        // 1 means member initiated for first payment
        teamMembers[msg.sender] = 1;
        members.push(msg.sender);
        membersEntered++;
        teamStatus = membersEntered == totalMembers;
    }

    function payForServices() public payable {
        // team status
        require(teamStatus);
        // value must to be paid must be greater than 0
        //require(msg.value > 0);
        /** 
        Is team payble??
        0 in starting
        if 1000 payed to 4 team members then currentPay = 250
        250 > 1000 -> will not run till all funds are transfered to
        the teammembers 
        **/
        require(currentPay > getBalance() || currentPay == 0);
        // client not to be a team member
        require(teamMembers[msg.sender] == 0);
        paymentNumber++;
        currentPay = (msg.value * percentDivided) / 100;
    }

    function isPayable() public view returns (bool) {
        return teamStatus && (currentPay > getBalance() || currentPay == 0);
    }

    function getMyWage() public {
        // only collectable if team is full
        require(totalMembers == membersEntered);
        // only get wage if you are a team member
        require(teamMembers[msg.sender] > 0);
        // payment is not completed for this
        require(teamMembers[msg.sender] == paymentNumber);
        // transfer money
        payable(msg.sender).transfer(currentPay);
        teamMembers[msg.sender] = teamMembers[msg.sender] + 1;
    }

    // only manager can send wages
    function sendWage(address teamMember) public restricted {
        // you will not be a manager
        require(manager != teamMember);
        // only collectable if team is full
        require(totalMembers == membersEntered);
        // only get wage if it is a team member
        require(teamMembers[teamMember] > 0);
        // payed only if payment is not completed for this
        require(teamMembers[teamMember] == paymentNumber);
        // transfer money
        payable(teamMember).transfer(currentPay);
        teamMembers[teamMember] = teamMembers[teamMember] + 1;
    }

    // get the remaining balance for contract which is not divided by percentage
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // block/unblock team
    function changeStatus(bool statusToSet) public restricted {
        // only proceed when team is full
        require(totalMembers == membersEntered);
        // status to match
        require(teamStatus != statusToSet);
        teamStatus = statusToSet;
    }

    // get summary for the team details
    function getSummary()
        public
        view
        returns (
            uint16,
            uint16,
            bool,
            string memory,
            address
        )
    {
        return (membersEntered, totalMembers, teamStatus, teamName, manager);
    }

    // get all team members with their status
    function getTeamMembers()
        public
        view
        returns (
            address[] memory,
            uint16[] memory,
            uint16
        )
    {
        uint16[] memory transactions = new uint16[](membersEntered);
        for (uint16 i = 0; i < membersEntered; i++) {
            transactions[i] = teamMembers[members[i]];
        }
        return (members, transactions, paymentNumber);
    }
}
