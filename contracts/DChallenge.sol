import "oraclize-api/contracts/usingOraclize.sol";

contract DChallenge is usingOraclize {

  event challengeCreation(
    uint indexed id,
    bytes32 indexed title,
    bytes32 description,
    bytes32 thumbnail
  );

  event challengeParticipation(uint indexed id, address indexed userAddress);

  event challengeSubmission(
    uint indexed id,
    address indexed userAddress,
    bytes32 code,
    uint videoDuration,
    string ipfsHash
  );

  event challengeClosed(uint indexed id);

  event LogNewOraclizeQuery(uint indexed id, string message);


  struct Challenge {
    uint bettingPrice;
    uint openTime;
    uint closeTime;
    mapping(address => bool) participants;
    mapping(address => bool) submissions;
  }

  mapping(uint => Challenge) public challenges;
  uint challengesCounter;
  uint[] challengesClosingOrder;
  uint challengesClosingOrderStartIndex;

  uint public timeDelay;
  uint public secondsPerBlock;

  mapping(bytes32=>bool) validOraclizeIds;


  function initialize(uint _timeDelay, uint _secondsPerBlock) public {
    OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
    oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
    timeDelay = _timeDelay;
    secondsPerBlock = _secondsPerBlock;
  }

  function setTimeDelay(uint _timeDelay) public {
    timeDelay = _timeDelay;
  }

  function setSecondsPerBlock(uint _secondsPerBlock) public {
    secondsPerBlock = _secondsPerBlock;
  }

  function createChallenge(
    bytes32 _title,
    bytes32 _description,
    bytes32 _thumbnail,
    uint _openTime,
    uint _closeTime,
    uint _bettingPrice
  )external returns(bool) {

    challenges[challengesCounter] = Challenge({bettingPrice: _bettingPrice,
                                               openTime: _openTime,
                                               closeTime: _closeTime});

    orderChallengesToCloseById(_closeTime);
    queryToCloseChallenge(challenges[challengesCounter].closeTime);

    emit challengeCreation(challengesCounter, _title, _description, _thumbnail);
    challengesCounter++;
  }

  function orderChallengesToCloseById(uint _closeTime) internal {
    uint id = challengesCounter;
    uint length = challengesClosingOrder.length;
    uint startIndex = challengesClosingOrderStartIndex;

    if(length == 0) {
      challengesClosingOrder.push(id);
    } else {
      for(uint i=length-1; i <= startIndex; i--){
        if(i == length && _closeTime >= challenges[challengesClosingOrder[i]].closeTime) {
          challengesClosingOrder.push(id);
        } else if(_closeTime >= challenges[challengesClosingOrder[i]].closeTime) {
          challengesClosingOrder.length = length + 1;
          for(uint j=length; j > i; j--) {
            challengesClosingOrder[j] = challengesClosingOrder[j - 1];
          }
          challengesClosingOrder[i+1] = id;
        }
      }
    }
  }

  function queryToCloseChallenge(uint _closeTime) payable public {
    if (oraclize_getPrice("URL") > address(this).balance) {
      emit LogNewOraclizeQuery(challengesCounter, "Oraclize query was NOT sent, please add some ETH to cover for the query fee");
    } else {
      emit LogNewOraclizeQuery(challengesCounter, "Oraclize query was sent, standing by for the answer..");
      uint delay = (_closeTime/1000) - now;
      bytes32 queryId = oraclize_query(
                          delay,
                          "URL", "https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new"
                        );
      validOraclizeIds[queryId] = true;
    }
  }

  function participate(uint _challengeId, address _userAddress) public {
    //With uPort
    //challenges[_challengeId].participants[msg.sender] = true;
    //emit challengeParticipation(_challengeId, msg.sender);

    //Whitout uPort
    challenges[_challengeId].participants[_userAddress] = true;
    emit challengeParticipation(_challengeId, _userAddress);
  }

  function submit (
    uint _challengeId,
    uint _blockNumber,
    bytes32 _code,
    uint _videoDuration,
    string _ipfsHash,
    address _userAddress
  )public returns(bool){
    require(verifySubmission(_blockNumber, _code, _userAddress, _videoDuration) == true);
    challenges[_challengeId].submissions[_userAddress] == true;
    emit challengeSubmission(_challengeId, _userAddress, _code, _videoDuration, _ipfsHash);
    return true;
  }

  function verifySubmission(
    uint _blockNumber,
    bytes32 _code,
    address _userAddress,
    uint _videoDuration
  )internal view returns(bool) {
    bytes32 blockHash = blockhash(_blockNumber);
    bytes32 code = keccak256(abi.encodePacked(_userAddress, blockHash));

    //uint time = timeDelay;
    //uint secondss = secondsPerBlock;

    if(_code != code) {
      return false;
    }

    uint currentBlockNumber = block.number;
    uint challengeDuration = _videoDuration + timeDelay;
    uint timeBetweenBlocks = (currentBlockNumber - _blockNumber) * secondsPerBlock;

    if(timeBetweenBlocks > challengeDuration) {
      return false;
    }
    return true;
  }

  function closeChallenge() internal {
    uint id = challengesClosingOrder[challengesClosingOrderStartIndex];
    emit challengeClosed(id);

    delete challengesClosingOrder[challengesClosingOrderStartIndex];
    challengesClosingOrderStartIndex++;
  }

  function isParticipating(uint _challengeId, address _userAddress) public view returns(bool) {
    return challenges[_challengeId].participants[_userAddress];
  }

  function hasSubmitted(uint _challengeId, address _userAddress) public view returns(bool) {
    return challenges[_challengeId].submissions[_userAddress];
  }

  function __callback(bytes32 myid, string result, bytes proof) public {
    require(validOraclizeIds[myid]);
    require(msg.sender == oraclize_cbAddress());
    closeChallenge();
  }
}
