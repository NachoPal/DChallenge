import React, { Component } from 'react';
import web3 from "../initializers/web3";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getConfirmedBlockNumber,
  acceptButtonClicked
} from '../actions';
import ReactCountdownClock from 'react-countdown-clock';

class Code extends Component {
  constructor(props) {
    super(props);
    this.state = {seconds: 30};
    this.stopIntervals = this.stopIntervals.bind(this);
    this.setIntervals = this.setIntervals.bind(this);
    this.getBlock = this.getBlock.bind(this);
  }

  componentDidMount() {
    this.setIntervals();
  }

  componentWillUnmount() {
    this.stopIntervals();
  }

  setIntervals() {
    this.props.acceptButtonClicked(false);
    this.props.getConfirmedBlockNumber(this.props.user.details.address)
    this.setState({counting: true});

    //Only for development
    this.intervalMine = setInterval(() => {
      this.mine(15);
    }, 15000);
  }

  getBlock() {
    this.props.getConfirmedBlockNumber(this.props.user.details.address);
    this.setState({seconds: 0 })
    this.setState({seconds: 30 })
    this.setState({counting: true});
  }

  stopIntervals(onClick) {
    this.props.acceptButtonClicked(true);
    //clearInterval(this.intervalMine); //Only for Development
    this.setState({counting: false});
  }

  //Only for Development
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
        });
      }
    });
  }

  renderButton() {
    if(this.state.counting == true){
      return <button type="button" onClick={this.stopIntervals} className="btn btn-success counting-submit">ACCEPT</button>
    } else if(this.state.counting == false) {
      return <button type="button" onClick={this.setIntervals} className="btn btn-success counting-submit">RESET</button>
    }
  }

  render() {
    return(
      <div>
        <div className="inline">
          {this.renderButton()}
        </div>
        <div className="inline">
          <h3 className="code-h3">
            CODE:
            <b>
              {this.props.submit.code.slice(2,6).toUpperCase()}
            </b>
          </h3>
        </div>
        <div className="inline">
            <ReactCountdownClock seconds={this.state.seconds}
                         color="#000"
                         alpha={0.9}
                         size={50}
                         showMilliseconds={false}
                         paused={!this.state.counting}
                         onComplete={this.getBlock}/>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ submit, user }) {
  return { submit, user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getConfirmedBlockNumber,
    acceptButtonClicked
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Code);
