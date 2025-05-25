import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Form, InputGroup, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import AddOffice from './AddOffice';
import UpdateOffice from './UpdateOffice';
import api from '../../utils/api';

const OfficeList = () => {
  const [offices, setOffices] = useState([]);
  const [allOffices, setAllOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddOffice, setShowAddOffice] = useState(false);
  const [showUpdateOffice, setShowUpdateOffice] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [officeToDelete, setOfficeToDelete] = useState(null);
  const [teams, setTeams] = useState({});

  useEffect(() => {
    fetchOffices();
    fetchTeams();
  }, []);

  const fetchOffices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/office');
      console.log('Offices response:', response);

      if (response.data && Array.isArray(response.data)) {
        setAllOffices(response.data);
        setOffices(response.data);
      } else if (response.data) {
        const officesData = Array.isArray(response.data) ? response.data : [response.data];
        setAllOffices(officesData);
        setOffices(officesData);
      } else {
        console.error('No data received from API');
        setAllOffices([]);
        setOffices([]);
      }
    } catch (error) {
      console.error('Error fetching offices:', error.response || error);
      setAllOffices([]);
      setOffices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await api.get('/team');
      console.log('Teams response:', response);
      const teamsMap = {};
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach(team => {
          if (team.teamOfficeID) {
            teamsMap[team.teamOfficeID] = team;
          }
        });
      }
      setTeams(teamsMap);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setTeams({});
    }
  };

  const getAssignedTeam = (officeId) => {
    const team = teams[officeId];
    if (!team) return 'No team assigned';
    return `${team.teamName} (ID: ${team.teamID})`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setOffices(allOffices);
      return;
    }

    const filteredOffices = allOffices.filter(office =>
      office.officeBranch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      office.officeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      office.officeID.toString().includes(searchTerm)
    );
    setOffices(filteredOffices);
  };

  const handleOfficeAdded = () => {
    fetchOffices();
    fetchTeams();
  };

  const handleUpdateClick = (office) => {
    setSelectedOffice(office);
    setShowUpdateOffice(true);
  };

  const handleOfficeUpdated = () => {
    fetchOffices();
    fetchTeams();
  };

  const handleDeleteClick = (office) => {
    setOfficeToDelete(office);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!officeToDelete) return;

    try {
      // Get all teams to check for relationships
      const teamsResponse = await api.get('/team');
      const allTeams = teamsResponse.data || [];

      // Find any teams assigned to this office
      const assignedTeams = allTeams.filter(team =>
        team.teamOfficeID === officeToDelete.officeID
      );

      // Update all assigned teams to remove the office reference
      for (const team of assignedTeams) {
        await api.put(`/team/${team.teamID}`, {
          ...team,
          teamOfficeID: null // Remove office reference
        });
      }

      // Then delete the office
      await api.delete(`/office/${officeToDelete.officeID}`);
      setShowDeleteModal(false);
      setOfficeToDelete(null);
      fetchOffices();
      fetchTeams();
    } catch (error) {
      console.error('Error deleting office:', error);
      alert('Failed to delete office: ' + (error.response?.data?.message || 'Please try again.'));
    }
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Offices</h2>
        <div>
          <Button
            variant="primary"
            onClick={() => setShowAddOffice(true)}
          >
            Add Office
          </Button>
        </div>
      </div>

      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search offices..."
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
              <th>Office ID</th>
              <th>Branch</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Assigned Team</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offices.map(office => (
              <tr key={office.officeID}>
                <td>{office.officeID}</td>
                <td>{office.officeBranch}</td>
                <td>{office.officePhone}</td>
                <td>{office.officeEmail}</td>
                <td>{getAssignedTeam(office.officeID)}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpdateClick(office)}
                    className="me-2"
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(office)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-1" />
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {offices.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">No offices found</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <AddOffice
        show={showAddOffice}
        handleClose={() => setShowAddOffice(false)}
        onOfficeAdded={handleOfficeAdded}
      />

      {selectedOffice && (
        <UpdateOffice
          show={showUpdateOffice}
          handleClose={() => {
            setShowUpdateOffice(false);
            setSelectedOffice(null);
          }}
          onOfficeUpdated={handleOfficeUpdated}
          office={selectedOffice}
        />
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {officeToDelete && (
            <p>
              Are you sure you want to delete office {officeToDelete.officeBranch} (ID: {officeToDelete.officeID})?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OfficeList;
