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
    console.log("Constructor",this.props);
    if(this.props.user.logged == true) {
      this.props.fetchYourOpenChallenges(this.props.user.details.address);
    }

    //this.props.updateOpenChallenges();
  }

  // componentWillmount() {
  //   console.log("mount",this.props);
  //   if(this.props.user.logged == true) {
  //     const userAddress = mnid.decode(this.props.user.details.address).address
  //     this.props.fetchYourOpenChallenges(address);
  //   }
  // }

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
            yours={true}
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

function mapStateToProps({ yourOpen, user }) {
  return { yourOpen, user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchYourOpenChallenges
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(YourOpenChallenges);