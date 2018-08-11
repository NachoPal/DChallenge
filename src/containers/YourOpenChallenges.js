import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchYourOpenChallenges, updateYourOpenChallenges } from '../actions';
import _ from 'lodash';
import web3 from './../initializers/web3';
import Loading from 'react-loading-components';
import OpenItem from '../components/OpenItem';

class YourOpenChallenges extends Component {

  constructor(props) {
    super(props);
    if(this.props.user.logged == true) {
      this.props.fetchYourOpenChallenges(this.props.user.details.address);
      this.props.updateYourOpenChallenges(this.props.user.details.address);
    }
  }

  renderOpenChallenges() {
    const URL_BASE = "https://ipfs.infura.io/ipfs/";
    if(this.props.yourOpen) {
      return _.map(this.props.yourOpen, (value, key) => {
        return(
          <OpenItem
            key={value.transactionHash}
            item={value}
            img= {`${URL_BASE}Qmb13iwEfsE2GiMiQPPdCzuqfVFHUhD4nQR7nHbiEBjmgZ`}
            history={this.props.history}
          />
        );
      });
    }
  }

  render() {
    if(!_.isEmpty(this.props.yourOpen)) {
      return (
        <div className={"yours-content container"}>
          <div className="row">
            {this.renderOpenChallenges()}
          </div>
        </div>
      );
    } else {
      return(
        <div className={"content container"}>
          <div className="row" style={{marginTop: "150px"}}>
            <Loading type='bars' width={150} height={150} fill='#df6482' />
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps({ yourOpen, user }) {
  return { yourOpen, user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchYourOpenChallenges,
    updateYourOpenChallenges
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(YourOpenChallenges);
