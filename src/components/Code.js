import React, { Component } from 'react';
import web3 from "../initializers/web3";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getConfirmedBlockNumber } from '../actions';

class Code extends Component {
  constructor(props) {
    super(props);
    this.props.getConfirmedBlockNumber()
  }

  componentDidMount() {
    //Only for development
    this.intervalMine = setInterval(() => {
      this.mine(15000);
    }, 15000);

    this.intervalCode = setInterval(() => {
      this.props.getConfirmedBlockNumber()
    }, 30000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalMine);
    clearInterval(this.intervalCode);
  }

  mine(seconds) {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [seconds],
      id: new Date().getSeconds()
    },
    (err, resp) => {
      if (!err) {
        web3.currentProvider.send({
          jsonrpc: '2.0',
          method: 'evm_mine',
          params: [],
          id: new Date().getSeconds()
        },
        (err, resp) => {
          console.log("exito");
        });
      }
    });
  }

  render() {
    console.log("Confirmed Block", this.props.submit.confirmedBlock);
    return(
      <h3>{this.props.submit.confirmedBlock}</h3>
    );
  }
}

function mapStateToProps({ submit }) {
  return { submit };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getConfirmedBlockNumber
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Code);
