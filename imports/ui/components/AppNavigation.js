import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router';
import { Accounts } from 'meteor/std:accounts-ui'

const AppNavigationLoggedOut = () => (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/" className="fancy-font">Faster Track</Link>
      </Navbar.Brand>
      <Link to="/login" className="fancy-font h6 pull-right">Login</Link>
    </Navbar.Header>
  </Navbar>
);

const AppNavigationLoggedIn = () => (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/" className="fancy-font">Faster Track</Link>
      </Navbar.Brand>
      <Link to="/login" className="fancy-font h6 pull-right">My Account</Link>
    </Navbar.Header>
  </Navbar>
);

let AppNavigation;
console.log(this, Meteor.user());
if (Meteor.user()) {
  AppNavigation = AppNavigationLoggedIn;
} else {
  AppNavigation = AppNavigationLoggedOut;
}

export default AppNavigation;
