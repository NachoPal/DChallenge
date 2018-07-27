import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchClosedChallenges } from '../actions';
import _ from 'lodash';
import Loading from 'react-loading-components';
import ClosedItem from '../components/ClosedItem';

class ClosedChallenges extends Component {

  constructor(props) {
    super(props);
    this.props.fetchClosedChallenges();
    //this.props.checkOraclizeLogs();
  }

  renderClosedChallenges() {
    const URL_BASE = 'http://www.rubyonblockchain.com/wp-content/uploads/';
    return _.map(this.props.closed, (value, key) => {
      if(!_.includes(this.props.user.participating, key)){
        return(
          <ClosedItem
            key={value.transactionHash}
            item={value}
            history={this.props.history}
          />
        );
      }
    });
  }

  render() {
    if(!_.isEmpty(this.props.closed)) {
      return (
        <div className="content container">
          <div className="row">
            {this.renderClosedChallenges()}
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

function mapStateToProps({ closed, user }) {
  return { closed, user }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchClosedChallenges,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClosedChallenges);
