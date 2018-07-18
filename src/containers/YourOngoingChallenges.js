import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchYourOngoingChallenges } from '../actions';
import _ from 'lodash';
import web3 from './../initializers/web3';

import OngoingItem from '../components/OngoingItem';

class YourOngoingChallenges extends Component {

  constructor(props) {
    super(props);
    if(this.props.user.logged == true) {
      this.props.fetchYourOngoingChallenges(this.props.user.details.address);
    }
    //this.props.updateOpenChallenges();
  }

  renderOngoingChallenges() {
    const URL_BASE = 'http://www.rubyonblockchain.com/wp-content/uploads/';
    if(this.props.yourOngoing) {
      return _.map(this.props.yourOngoing, (value, key) => {
        return(
          <OngoingItem
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
          {this.renderOngoingChallenges()}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ yourOngoing, user }) {
  return { yourOngoing, user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchYourOngoingChallenges
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(YourOngoingChallenges);
