import React, { useState, useCallback, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../../utils/api'; // Updated to use our configured axios instance
import { useSelector, useDispatch } from 'react-redux';
import { setShowReportModal } from '../../store/slices/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit, faTrash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './EventCalendar.css';

// Custom hook for event form management
const useEventForm = (initialDate = null) => {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: '',  // Add event type field
    eventStartDate: initialDate ? new Date(initialDate) : new Date(),
    eventEndDate: initialDate ? new Date(initialDate) : new Date(),
    eventDescription: '', // New field for event description
    eventTeamID: null,
    eventOfficeID: 1, // Default value, will be updated from auth context
    eventTeamOfficeID: null
  });

  const handleClose = () => setShow(false);

  const handleShow = (date = null) => {
    if (date) {
      setFormData({
        ...formData,
        eventStartDate: date,
        eventEndDate: date
      });
    }
    setShow(true);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' && value !== '' ? Number(value) : value
    });
  };

  return {
    formData,
    show,
    handleChange,
    handleClose,
    handleShow,
    setFormData
  };
};

const EventCalendar = () => {
  const dispatch = useDispatch();
  const { showReportModal } = useSelector(state => state.auth);

  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reportFormData, setReportFormData] = useState({
    eventID: '',
    problemDescription: '',
    priority: 'medium'
  });
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const {
    formData,
    show,
    handleChange,
    handleClose,
    handleShow,
    setFormData
  } = useEventForm();

  const fetchTeams = useCallback(async () => {
    try {
      const teamsResponse = await api.get('/team');
      console.log('Teams data:', teamsResponse.data);
      setTeams(teamsResponse.data);
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const eventResponse = await api.get('/event');
      console.log('Raw event data:', eventResponse.data);
      const mappedEvents = eventResponse.data.map(event => {
        console.log('Mapping event:', event);
        // Get proper class name based on problem type
        let className = '';
        if (event.eventProblemType) {
          switch (event.eventProblemType) {
            case 1: // low
              className = 'has-problems-low';
              break;
            case 2: // medium
              className = 'has-problems-medium';
              break;
            case 3: // high
              className = 'has-problems-high';
              break;
            case 4: // critical
              className = 'has-problems-critical';
              break;
            default:
              className = '';
          }
        }

        return {
          id: event.eventID,
          title: event.eventName,
          start: new Date(event.eventStartDate),
          end: new Date(event.eventEndDate),
          className,
          extendedProps: {
            description: event.eventDescription || '',
            problemDescription: event.eventProblemDescription || '',
            teamID: event.eventTeamID,
            officeID: event.eventOfficeID,
            problemType: event.eventProblemType,
            teamOfficeID: event.eventTeamOfficeID,
            hasProblems: event.eventProblemType > 0,
            team: event.team // Store the full team object
          }
        };
      });
      console.log('Mapped events:', mappedEvents);
      setEvents(mappedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      await fetchTeams();
      await fetchEvents();
    };
    fetchData();
  }, [fetchTeams, fetchEvents]);

  // Refresh timer
  useEffect(() => {
    const interval = setInterval(() => {
      fetchEvents();
      fetchTeams();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [fetchEvents, fetchTeams]);

  useEffect(() => {
    const fetchTeamOffice = async () => {
      if (!formData.eventTeamID) return;

      try {
        const teamResponse = await api.get(`/team/${formData.eventTeamID}`);
        if (teamResponse.data && teamResponse.data.teamOfficeID) {
          setFormData(prev => ({
            ...prev,
            eventTeamOfficeID: teamResponse.data.teamOfficeID
          }));
        }
      } catch (err) {
        console.error('Error fetching team office:', err);
      }
    };

    fetchTeamOffice();
  }, [formData.eventTeamID, setFormData]);

  useEffect(() => {
    if (selectedEventDetails && selectedEventDetails.teamID && teams.length === 0) {
      fetchTeams();
    }
  }, [selectedEventDetails, teams.length, fetchTeams]);

  useEffect(() => {
    // Check for selected event from list view
    const selectedEventData = sessionStorage.getItem('selectedEvent');
    if (selectedEventData) {
      const event = JSON.parse(selectedEventData);
      setSelectedEventDetails({
        id: event.eventID,
        title: event.eventName,
        start: new Date(event.eventStartDate),
        end: new Date(event.eventEndDate),
        description: event.eventDescription,
        eventType: event.eventType,
        problemDescription: event.eventProblemDescription || '',
        teamID: event.eventTeamID,
        officeID: event.eventOfficeID,
        teamOfficeID: event.eventTeamOfficeID,
        hasProblems: event.eventProblemType > 0
      });
      setSidebarOpen(true);
      sessionStorage.removeItem('selectedEvent');
    }

    // Check for report event request from list view
    const reportEventId = sessionStorage.getItem('reportEventId');
    if (reportEventId) {
      setReportFormData(prev => ({
        ...prev,
        eventID: reportEventId
      }));
      dispatch(setShowReportModal(true));
      sessionStorage.removeItem('reportEventId');
    }
  }, [dispatch]);

  const handleDateClick = useCallback((info) => {
    setIsEditing(false);
    handleShow(info.date);
  }, [handleShow]);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch(`/event/${reportFormData.eventID}/report`, {
        problemDescription: reportFormData.problemDescription,
        priority: reportFormData.priority
      });

      // Clear form data
      setReportFormData({
        eventID: '',
        problemDescription: '',
        priority: 'medium'
      });

      // Close the modal
      dispatch(setShowReportModal(false));

      // Refresh the events data
      await fetchEvents();

      // Clear any existing errors
      setError(null);
    } catch (err) {
      console.error('Error submitting report:', err);
      setError('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const handleReportChange = (e) => {
    const { name, value } = e.target;
    setReportFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEventClick = useCallback((info) => {
    const event = info.event;
    console.log('Clicked event:', event);
    console.log('Event extended props:', event.extendedProps);

    const teamId = event.extendedProps.teamID;
    const team = event.extendedProps.team;
    console.log('Team ID:', teamId, 'Team:', team);

    setSelectedEvent(event);
    setSelectedEventDetails({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end || event.start,
      description: event.extendedProps.description || '',
      problemDescription: event.extendedProps.problemDescription || '',
      teamID: teamId,
      team: team,
      officeID: event.extendedProps.officeID,
      teamOfficeID: event.extendedProps.teamOfficeID,
      hasProblems: event.extendedProps.problemType > 0
    });
    setSidebarOpen(true);
  }, []);

  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedEventDetails(null);
  };

  const startEditing = () => {
    setIsEditing(true);
    setFormData({
      eventName: selectedEventDetails.title,
      eventType: selectedEventDetails.eventType || '',
      eventStartDate: selectedEventDetails.start,
      eventEndDate: selectedEventDetails.end,
      eventDescription: selectedEventDetails.description,
      eventTeamID: selectedEventDetails.teamID,
      eventOfficeID: selectedEventDetails.officeID,
      eventTeamOfficeID: selectedEventDetails.teamOfficeID
    });
    handleShow();
    closeSidebar();
  };

  const handleViewProblems = () => {
    navigate('/problems');
  };

  const formatDateForInput = (date) => {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000))
        .toISOString()
        .substring(0, 16);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Submitting form data:', formData);

    try {
      const eventData = {
        ...(isEditing && selectedEvent ? { eventID: selectedEvent.id } : {}),
        eventName: formData.eventName,
        eventType: formData.eventType,
        eventStartDate: formData.eventStartDate,
        eventEndDate: formData.eventEndDate,
        eventDescription: formData.eventDescription,
        eventTeamID: formData.eventTeamID !== null && formData.eventTeamID !== '' ? Number(formData.eventTeamID) : null,
        eventTeamOfficeID: formData.eventTeamOfficeID
      };

      console.log('Sending event data:', eventData);

      let response;
      if (isEditing && selectedEvent) {
        response = await api.put(`/event/${selectedEvent.id}`, eventData);
      } else {
        response = await api.post('/event', eventData);
      }

      console.log('API response:', response.data);
      handleClose();
      await fetchEvents(); // Fetch fresh data after update
    } catch (err) {
      console.error('Error saving event:', err);
      setError('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) {
      console.error('No event selected for deletion');
      return;
    }

    setLoading(true);
    try {
      await api.delete(`/event/${selectedEvent.id}`);

      const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
      setEvents(updatedEvents);

      setShowDeleteConfirm(false);
      handleClose();
      closeSidebar();

      setError(null);

      await fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(`Failed to delete event: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEventDetails && selectedEventDetails.teamID) {
      const team = teams.find(t => t.teamID === selectedEventDetails.teamID);
      if (!team) {
        api.get(`/team/${selectedEventDetails.teamID}`)
          .then(response => {
            setTeams(prev => [...prev, response.data]);
          })
          .catch(err => console.error('Error fetching team:', err));
      }
    }
  }, [selectedEventDetails, teams]);

  const handleCloseReportModal = () => {
    dispatch(setShowReportModal(false));
  };

  return (
    <div className="event-calendar-container">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className={`calendar-wrapper ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {loading && <div className="text-center p-3">Loading...</div>}

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          allDaySlot={false}
          slotEventOverlap={false}
          eventDisplay="block"
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
          }}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventClassNames={event => {
            // Add null check for extendedProps
            if (event.extendedProps && event.extendedProps.problemType) {
              switch (event.extendedProps.problemType) {
                case 1:
                  return 'has-problems-low';
                case 2:
                  return 'has-problems-medium';
                case 3:
                  return 'has-problems-high';
                case 4:
                  return 'has-problems-critical';
                default:
                  return '';
              }
            }
            return '';
          }}
          eventContent={(eventInfo) => (
            <div className="event-content">
              <div className="event-title">{eventInfo.event.title}</div>
              {eventInfo.event.extendedProps?.problemType > 0 && (
                <div className="event-problem-indicator">⚠️</div>
              )}
            </div>
          )}
        />
      </div>

      <div className={`event-details-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {selectedEventDetails && (
          <>
            <button className="close-sidebar-btn" onClick={closeSidebar}>
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <div className="event-details-content">
              <h3>{selectedEventDetails?.title}</h3>
              <div className="mt-4">
                <p><strong>Start:</strong> {new Date(selectedEventDetails.start).toLocaleString()}</p>
                <p><strong>End:</strong> {new Date(selectedEventDetails.end).toLocaleString()}</p>
                <p>
                  <strong>Team:</strong>{' '}
                  {selectedEventDetails?.team?.teamName || 'Team not available'}
                  {selectedEventDetails?.team && (
                    <span className={`ms-2 badge ${selectedEventDetails.team.teamStatus === 'available' ? 'bg-success' : 'bg-danger'}`}>
                      {selectedEventDetails.team.teamStatus === 'available' ? 'Available' : 'Unavailable'}
                    </span>
                  )}
                </p>

                {/* Regular event description - always show */}
                <div className="mt-3">
                  <p><strong>Event Description:</strong></p>
                  <p className="text-muted">{selectedEventDetails?.description}</p>
                </div>

                {/* Problems section if exists */}
                {selectedEventDetails?.hasProblems && (
                  <div className="alert alert-danger mt-3">
                    <strong>⚠️ Problem Report:</strong>
                    <p className="mb-0 mt-2">{selectedEventDetails.problemDescription}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="event-details-actions">
              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={startEditing}>
                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                  Edit Event
                </button>
                <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)}>
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                  Delete Event
                </button>
              </div>

              {selectedEventDetails.hasProblems && (
                <button
                  onClick={handleViewProblems}
                  className="btn btn-warning w-100 mt-2"
                >
                  <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                  View Problems
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {show && (
        <div className="modal" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEditing ? 'Edit Event' : 'Add Event'}</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Event Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Event Type</label>
                    <input
                      type="text"
                      className="form-control"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      placeholder="e.g., Meeting, Training, Delivery, etc."
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="eventStartDate"
                      value={formatDateForInput(formData.eventStartDate)}
                      onChange={(e) => setFormData({
                        ...formData,
                        eventStartDate: new Date(e.target.value)
                      })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">End Date & Time</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="eventEndDate"
                      value={formatDateForInput(formData.eventEndDate)}
                      onChange={(e) => setFormData({
                        ...formData,
                        eventEndDate: new Date(e.target.value)
                      })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Assign Team</label>
                    <select
                      className="form-select"
                      name="eventTeamID"
                      value={formData.eventTeamID || ''}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a team</option>
                      {teams.map(team => (
                        <option key={team.teamID} value={team.teamID}>
                          {team.teamName}
                        </option>
                      ))}
                    </select>
                    {formData.eventTeamID === null || formData.eventTeamID === '' ? (
                      <div className="text-danger mt-1">Team is required.</div>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Event Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="eventDescription"
                      value={formData.eventDescription || ''}
                      onChange={handleChange}
                      placeholder="Describe the event..."
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  {isEditing && (
                    <button
                      type="button"
                      className="btn btn-danger me-auto"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Delete
                    </button>
                  )}
                  <button type="button" className="btn btn-secondary" onClick={handleClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : isEditing ? 'Update' : 'Add'} Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="modal" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Report a Problem
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseReportModal}
                  disabled={loading}
                ></button>
              </div>
              <form onSubmit={handleReportSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Select Event</label>
                    <select
                      className="form-select"
                      name="eventID"
                      value={reportFormData.eventID}
                      onChange={handleReportChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Select an event</option>
                      {events.map(event => (
                        <option key={event.id} value={event.id}>
                          {event.title} ({new Date(event.start).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      name="priority"
                      value={reportFormData.priority}
                      onChange={handleReportChange}
                      required
                      disabled={loading}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Problem Description</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      name="problemDescription"
                      value={reportFormData.problemDescription}
                      onChange={handleReportChange}
                      placeholder="Describe the problem in detail..."
                      required
                      disabled={loading}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseReportModal}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit Report'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteConfirm(false)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this event?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteEvent} disabled={loading}>
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;

