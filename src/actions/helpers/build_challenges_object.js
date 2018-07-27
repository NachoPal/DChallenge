import web3 from '../../initializers/web3';
import { getAbiByFunctionNames, decodeParameters, encodedEventSignature } from '../../helpers/helper_web3';
import { implementationAbi } from '../../initializers/implementation_info';
import { proxyOptions, proxyAddress } from '../../initializers/proxy_info';
import {
  FETCH_OPEN_CHALLENGES,
  FETCH_YOUR_OPEN_CHALLENGES,
  FETCH_ONGOING_CHALLENGES,
  FETCH_YOUR_ONGOING_CHALLENGES,
  FETCH_CLOSED_CHALLENGES,
  UPDATE_OPEN_CHALLENGES,
  FETCH_CHALLENGE
} from '../../initializers/action_types';

export default (logs, dispatch, action) => {
  var promises = [];
  var promises2 = [];
  var promises3 = [];
  var promises4 = [];
  //var challengeSubmissions = [];

  var decodedLogs = _.map( logs, (log) => {
                        var decoded = web3.eth.abi.decodeLog(
                                        getAbiByFunctionNames(implementationAbi)["challengeCreation"].inputs,
                                        log.data,
                                        _.drop(log.topics)
                                      );
                        decoded.transactionHash = log.transactionHash;
                        return decoded;
                    });

  _.map(decodedLogs, (decodedLog) => {
      promises.push(web3.eth.call(proxyOptions('challenges', {id: parseInt(decodedLog.id)}, 0)));
  });


  Promise.all(promises).then(parametersArray => {
    var count = 0;
    _.map(parametersArray, parametersBytes => {
        const parameters = decodeParameters('challenges',
                                             implementationAbi,
                                             parametersBytes);

        decodedLogs[count].title = web3.utils.hexToString(decodedLogs[count].title);
        decodedLogs[count]["bettingPrice"] = parseInt(parameters.bettingPrice);
        decodedLogs[count]["openTime"] = parseInt(parameters.openTime);
        decodedLogs[count]["closeTime"] = parseInt(parameters.closeTime);
        decodedLogs[count]["participants"] = null;
        decodedLogs[count]["submissions"] = null;

        if(decodedLogs[count].openTime > Date.now()) {
          decodedLogs[count]["status"] = "open";
        }else if(decodedLogs[count].openTime <= Date.now() && decodedLogs[count].closeTime > Date.now()) {
          decodedLogs[count]["status"] = "ongoing";
        }else if(decodedLogs[count].closeTime < Date.now()) {
          decodedLogs[count]["status"] = "closed";
        }

        promises2.push(web3.eth.getPastLogs({
          fromBlock: 1,
          address: proxyAddress,
          topics: [
            encodedEventSignature("challengeParticipation", implementationAbi),
            web3.eth.abi.encodeParameter('uint256', decodedLogs[count].id)
          ]
        }));

        //AQUI HAGO LA LLAMADA AL EVENTO DE CHALLENGE SUBMISSIO
        //decodedLogs[count]["submissions"] = 0;
        promises3.push(web3.eth.getPastLogs({
          fromBlock: 1,
          address: proxyAddress,
          topics: [
            encodedEventSignature("challengeSubmission", implementationAbi),
            web3.eth.abi.encodeParameter('uint256', decodedLogs[count].id)
          ]
        }));

        if(decodedLogs[count].status = "closed") {
          promises4.push(web3.eth.getPastLogs({
            fromBlock: 1,
            address: proxyAddress,
            topics: [
              encodedEventSignature("challengeClosed", implementationAbi),
              web3.eth.abi.encodeParameter('uint256', decodedLogs[count].id)
            ]
          }));
        }

        count++;
    });

    Promise.all(promises2).then(logs => {
      var count = 0;
      _.map(logs, log => {
        decodedLogs[count].participants = log.length;
        count++;
      });

      Promise.all(promises3).then(logs => {
        var count = 0;
        var challengeSubmissions = _.map(logs, log => {
          decodedLogs[count].submissions = log.length;
          decodedLogs[count]["submissionsData"] = [];

          _.map(log, submission => {
            decodedLogs[count]["submissionsData"].push(
              web3.eth.abi.decodeLog(
                getAbiByFunctionNames(implementationAbi)["challengeSubmission"].inputs,
                submission.data,
                _.drop(submission.topics)
              ));
            });
            if(decodedLogs[count].submissions > 0) {
              decodedLogs[count].submissionsData = _.mapKeys(decodedLogs[count].submissionsData, 'userAddress');
            }
          count++;
        });

        decodedLogs = decodedLogs.filter( (decodedLog) => {
          switch(action) {
            case FETCH_OPEN_CHALLENGES:
              return decodedLog.status == "open";
            case UPDATE_OPEN_CHALLENGES:
              return decodedLog.status == "open";
            case FETCH_YOUR_OPEN_CHALLENGES:
              return decodedLog.status == "open";
            case FETCH_ONGOING_CHALLENGES:
              return decodedLog.status == "ongoing";
            case FETCH_YOUR_ONGOING_CHALLENGES:
              return decodedLog.status == "ongoing";
            case FETCH_CLOSED_CHALLENGES:
              return decodedLog.status == "closed";
            default:
              return decodedLog.participants >= 0;
          }
        });

        Promise.all(promises4).then(logs => {
          var count = 0;
          _.map(logs, log => {
            var decoded = web3.eth.abi.decodeLog(
                            getAbiByFunctionNames(implementationAbi)["challengeClosed"].inputs,
                            log[0].data,
                            _.drop(log[0].topics)
                          );
            decodedLogs[count]["winner"] = decoded.winner;

            if(decodedLogs[count].winner == true) {
              decodedLogs[count]["winnerAddress"] = decoded.winnerAddress;
              decodedLogs[count]["prizeAmount"] = decoded.prizeAmount;
              decodedLogs[count]["randomNumber"] = decoded.randomNumber;

              const winnerSubmission = decodedLogs[count].submissionsData[decoded.winnerAddress];
              decodedLogs[count]["winnerVideo"] = {};
              decodedLogs[count].winnerVideo["code"] = winnerSubmission.code;
              decodedLogs[count].winnerVideo["videoDuration"] = winnerSubmission.videoDuration;
              decodedLogs[count].winnerVideo["ipfsHash"] = winnerSubmission.ipfsHash;
            }

            count++;
          });
        });

        switch(action) {
          case FETCH_OPEN_CHALLENGES:
            decodedLogs = _.orderBy(decodedLogs, 'openTime', 'asc');
          case UPDATE_OPEN_CHALLENGES:
            decodedLogs = _.orderBy(decodedLogs, 'openTime', 'asc');
          case FETCH_ONGOING_CHALLENGES:
            decodedLogs = _.orderBy(decodedLogs, 'closeTime', 'asc');
          case FETCH_CLOSED_CHALLENGES:
            decodedLogs = _.orderBy(decodedLogs, 'closeTime', 'asc');
        }

        var payload = null;

        if(action == FETCH_CHALLENGE) {
          payload = decodedLogs[0];
        } else {
          payload = _.mapKeys(decodedLogs, 'id')
        }

        //console.log("PAYLOAD", payload);

        return dispatch({
                 type: action,
                 payload: payload
               });
      });
    });
  });
}
