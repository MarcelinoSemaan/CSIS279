import React, { useState } from 'react';
import { Table, Button, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import './EventList.css';

const EventList = ({
  title,
  items,
  loading,
  onAddClick,
  entityType,
  onSearch,
  onViewEvent,
  onReportProblem
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const getIdLabel = () => {
    switch (entityType) {
      case 'Team': return 'Team ID';
      case 'Member': return 'Member ID';
      case 'TeamLeader': return 'Leader ID';
      default: return 'ID';
    }
  };

  const getEntityId = (item) => {
    switch (entityType) {
      case 'Team': return item.eventTeamID;
      case 'Member': return item.eventMemberID;
      case 'TeamLeader': return item.eventTeamLeaderID;
      default: return item.eventID;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 1: return 'has-problems-low';
      case 2: return 'has-problems-medium';
      case 3: return 'has-problems-high';
      case 4: return 'has-problems-critical';
      default: return '';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="event-list-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{title}</h2>
        <Button variant="primary" onClick={onAddClick}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Event
        </Button>
      </div>

      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline-secondary" type="submit">
            <FontAwesomeIcon icon={faSearch} />
          </Button>
        </InputGroup>
      </Form>

      {loading ? (
        <div className="text-center p-4">Loading...</div>
      ) : (
        <Table responsive hover>
          <thead>
            <tr>
              <th>{getIdLabel()}</th>
              <th>Event Name</th>
              <th>Event Type</th>
              <th>Problems</th>
              <th>Priority</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr
                key={item.eventID}
                className={item.eventProblemType ? getPriorityClass(item.eventProblemType) : ''}
              >
                <td>{getEntityId(item)}</td>
                <td>{item.eventName}</td>
                <td>{item.eventType || '-'}</td>
                <td>
                  {item.eventProblemType > 0 && (
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className={`text-${item.eventProblemType === 4 ? 'danger' : 'warning'}`}
                      title={item.eventProblemDescription || 'Problem reported'}
                    />
                  )}
                </td>
                <td>
                  {item.eventProblemType > 0 ?
                    ['Low', 'Medium', 'High', 'Critical'][item.eventProblemType - 1] :
                    '-'
                  }
                </td>
                <td>{formatDate(item.eventStartDate)}</td>
                <td>{formatDate(item.eventEndDate)}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => onViewEvent(item)}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => onReportProblem(item)}
                  >
                    Report
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default EventList;
