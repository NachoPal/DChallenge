pragma solidity ^0.4.24;

contract DChallenge {

  struct Challenge {
    bytes32 title;
    bytes32 description;
    bytes32 descriptionExtra;
    uint bettingPrice;
    bytes32 code;
    mapping(address => bool) participants;
  }

  event challengeCreation(bytes32 indexed title,
                          uint indexed openTime,
                          uint indexed closeTime,
                          uint id,
                          bytes32 thumbnail);

  mapping(uit => Challenge) challenges;
  uint challengesCounter;


  function createChallenge(bytes32 _title,
                           bytes32 _description,
                           bytes32 _thumbnail,
                           uint _openTime,
                           uint _closeTime)
                           external returns(bool) {

    challenges[challengesCounter] = Challenge(_title, _description, 100 finney, 0, 0);
    challengesCounter++;

    emit challengeCreation(_title, _description, _openTime, _closeTime, )
  }
}
