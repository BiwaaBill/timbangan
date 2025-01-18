// components/Navbar.js
import React from 'react';
import { faBars, faSearch, faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Navbar = ({ toggleSidebar, toggleUserMenu, userMenuOpen }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <button onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} className="text-gray-500" />
      </button>
      <div className="flex items-center">
        <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="ml-3 bg-transparent focus:outline-none"
        />
      </div>
      <div className="flex items-center">
        <div className="ml-4 relative">
          <button id="user-menu-button" onClick={toggleUserMenu} className="flex items-center text-gray-400">
            <img
              src="https://storage.googleapis.com/a1aa/image/flncJaLe0mndSk7AGq2WLEKtsxjyoh0aJBcfeAHUkrJAxqMOB.jpg"
              alt="User avatar"
              className="h-8 w-8 rounded-full"
            />
            <span className="ml-2">nabila</span>
          </button>
          {userMenuOpen && (
            <div id="user-menu" className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
              <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100" href="profile">Your profile</a>
              <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100" href="#">Sign out</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
