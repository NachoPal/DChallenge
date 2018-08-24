pragma solidity ^0.4.24;

import "oraclize-api/contracts/usingOraclize.sol";
import "./Ownable.sol";
import "./Pausable.sol";
import "../libraries/SafeMath.sol";

/** @title DChallenge. */
contract DChallenge is Ownable, Pausable, usingOraclize {

    using SafeMath for uint256;

    /** @dev Check if the openTime of a challenges is bigger that the current block's timestamp.
      * @param _id ID of the challenge to be checked.
      */
    modifier challengeIsOpen(uint _id) {
        require(challenges[_id].openTime > (now - txDelay));
        _;
    }

    /** @dev Check if the current block's timestamp is bigger than challenge's openTime and lower than challenge's closeTime.
      * @param _id ID of the challenge to be checked.
      */
    modifier challengeIsOngoing(uint _id) {
        require((challenges[_id].openTime < now) && (challenges[_id].closeTime > (now - txDelay)));
        _;
    }

    /** @dev Check the user not participate twice for the same challenge
      * @param _id ID of the challenge to be checked.
      * @param _userAddress Address of the user.
      */
    modifier userHasNotParticipated(uint _id, address _userAddress) {
        require(!userIsParticipating(_id, _userAddress));
        _;
    }

    /** @dev Check the user not submit twice for the same challenge
      * @param _id ID of the challenge to be checked.
      * @param _userAddress Address of the user.
      */
    modifier userHasNotSubmitted(uint _id, address _userAddress) {
        require(!userHasSubmitted(_id, _userAddress));
        _;
    }

    /** @dev Event to log when a challenge has been closed.
      * @param id ID of the challenge.
      * @param title Title of the challenge.
      * @param summary Summary of the new challenge.
      * @param description Description of the new challenge.
      * @param thumbnail Thumbnail of the new challenge.
      */
    event challengeCreation(
        uint indexed id,
        bytes32 indexed title,
        string summary,
        string description,
        string thumbnail
    );

    /** @dev Event to log a user participation in a challenge.
      * @param id ID of the challenge.
      * @param userAddress Address of the user.
      */
    event challengeParticipation(uint indexed id, address indexed userAddress);

    /** @dev Event to log a user submissions in a challenge.
      * @param id ID of the challenge.
      * @param code Code proving timestamp and user ownership.
      * @param videoDuration Duration of the submitted video.
      * @param ipfsHash Ipfs hash pointing where the video has been stored.
      */
    event challengeSubmission(
        uint indexed id,
        address indexed userAddress,
        bytes32 code,
        uint videoDuration,
        string ipfsHash
    );

    /** @dev Event to log when a challenge has been closed.
      * @param id ID of the challenge.
      * @param winner Indicates if there have been submisisons in the challenge and therefore a winner.
      * @param winnerAddress Address of the challenge winner. In case of no winner the address will be '0x0'.
      * @param prizeAmount Prize amount won by the winner. In case of no winner the prize will be 0.
      * @param randomNumber Random number from wich the winner is selected among all participants who submitted a video.
      */
    event challengeClosed(
        uint indexed id,
        bool indexed winner,
        address indexed winnerAddress,
        uint prizeAmount,
        uint randomNumber
    );


    /** @dev Event to log when a Oraclize query has or has not been triggered.
      * @param id ID of the challenge.
      * @param message Message to describe if the query was triggered or not.
      */
    event LogNewOraclizeQuery(uint indexed id, string message);


    struct Challenge {
        uint bettingPrice;
        uint openTime;
        uint closeTime;
        uint participantsCounter;
        address[] submissionsIndex;
        mapping(address => bool) participants;
        mapping(address => bool) submissions;
    }

    mapping(uint => Challenge) public challenges;
    uint public challengesCounter;
    uint[] challengesClosingOrder;
    uint challengesClosingOrderStartIndex;

    uint public submitDelay;
    uint public txDelay;
    uint public secondsPerBlock;

    mapping(bytes32 => bool) validOraclizeIds;
    mapping(address => uint) public balances;


    /** @dev Works as constract constructor to initialize state variables as it is sharing storage with a Proxy contract.
      * @param _submitDelay Initial allowed delay in seconds for users to submit the video.
      * @param _txDelay Intial allowed transaction delay in seconds.
      * @param _secondsPerBlock Initial calculation of how many seconds takes a block in average to be mined.
      */
    function initialize(
        uint _submitDelay,
        uint _txDelay,
        uint _secondsPerBlock
    )
        external
    {
        //OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
        submitDelay = _submitDelay;
        txDelay = _txDelay;
        secondsPerBlock = _secondsPerBlock;
    }

    /** @dev Sets a new video submission allowed delay.
      * @param _submitDelay New allowed delay in seconds for users to submit the video.
      */
    function setSubmitDelay(uint _submitDelay) external onlyOwner {
        submitDelay = _submitDelay;
    }

    /** @dev Sets a new allowed transaction delay.
      * @param _txDelay New allowed transaction delay in seconds.
      */
    function setTxDelay(uint _txDelay) external onlyOwner {
        txDelay = _txDelay;
    }

    /** @dev Sets a new allowed transaction delay.
      * @param _secondsPerBlock New calculation of how many seconds takes a block in average to be mined.
      */
    function setSecondsPerBlock(uint _secondsPerBlock) external onlyOwner {
        secondsPerBlock = _secondsPerBlock;
    }

    /** @dev Creates a new challenge.
      * @param _title Title of the challenge.
      * @param _summary Summary of the new challenge.
      * @param _description Description of the new challenge.
      * @param _thumbnail Thumbnail of the new challenge.
      * @param _openTime Time the Open time will finish as milliseconds since UNIX epochTime.
      * @param _closeTime Time the Ongoing time will finish as milliseconds since UNIX epochTime.
      * @param _bettingPrice Entry fee in finney users have to pay to participate in the challenge.
      */
    function createChallenge(
        bytes32 _title,
        string _summary,
        string _description,
        string _thumbnail,
        uint _openTime,
        uint _closeTime,
        uint _bettingPrice
    )
        external
        onlyOwner
        returns(bool)
    {
        challenges[challengesCounter] = Challenge({
          bettingPrice: _bettingPrice,
          openTime: _openTime,
          closeTime: _closeTime,
          participantsCounter: 0,
          submissionsIndex: new address[](0)
        });

        orderChallengesToCloseById(_closeTime);
        queryToCloseChallenge(challenges[challengesCounter].closeTime);
        emit challengeCreation(challengesCounter, _title, _summary, _description, _thumbnail);
        challengesCounter++;
    }

    /** @dev User participates in a Challenge.
      * @param _challengeId ID of the challenge the user is participating.
      */
    function participate(
        uint _challengeId
    )
        external
        payable
        userHasNotParticipated(_challengeId, msg.sender)
        whenNotPaused
        challengeIsOpen(_challengeId)
    {
        require(msg.value >= challenges[_challengeId].bettingPrice);
        challenges[_challengeId].participants[msg.sender] = true;
        challenges[_challengeId].participantsCounter++;
        emit challengeParticipation(_challengeId, msg.sender);
    }

    /** @dev User submits a video for a challenge.
      * @param _challengeId id ID of the challenge.
      * @param _blockNumber Number of current block when video started to be recorder.
      * @param _code Code proving timestamp and user ownership.
      * @param _videoDuration Duration of the submitted video.
      * @param _ipfsHash Ipfs hash pointing where the video has been stored.
      */
    function submit (
        uint _challengeId,
        uint _blockNumber,
        bytes32 _code,
        uint _videoDuration,
        string _ipfsHash
    )
        external
        userHasNotSubmitted(_challengeId, msg.sender)
        whenNotPaused
        challengeIsOngoing(_challengeId)
        returns(bool)
    {
        require(userIsParticipating(_challengeId, msg.sender));
        require(verifySubmission(_blockNumber, _code, msg.sender, _videoDuration) == true);
        challenges[_challengeId].submissionsIndex.push(msg.sender);
        challenges[_challengeId].submissions[msg.sender] = true;
        emit challengeSubmission(_challengeId, msg.sender, _code, _videoDuration, _ipfsHash);
        return true;
    }

    /** @dev User withdraws his balance.
      * @param _amount Amount to withdraw.
      */
    function userWithdraw(uint _amount) external whenNotPaused {
        require(balances[msg.sender] >= _amount);
        balances[msg.sender] -= _amount;
        msg.sender.transfer(_amount);
    }

    /** @dev Destruct contract and send balance to the owner.
      */
    function kill() external onlyOwner {
        selfdestruct(proxyOwner());
    }

    /** @dev Callback called by Oraclize to close a challenge.
      * @param _myid Oraclize query unique ID.
      * @param _result Result of the query
      */
    function __callback(bytes32 _myid, string _result, bytes _proof) public whenNotPaused {
        require(validOraclizeIds[_myid]);
        require(msg.sender == oraclize_cbAddress());
        closeChallenge(parseInt(_result));
    }

    /** @dev Custom getter function to check if a user is participating in a certain challenge.
      * @param _challengeId ID of the challenge.
      * @param _userAddress Address of the user.
      * @return True if user is participating
      */
    function userIsParticipating(uint _challengeId, address _userAddress) public view returns(bool) {
        return challenges[_challengeId].participants[_userAddress];
    }

    /** @dev Custom getter function to check if a user has submitted a video in a certain challenge.
      * @param _challengeId ID of the challenge.
      * @param _userAddress Address of the user.
      * @return True if user is participating
      */
    function userHasSubmitted(uint _challengeId, address _userAddress) public view returns(bool) {
        return challenges[_challengeId].submissions[_userAddress];
    }

    /** @dev Orders in an array the ids of the challenges in function of when they have to be closed.
      * @param _closeTime Time the Ongoing time will finish as milliseconds since UNIX epochTime.
      */
    function orderChallengesToCloseById(uint _closeTime) internal {
        uint id = challengesCounter;
        uint length = challengesClosingOrder.length;
        uint startIndex = challengesClosingOrderStartIndex;

        if (length == startIndex) {
            challengesClosingOrder.push(id);
        } else {
            for (uint i=length-1; i >= startIndex; i--) {
                if (i == length-1 && _closeTime >= challenges[challengesClosingOrder[i]].closeTime) {
                    challengesClosingOrder.push(id);
                    break;
                }
                if (_closeTime >= challenges[challengesClosingOrder[i]].closeTime) {
                    challengesClosingOrder.length = length + 1;
                    for (uint j=length; j > i; j--) {
                        challengesClosingOrder[j] = challengesClosingOrder[j-1];
                    }
                    challengesClosingOrder[i+1] = id;
                    break;
                }
                if (i == startIndex) {
                    challengesClosingOrder.length = length + 1;
                    for (uint k=length; k > i; k--) {
                        challengesClosingOrder[k] = challengesClosingOrder[k-1];
                    }
                    challengesClosingOrder[i] = id;
                    break;
              }
            }
        }
    }

    /** @dev Triggers the query that will be handled by Oraclize
      * @param _closeTime Time the Ongoing time will finish as milliseconds since UNIX epochTime.
      */
    function queryToCloseChallenge(uint _closeTime) internal {
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogNewOraclizeQuery(challengesCounter, "Oraclize query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit LogNewOraclizeQuery(challengesCounter, "Oraclize query was sent, standing by for the answer..");
            uint delay = _closeTime - now - txDelay;
            bytes32 queryId = oraclize_query(
                                delay,
                                "URL", "https://www.random.org/integers/?num=1&min=1&max=10000&col=1&base=10&format=plain&rnd=new"
                              );
            validOraclizeIds[queryId] = true;
        }
    }

    /** @dev Verifies if the data attached in the submission match with the blockchain derived data.
      * @param _blockNumber Current block number when the video started to be recorded.
      * @param _userAddress uPort user address.
      * @param _videoDuration Duration of the submitted video.
      * @return true if verificaton succeded
      */
    function verifySubmission(
        uint _blockNumber,
        bytes32 _code,
        address _userAddress,
        uint _videoDuration
    )
        internal
        view
        returns(bool)
    {
        bytes32 blockHash = blockhash(_blockNumber);
        bytes32 code = keccak256(abi.encodePacked(_userAddress, blockHash));

        if (_code != code) {
            return false;
        }

        uint currentBlockNumber = block.number;
        uint challengeDuration = _videoDuration.add(submitDelay);
        uint timeBetweenBlocks = (currentBlockNumber.sub(_blockNumber)).mul(secondsPerBlock);

        if (timeBetweenBlocks > challengeDuration) {
            return false;
        }
        return true;
    }

    /** @dev Close the challenge in the last postion of challengesClosingOrder.
      * @param _randomNumber Random number retrieved by Oraclize API call.
      */
    function closeChallenge(uint _randomNumber) internal {
        uint id = challengesClosingOrder[challengesClosingOrderStartIndex];
        delete challengesClosingOrder[challengesClosingOrderStartIndex];
        challengesClosingOrderStartIndex++;

        if (challenges[id].submissionsIndex.length >= 1) {
            address winnerAddress = chooseWinner(id, _randomNumber);
            uint prizeAmount = givePrizeToWinner(id, winnerAddress);
            emit challengeClosed(id, true, winnerAddress, prizeAmount, _randomNumber);
        } else {
            emit challengeClosed(id, false, address(0), 0, 0);
        }
    }

    /** @dev Selects a winner userd based on the random number.
      * @param _challengeId ID of the challenge for a user to be selected as winner.
      * @param _randomNumber Random number retrieved by Oraclize API call.
      * @return the address of the winner.
      */
    function chooseWinner(uint _challengeId, uint _randomNumber) internal view returns(address) {
        uint winnerIndex = _randomNumber%((challenges[_challengeId].submissionsIndex.length - 1) + 1);
        return challenges[_challengeId].submissionsIndex[winnerIndex];
    }

    /** @dev Adds the prize amount in finney to the balance of the winner user.
      * @param _challengeId ID of the challenge for a user to be selected as winner.
      * @param _winnerAddress uPort address of the winner user.
      * @return the prize amount.
      */
    function givePrizeToWinner(uint _challengeId, address _winnerAddress) internal returns(uint) {
        uint prizeAmount = challenges[_challengeId].participantsCounter.mul(challenges[_challengeId].bettingPrice);
        balances[_winnerAddress] = balances[_winnerAddress].add(prizeAmount);
        return prizeAmount;
    }
}
