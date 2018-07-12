pragma solidity ^0.4.24;

contract DChallenge {
  event challengeCreation(bytes32 indexed title,
                          uint indexed openTime,
                          uint indexed closeTime,
                          uint id,
                          bytes32 thumbnail);

 event userParticipation(uint indexed challengeId, address indexed userId);

 struct Challenge {
    bytes32 title;
    bytes32 description;
    bytes32 descriptionExtra;
    uint bettingPrice;
    uint openTime;
    uint closeTime;
    bytes32 code;
    mapping(address => bool) participants;
  }

  mapping(uint => Challenge) public challenges;
  uint challengesCounter;


  function createChallenge(bytes32 _title,
                           bytes32 _description,
                           bytes32 _thumbnail,
                           uint _openTime,
                           uint _closeTime)
                           external returns(bool) {

    challenges[challengesCounter] = Challenge({title: _title,
                                               description: _description,
                                               descriptionExtra: 0,
                                               bettingPrice: 100 finney,
                                               openTime: _openTime,
                                               closeTime: _closeTime,
                                               code: 0});

    emit challengeCreation(_title, _openTime, _closeTime, challengesCounter, _thumbnail);
    challengesCounter++;
  }

  function participate(uint _challengeId) {
    challenges[_challengeId].participants[msg.sender] = true;
    emit userParticipation(_challengeId, msg.sender);
  }

  function isParticipating(uint _challengeId) view returns(bool) {
    return challenges[_challengeId].participants[msg.sender];
  }

}
