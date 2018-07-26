import React,{Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Avatar from 'react-avatar';
import { fetchUserChallengesIndex } from '../actions';
import { Link } from 'react-router-dom';
import { ACCOUNT_PATH } from '../initializers/routes';

class AccountArea extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log("DID MOUNT: LLAMO A COGER LOS INDICES")
    this.props.fetchUserChallengesIndex(this.props.user, this.saveInSessionStorage);
  }

  saveInSessionStorage(userInfo) {
    sessionStorage.setItem('user', JSON.stringify(userInfo));
  }

  render() {
    const { details } = this.props.user;
    return(
      <li>
        <Link id="account" to={ACCOUNT_PATH}>
          <Avatar
            name={details.name}
            src={details.avatar ? details.avatar.uri : null}
            round="100%"
            size="50px"
          />
        </Link>
      </li>
    );
  }
}

function mapStateToProps({user}) {
  return { user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchUserChallengesIndex }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountArea);
