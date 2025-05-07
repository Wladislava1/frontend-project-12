import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout, t }) => (
  <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
    <div className="container">
      <Link className="navbar-brand" to={user ? "/" : "/login"}>
        Hexlet Chat
      </Link>
      {user && (
        <button type="button" className="btn btn-primary" onClick={onLogout}>
          {t('navbar.logout')}
        </button>
      )}
    </div>
  </nav>
);

export default Navbar;