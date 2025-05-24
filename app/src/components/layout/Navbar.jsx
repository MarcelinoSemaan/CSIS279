import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { setShowReportModal } from '../../store/slices/authSlice';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
  };

  const handleReportClick = () => {
    dispatch(setShowReportModal(true));
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div className="container">
        <Link className="navbar-brand w-100 text-center" to="/">Event Management System</Link>
      </div>
      <div className="container py-2 d-flex align-items-center justify-content-between">
        <form className="d-flex" style={{ flex: '1', maxWidth: '600px' }} onSubmit={handleSearch}>
          <div className="input-group">
            <input
              type="search"
              className="form-control"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-light" type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </form>
        <button
          className="btn btn-danger ms-3"
          onClick={handleReportClick}
        >
          Report a Problem
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
