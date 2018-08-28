import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchYourClosedChallenges } from '../actions';
import _ from 'lodash';
import web3 from './../initializers/web3';
import Loading from 'react-loading-components';
import ClosedItem from '../components/ClosedItem';

class YourClosedChallenges extends Component {

  constructor(props) {
    super(props);
    if(this.props.user.logged == true) {
      this.props.fetchYourClosedChallenges(this.props.user.details.networkAddress);
    }
  }

  renderClosedChallenges() {
    const URL_BASE = 'http://www.rubyonblockchain.com/wp-content/uploads/';
    if(this.props.yourClosed) {
      return _.map(this.props.yourClosed, (value, key) => {
        return(
          <ClosedItem
            key={value.transactionHash}
            item={value}
            history={this.props.history}
          />
        );
      });
    }
  }

  render() {
    if(!_.isEmpty(this.props.yourClosed)) {
      return (
        <div className={"yours-content container"}>
          <div className="row">
            {this.renderClosedChallenges()}
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

function mapStateToProps({ yourClosed, user }) {
  return { yourClosed, user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchYourClosedChallenges
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(YourClosedChallenges);
