import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventList from '../shared/EventList';
import api from '../../utils/api';
import { useDispatch } from 'react-redux';
import { setShowReportModal } from '../../store/slices/authSlice';

const MemberEventList = () => {
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
        params: { search: searchTerm }
      });
      // Filter events that have memberID
      const memberEvents = response.data.filter(event => event.eventMemberID);
      setEvents(memberEvents);
    } catch (error) {
      console.error('Error fetching member events:', error);
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
    // Stay on the current page and show event details
    dispatch({
      type: 'SET_SELECTED_EVENT',
      payload: event
    });
  };

  const handleReportProblem = async (event) => {
    // Stay on the current page and handle problem reporting
    dispatch(setShowReportModal({
      show: true,
      eventId: event.eventID
    }));
  };

  return (
    <EventList
      title="Member Events"
      items={events}
      loading={loading}
      onAddClick={handleAddEvent}
      entityType="Member"
      onSearch={handleSearch}
      onViewEvent={handleViewEvent}
      onReportProblem={handleReportProblem}
    />
  );
};

export default MemberEventList;
