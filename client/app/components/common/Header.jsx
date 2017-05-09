import React from 'react';
import { Link } from 'react-router';

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Photo Grid</Link>
          </li>
          <li>
            <Link to="/photo">Photo</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header;
