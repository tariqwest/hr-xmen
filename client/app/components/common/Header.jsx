import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import _ from 'underscore';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: null,
      lastName: null,
    };
  }

  componentDidMount() {
    axios.get(process.env.NODE_ENV === 'production' ? `${process.env.ENV_URL}/api/user` : `${process.env.ENV_URL}:${process.env.PORT}/api/user`)
    .then(res => {
      this.setState({
        firstName: res.data.user.firstName,
        lastName: res.data.user.lastName,
      });
    })
    .catch(err => {
      throw err;
    });
  }

  render() {
    const colorClass = ['userName--blue', 'userName--green', 'userName--darkblue', 'userName--red', 'userName--orange', 'userName--pink'];
    return (
      <header>
        <nav>
          <ul>
            <li>
              <div className="user right">Hi,  <div className={colorClass[_.random(5)]}>{this.state.firstName} {this.state.lastName}</div></div>
            </li>
            <li>
              <Link to="/app">Photo Hungry</Link>
            </li>
            <li>
              <Link to="/app/profile">My Favorites</Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;
