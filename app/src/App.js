import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import EventCalendar from './components/events/EventCalendar';
import TeamEventList from './components/teams/TeamEventList';
import MemberEventList from './components/members/MemberEventList';
import TeamLeaderEventList from './components/teams/TeamLeaderEventList';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import TeamsList from './components/teams/TeamsList';

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
                        path="/events/teams"
                        element={
                            <ProtectedRoute>
                                <TeamEventList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/events/members"
                        element={
                            <ProtectedRoute>
                                <MemberEventList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/events/team-leaders"
                        element={
                            <ProtectedRoute>
                                <TeamLeaderEventList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/teams"
                        element={
                            <ProtectedRoute>
                                <TeamsList />
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

