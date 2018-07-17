pragma solidity ^0.4.24;

contract DChallenge {
  event challengeCreation(uint indexed id,
                          bytes32 indexed title,
                          bytes32 description,
                          bytes32 thumbnail);

 event userParticipation(uint indexed challengeId, address indexed userAddress);

 struct Challenge {
    uint bettingPrice;
    uint openTime;
    uint closeTime;
    mapping(address => bool) participants;
  }

  mapping(uint => Challenge) public challenges;
  uint challengesCounter;


  function createChallenge(bytes32 _title,
                           bytes32 _description,
                           bytes32 _thumbnail,
                           uint _openTime,
                           uint _closeTime,
                           uint _bettingPrice)
                           external returns(bool) {

    challenges[challengesCounter] = Challenge({bettingPrice: _bettingPrice,
                                               openTime: _openTime,
                                               closeTime: _closeTime});

    emit challengeCreation(challengesCounter, _title, _description, _thumbnail);
    challengesCounter++;
  }

  function participate(uint _challengeId, address _userAddress) {
    challenges[_challengeId].participants[msg.sender] = true;
    //With uPort
    //emit userParticipation(_challengeId, msg.sender);

    //Whitout uPort
    emit userParticipation(_challengeId, _userAddress);
  }

  function isParticipating(uint _challengeId) view returns(bool) {
    return challenges[_challengeId].participants[msg.sender];
  }

}
