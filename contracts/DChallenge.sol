contract DChallenge is usingOraclize {

  import "oraclize-api/contracts/usingOraclize";

  event challengeCreation(
    uint indexed id,
    bytes32 indexed title,
    bytes32 description,
    bytes32 thumbnail
  );

  event userParticipation(uint indexed challengeId, address indexed userAddress);

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
  bool internal _initialized;

  mapping(bytes32=>bool) validOraclizeIds;


  function initialize(uint _timeDelay, uint _secondsPerBlock) public {
    require(!_initialized);
    oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
    OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
    timeDelay = _timeDelay;
    secondsPerBlock = _secondsPerBlock;
    _initialized = true;
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

    orderChallengesToCloseById(_closeTime, challengesCounter);
    queryToCloseChallenge(challengesCounter, challenges[challengesCounter].closeTime);

    emit challengeCreation(challengesCounter, _title, _description, _thumbnail);
    challengesCounter++;
  }

  function orderChallengesToCloseById(_closeTime, _id) internal {
    uint length = challengesClosingOrder.length;
    uint startIndex = challengesClosingOrderStartIndex;

    if(length == 0) {
      challengesClosingOrder.push(_id);
    } else {
      for(uint i=length-1; i <= startIndex; i--){
        if(i == length && _closeTime >= challenges[challengesClosingOrder[i]].closeTime) {
          challengesClosingOrder.push(_id);
        } else if(_closeTime >= challenges[challengesClosingOrder[i]].closeTime) {
          challengesClosingOrder.length = length + 1;
          for(j=length; j > i; j--) {
            challengesClosingOrder[j] = challengesClosingOrder[j - 1];
          }
          challengesClosingOrder[i+1] = _id;
        }
      }
    }
  }

  function queryToCloseChallenge(_id, _closeTime) {
    if (oraclize_getPrice("URL") > this.balance) {
      LogNewOraclizeQuery(_id, "Oraclize query was NOT sent, please add some ETH to cover for the query fee");
    } else {
      LogNewOraclizeQuery(_id, "Oraclize query was sent, standing by for the answer..");
      uint delay = _closeTime - now;
      bytes32 queryId = oraclize_query(
                          delay,
                          "URL", "https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new"
                        );
      validOraclizeIds[queryId] = true;
    }
  }

  function participate(uint _challengeId, address _userAddress) {
    //With uPort
    //challenges[_challengeId].participants[msg.sender] = true;
    //emit userParticipation(_challengeId, msg.sender);

    //Whitout uPort
    challenges[_challengeId].participants[_userAddress] = true;
    emit userParticipation(_challengeId, _userAddress);
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

  function closeChallenge(_index) internal {
    uint id = challengesClosingOrder[_index];
    emit challengeClosed(id);

    delete challengesClosingOrder[_index];
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
    closeChallenge(challengesClosingOrderStartIndex);
  }
}
