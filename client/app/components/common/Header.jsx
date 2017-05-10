import React from 'react';
import { Link } from 'react-router';

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/app">Photo Grid</Link>
          </li>
          <li>
            <Link to="/app/profile">Profile</Link>
          </li>
          <li>
            <Link to="/app/photo">Photo</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header;
