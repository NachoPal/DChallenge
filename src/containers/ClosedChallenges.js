import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchClosedChallenges } from '../actions';
import _ from 'lodash';

import Closed from '../components/Closed';

class ClosedChallenges extends Component {

  constructor(props) {
    super(props);
    //DESCOMENTAR CUANDO SE HAGA EL FETCH DESDE WEB3
    //this.props.fetchOngoingChallenges();
  }

  renderClosedChallenges() {
    return this.props.closed.map( closed => {
      return(
        <Closed
          key={closed.id.toString()}
          title={closed.title}
          description={closed.description}
          img={closed.img}
          enrolled={closed.enrolled}
          accomplished={closed.accomplished}
          time={closed.time}
          raised={closed.raised}
        />
      );
    });
  }

  render() {
    return (
      <div className="content container">
        <div className="row">
          {this.renderClosedChallenges()}
        </div>
      </div>
    );
  }
}

function mapStateToProps({closed}) {
  return {closed}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchClosedChallenges}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClosedChallenges);
