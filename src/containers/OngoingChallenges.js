import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchOngoingChallenges } from '../actions';
import _ from 'lodash';

import OngoingItem from '../components/OngoingItem';

class OngoingChallenges extends Component {

  constructor(props) {
    super(props);
    this.props.fetchOngoingChallenges();
    console.log("ONGOING CONSTRUCTOR")
    //this.props.updateOngoingChallenges();
  }

  componentWillUpdate() {
    console.log("ONGOING UPDATE");
  }

  componentDidMount() {
    console.log("ONGOING DID MOUNT");
  }

  renderOngoingChallenges() {
    const URL_BASE = 'http://www.rubyonblockchain.com/wp-content/uploads/';
    if(this.props.ongoing) {
      return _.map(this.props.ongoing, (value, key) => {
        return(
          <OngoingItem
            key={value.transactionHash}
            item={value}
            img= {`${URL_BASE}token-640x300.jpg`}
            yours={false}
          />
        );
      });
    }
  }

  render() {
    return (
      <div className="content container">
        <div className="row">
          {this.renderOngoingChallenges()}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ ongoing, user }) {
  return { ongoing, user }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchOngoingChallenges}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OngoingChallenges);
