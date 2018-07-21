contract DChallenge {

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


  struct Challenge {
    uint bettingPrice;
    uint openTime;
    uint closeTime;
    mapping(address => bool) participants;
    mapping(address => bool) submissions;
  }

  mapping(uint => Challenge) public challenges;
  uint challengesCounter;

  uint public timeDelay;
  uint public secondsPerBlock;

  bool internal _initialized;


  function initialize(uint _timeDelay, uint _secondsPerBlock) public {
    require(!_initialized);
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

    emit challengeCreation(challengesCounter, _title, _description, _thumbnail);
    challengesCounter++;
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

  function isParticipating(uint _challengeId, address _userAddress) public view returns(bool) {
    return challenges[_challengeId].participants[_userAddress];
  }

  function hasSubmitted(uint _challengeId, address _userAddress) public view returns(bool) {
    return challenges[_challengeId].submissions[_userAddress];
  }

}
