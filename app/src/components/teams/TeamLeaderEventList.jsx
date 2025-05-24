import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventList from '../shared/EventList';
import api from '../../utils/api';
import { useDispatch } from 'react-redux';
import { setShowReportModal } from '../../store/slices/authSlice';

const TeamLeaderEventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (searchTerm = '') => {
    setLoading(true);
    try {
      const response = await api.get('/event', {
        params: { search: searchTerm, isTeamLeader: true }
      });
      const leaderEvents = response.data.filter(event => event.eventTeamID);
      setEvents(leaderEvents);
    } catch (error) {
      console.error('Error fetching team leader events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = () => {
    navigate('/calendar');
  };

  const handleSearch = (searchTerm) => {
    fetchEvents(searchTerm);
  };

  const handleViewEvent = (event) => {
    dispatch({
      type: 'SET_SELECTED_EVENT',
      payload: event
    });
  };

  const handleReportProblem = (event) => {
    dispatch(setShowReportModal({
      show: true,
      eventId: event.eventID
    }));
  };

  return (
    <EventList
      title="Team Leader Events"
      items={events}
      loading={loading}
      onAddClick={handleAddEvent}
      entityType="TeamLeader"
      onSearch={handleSearch}
      onViewEvent={handleViewEvent}
      onReportProblem={handleReportProblem}
    />
  );
};

export default TeamLeaderEventList;
