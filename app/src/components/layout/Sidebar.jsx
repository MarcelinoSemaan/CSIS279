import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignOutAlt,
  faUsers,
  faPeopleGroup,
  faCalendarAlt,
  faExclamationTriangle,
  faTruck,
  faCar,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { name: 'Calendar', icon: faCalendarAlt, path: '/events/calendar' },
    { name: 'Members', icon: faUsers, path: '/members' },
    { name: 'Teams', icon: faPeopleGroup, path: '/teams' },
    { name: 'Drivers', icon: faTruck, path: '/events/drivers' },
    { name: 'Vehicles', icon: faCar, path: '/vehicles' },
    { name: 'Offices', icon: faBuilding, path: '/offices' },
    { name: 'Problems', icon: faExclamationTriangle, path: '/problems' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <ul className="nav flex-column">
          {menuItems.map((item, index) => (
            <li className="nav-item" key={index}>
              <Link
                to={item.path}
                className={`nav-link sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={item.icon} className="me-2" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn btn-danger w-100">
          <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
