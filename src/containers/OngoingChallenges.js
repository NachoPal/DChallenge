import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchOngoingChallenges } from '../actions';
import _ from 'lodash';

import Ongoing from '../components/Ongoing';

class OngoingChallenges extends Component {

  constructor(props) {
    super(props);
    console.log("Se monta ONGOING");
    //DESCOMENTAR CUANDO SE HAGA EL FETCH DESDE WEB3
    //this.props.fetchOngoingChallenges();
  }

  renderOngoingChallenges() {
    return this.props.ongoing.map( ongoing => {
      return(
        <Ongoing
          key={ongoing.id.toString()}
          title={ongoing.title}
          description={ongoing.description}
          img={ongoing.img}
          enrolled={ongoing.enrolled}
          accomplished={ongoing.accomplished}
          time={ongoing.time}
        />
      );
    });
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

function mapStateToProps({ongoing}) {
  return {ongoing}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchOngoingChallenges}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OngoingChallenges);
