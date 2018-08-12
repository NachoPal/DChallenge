import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchOpenChallenges, updateOpenChallenges } from '../actions';
import _ from 'lodash';
import web3 from '../initializers/web3';
import Loading from 'react-loading-components';
import OpenItem from '../components/OpenItem';
import ModalPendingTx from '../components/ModalPendingTx';

class OpenChallenges extends Component {

  constructor(props) {
    super(props);
    this.props.fetchOpenChallenges();
    this.props.updateOpenChallenges();
    this.state = {modalPendingTx: false}
  }

  componentWillMount() {
    if(this.props.location.state) {
      const pendingTxHash = this.props.location.state.txHash;
      this.waitForPendingTransaction(pendingTxHash);
    }
  }

  waitForPendingTransaction(txHash) {
    const pendingTxInterval = setInterval(() => {
      web3.eth.getTransactionReceipt(txHash).then((receipt) => {
        if(receipt) {
          this.setState({modalPendingTx: false});
          clearInterval(pendingTxInterval);
        } else {
          this.setState({modalPendingTx: true});
        }
      });
    }, 1000);
  }

  renderOpenChallenges() {
    const URL_BASE = 'http://www.rubyonblockchain.com/wp-content/uploads/';
    return _.map(this.props.open, (value, key) => {
      if(!_.includes(this.props.user.participating, key)){
        return(
          <OpenItem
            key={value.transactionHash}
            item={value}
            history={this.props.history}
          />
        );
      }
    });
  }

  renderPendingTxModal() {
    if(this.props.location.state) {
      return(
        <ModalPendingTx
          open={this.state.modalPendingTx}
          txHash={this.props.location.state.txHash}
        />
      );
    }
  }

  render() {
    if(!_.isEmpty(this.props.open)) {
      return (
        <div className={"content container"}>
          <div className="row">
            {this.renderOpenChallenges()}
          </div>
            {this.renderPendingTxModal()}
        </div>
      );
    } else {
      return(
        <div className={"content container"}>
          <div className="row" style={{marginTop: "200px"}}>
            <Loading type='bars' width={150} height={150} fill='#df6482' />
          </div>
            {this.renderPendingTxModal()}
        </div>
      );
    }
  }
}

function mapStateToProps({ open, user }) {
  return { open, user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchOpenChallenges,
    updateOpenChallenges
  }, dispatch);
}

//export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OpenChallenges));
export default connect(mapStateToProps, mapDispatchToProps)(OpenChallenges);
