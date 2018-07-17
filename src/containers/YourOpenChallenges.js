import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchYourOpenChallenges } from '../actions';
import _ from 'lodash';
import web3 from './../initializers/web3';

import OpenItem from '../components/OpenItem';

class YourOpenChallenges extends Component {

  constructor(props) {
    super(props);
    this.props.fetchYourOpenChallenges();
    //this.props.updateOpenChallenges();
  }

  renderOpenChallenges() {
    const URL_BASE = 'http://www.rubyonblockchain.com/wp-content/uploads/';
    if(this.props.yourOpen) {
      return _.map(this.props.yourOpen, (value, key) => {
        return(
          <OpenItem
            key={value.transactionHash}
            item={value}
            img= {`${URL_BASE}token-640x300.jpg`}
            history={this.props.history}
          />
        );
      });
    }
  }

  render() {
    console.log("ME RE-RENDERIZO OPEN");
    return (
      <div className={"yours-content container"}>
        <div className="row">
          {this.renderOpenChallenges()}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ yourOpen }) {
  return { yourOpen };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchYourOpenChallenges
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(YourOpenChallenges);
