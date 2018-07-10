import web3 from '../../initializers/web3';
import { getAbiByFunctionNames, decodeParameters } from '../../helpers/helper_web3';
import { implementationAbi } from '../../initializers/implementation_info';
import { proxyOptions } from '../../initializers/proxy_info';

export default (logs, dispatch, action) => {
  var promises = [];
  var logs = _.mapKeys(logs, 'transactionHash');
  var challenges = _.forOwn(logs, (value, key) => {
                    logs[key] = web3.eth.abi.decodeLog(
                      getAbiByFunctionNames(implementationAbi)["challengeCreation"].inputs,
                      value.data,
                      _.drop(value.topics)
                    );
                    promises.push(web3.eth.call(proxyOptions('challenges', {id: parseInt(logs[key].id)})));
                  });

  Promise.all(promises).then(parametersArray => {
    _.map(parametersArray, parametersBytes => {
      const parameters = decodeParameters('challenges',
                                           implementationAbi,
                                           parametersBytes);
      _.map(logs, (value , key) => {
        const sameTitle = value['title'] == parameters['title'];
        const sameTime = value['openTime'] == parameters['openTime'] ;
        const sameChallenge = sameTitle && sameTime;

        if(sameChallenge) {
          _.assign(logs[key], parameters);
        }
      });
    });
    return dispatch({
             type: action,
             payload: logs
           });
  });





  //modificar lo que se devuelve, convertir title en String, y hacer una llamada
  //al getter de Challengers para recoger el resto de campos y añadirselos
  //al resto de campos
}
