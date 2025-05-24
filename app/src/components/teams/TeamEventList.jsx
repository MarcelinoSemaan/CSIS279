import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventList from '../shared/EventList';
import ReportProblemModal from '../shared/ReportProblemModal';
import api from '../../utils/api';
import { useDispatch } from 'react-redux';
import { setShowReportModal } from '../../store/slices/authSlice';
import { setSelectedEvent } from '../../store/slices/eventSlice';
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

const TeamEventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setLocalSelectedEvent] = useState(null);
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
      const teamEvents = response.data.filter(event => event.eventTeamID);
      setEvents(teamEvents);
    } catch (error) {
      console.error('Error fetching team events:', error);
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
    setLocalSelectedEvent(event);
    setShowEventModal(true);
    dispatch(setSelectedEvent(event));
  };

  const handleReportProblem = (event) => {
    dispatch(setShowReportModal({
      show: true,
      eventId: event.eventID
    }));
  };

  const handleCloseModal = () => {
    setShowEventModal(false);
    setLocalSelectedEvent(null);
  };

  const handleViewTeams = () => {
    navigate('/teams');
  };

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex justify-content-end mb-3">
          <Button
            variant="primary"
            onClick={handleViewTeams}
            className="me-2"
          >
            <FontAwesomeIcon icon={faUsers} className="me-2" />
            View All Teams
          </Button>
        </div>
      </div>

      <EventList
        title="Team Events"
        items={events}
        loading={loading}
        onAddClick={handleAddEvent}
        entityType="Team"
        onSearch={handleSearch}
        onViewEvent={handleViewEvent}
        onReportProblem={handleReportProblem}
      />

      <Modal show={showEventModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent?.eventName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Event Type</Form.Label>
                <Form.Control plaintext readOnly defaultValue={selectedEvent.eventType || '-'} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control plaintext readOnly defaultValue={selectedEvent.eventDescription || '-'} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control plaintext readOnly defaultValue={new Date(selectedEvent.eventStartDate).toLocaleDateString()} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control plaintext readOnly defaultValue={new Date(selectedEvent.eventEndDate).toLocaleDateString()} />
              </Form.Group>
              {selectedEvent.eventProblemType > 0 && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Problem Type</Form.Label>
                    <Form.Control plaintext readOnly defaultValue={['Low', 'Medium', 'High', 'Critical'][selectedEvent.eventProblemType - 1]} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Problem Description</Form.Label>
                    <Form.Control plaintext readOnly defaultValue={selectedEvent.eventProblemDescription || '-'} />
                  </Form.Group>
                </>
              )}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="warning" onClick={() => handleReportProblem(selectedEvent)}>
            Report Problem
          </Button>
        </Modal.Footer>
      </Modal>

      <ReportProblemModal onProblemReported={fetchEvents} />
    </>
  );
};

export default TeamEventList;
