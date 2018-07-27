import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchOngoingChallenges } from '../actions';
import _ from 'lodash';
import Loading from 'react-loading-components';
import OngoingItem from '../components/OngoingItem';

class OngoingChallenges extends Component {

  constructor(props) {
    super(props);
    this.props.fetchOngoingChallenges();
  }

  renderOngoingChallenges() {
    const URL_BASE = 'http://www.rubyonblockchain.com/wp-content/uploads/';
    return _.map(this.props.ongoing, (value, key) => {
      if(!_.includes(this.props.user.participating, key)){
        return(
          <OngoingItem
            key={value.transactionHash}
            item={value}
            history={this.props.history}
          />
        );
      }
    });
  }

  render() {
    if(!_.isEmpty(this.props.ongoing)) {
      return (
        <div className="content container">
          <div className="row">
            {this.renderOngoingChallenges()}
          </div>
        </div>
      );
    } else {
      return(
        <div className={"content container"}>
          <div className="row" style={{marginTop: "200px"}}>
            <Loading type='bars' width={150} height={150} fill='#df6482' />
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps({ ongoing, user }) {
  return { ongoing, user }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchOngoingChallenges}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OngoingChallenges);
