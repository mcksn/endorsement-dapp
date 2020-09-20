pragma solidity ^0.4.18;

import "./Ownable.sol";
import "./Killable.sol";

contract Endorsement is Ownable, Killable {
    address owner;

    struct Participant {
        address identifier;
        string name;
        uint256 receivedPoints;
        uint256 usedPower;
        uint256 nEG;
        uint256 nER;
        mapping(address => bool) hasGivenTo;
        mapping(address => bool) hasReceivedFrom;
    }

    // modifiers

    modifier hasNoEther() {
        //reject any ether transfer
        require(msg.value == 0);
        _;
    }

    modifier receiverNotSender(address _receiver) {
        require(_receiver != msg.sender);
        _;
    }

    modifier hasJoined() {
        require(participants[msg.sender].identifier == msg.sender);
        _;
    }

    // constructors

    function Endorsement() public {
        owner = msg.sender;
    }

    // event logs

    event Joined(address indexed _participant, string _name);
    event EndorsementMade(
        address indexed _sender,
        address indexed _receiver,
        string _message
    );

    mapping(address => Participant) participants;
    address[] participantsArray;

    function joinNetwork(string _userName) public hasNoEther {
        require(participants[msg.sender].identifier != msg.sender);

        Participant memory newParticipant = Participant({
            identifier: msg.sender,
            name: _userName,
            receivedPoints: 0,
            usedPower: 0,
            nEG: 0,
            nER: 0
        });

        participants[msg.sender] = newParticipant;

        participantsArray.push(msg.sender);

        Joined(msg.sender, newParticipant.name);
    }

    function editProfile(string _name) public hasNoEther hasJoined {
        participants[msg.sender].name = _name;
    }

    function endorse(address _receiver, string _message)
        public
        hasNoEther
        hasJoined
        receiverNotSender(_receiver)
    {
        require(_receiver != 0x0);

        participants[msg.sender].nEG++;
        participants[msg.sender].usedPower = Division(
            1,
            participants[msg.sender].nEG,
            9
        );
        participants[msg.sender].hasGivenTo[_receiver] = true;

        updateEndorsee(_receiver, msg.sender);

        EndorsementMade(msg.sender, _receiver, _message);
    }

    //store and update new endorsee information after transaction call
    function updateEndorsee(address _receiver, address _sender) internal {
        participants[_receiver].nER++;
        participants[_receiver].receivedPoints =
            participants[_receiver].receivedPoints +
            participants[_sender].usedPower;
        participants[_receiver].hasReceivedFrom[_sender] = true;
    }

    //computation of total endorsement impact of a participant
    //the degree of connection should be strictly greater than 1 to be considered for
    //impact computation, else, the impact by default should be ignorant, i.e., 0
    function computeImpact(address _participant)
        public
        view
        hasJoined
        returns (uint256)
    {
        require(participants[_participant].identifier == _participant);

        uint256 nEG = participants[_participant].nEG;
        uint256 nER = participants[_participant].nER;
        uint256 _RE = participants[_participant].receivedPoints;

        if (nEG <= 1 && nER <= 1) {
            return 0;
            //return impact and exit here
        } else {
            uint256 minval = min(nEG, nER);
            uint256 maxval = max(nEG, nER);

            uint256 ratio = Division(minval, maxval, 9);
            uint256 RE = _RE;

            return ratio * RE;
        }
    }

    function fetchProfile(address _participant)
        public
        view
        returns (
            string,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        string storage name = participants[_participant].name;
        uint256 outDegree = participants[_participant].nEG;
        uint256 usedPower = participants[_participant].usedPower;

        uint256 inDegree = participants[_participant].nER;
        uint256 receivedPoints = participants[_participant].receivedPoints;
        uint256 impact = computeImpact(_participant);

        return (name, outDegree, usedPower, inDegree, receivedPoints, impact);
    }

    function getParticipants() public view returns (address[]) {
        return participantsArray;
    }

    //some helper  functions for floating point calculation
    function Division(
        uint256 _numerator,
        uint256 _denominator,
        uint256 _precision
    ) internal pure returns (uint256 _quotient) {
        uint256 numerator = _numerator * 10**(_precision + 1);
        uint256 quotient = ((numerator / _denominator) + 5) / 10;

        return (quotient);
    }

    //some helper maths function to compute max, min value.

    //used for computing ratio and ensuring that the ratio is always less than 1.
    function max(uint256 x, uint256 y) internal pure returns (uint256) {
        if (x < y) {
            return y;
        } else {
            return x;
        }
    }

    function min(uint256 x, uint256 y) internal pure returns (uint256) {
        if (x < y) {
            return x;
        } else {
            return y;
        }
    }
}
