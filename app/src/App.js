import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import EventCalendar from './components/events/EventCalendar';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector(state => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <Navbar />
            <div className="d-flex">
                <Sidebar />
                <div className="content-wrapper">
                    {children}
                </div>
            </div>
        </>
    );
};

function App() {
    const { isAuthenticated } = useSelector(state => state.auth);

    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                        path="/events/calendar"
                        element={
                            <ProtectedRoute>
                                <EventCalendar />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/"
                        element={<Navigate to="/events/calendar" replace />}
                    />
                    <Route path="*" element={<Navigate to="/events/calendar" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

