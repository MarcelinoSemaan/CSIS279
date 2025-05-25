import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Form, InputGroup, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import AddTeam from './AddTeam';
import UpdateTeam from './UpdateTeam';
import api from '../../utils/api';

const TeamsList = () => {
  const [teams, setTeams] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [members, setMembers] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showUpdateTeam, setShowUpdateTeam] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);

  useEffect(() => {
    fetchTeams();
    fetchMembers();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response = await api.get('/team');
      console.log('Teams response:', response);

      if (response.data && Array.isArray(response.data)) {
        setAllTeams(response.data);
        setTeams(response.data);
      } else if (response.data) {
        const teamsData = Array.isArray(response.data) ? response.data : [response.data];
        setAllTeams(teamsData);
        setTeams(teamsData);
      } else {
        console.error('No data received from API');
        setAllTeams([]);
        setTeams([]);
      }
    } catch (error) {
      console.error('Error fetching teams:', error.response || error);
      setAllTeams([]);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await api.get('/member');
      console.log('Members response:', response);
      const membersMap = {};

      if (response.data && Array.isArray(response.data)) {
        response.data.forEach(member => {
          if (member.memberTeamID) {
            if (!membersMap[member.memberTeamID]) {
              membersMap[member.memberTeamID] = [];
            }
            membersMap[member.memberTeamID].push(member);
          }
        });
      }
      setMembers(membersMap);
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembers({});
    }
  };

  const getMemberCount = (teamId) => {
    const teamMembers = members[teamId] || [];
    return teamMembers.length === 0 ? 'No members' : `${teamMembers.length} member${teamMembers.length !== 1 ? 's' : ''}`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setTeams(allTeams);
      return;
    }

    const filteredTeams = allTeams.filter(team =>
      team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.teamBranch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (team.teamID && team.teamID.toString().includes(searchTerm))
    );
    setTeams(filteredTeams);
  };

  const handleUpdateClick = (team) => {
    setSelectedTeam(team);
    setShowUpdateTeam(true);
  };

  const handleDeleteClick = (team) => {
    setTeamToDelete(team);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!teamToDelete) return;

    try {
      await api.delete(`/team/${teamToDelete.teamID}`);
      setShowDeleteModal(false);
      setTeamToDelete(null);
      fetchTeams();
      fetchMembers();
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Failed to delete team: ' + (error.response?.data?.message || 'Please try again.'));
    }
  };

  const handleTeamAdded = () => {
    fetchTeams();
    fetchMembers();
  };

  const handleTeamUpdated = () => {
    fetchTeams();
    fetchMembers();
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Teams</h2>
        <Button
          variant="primary"
          onClick={() => setShowAddTeam(true)}
        >
          Add Team
        </Button>
      </div>

      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search teams..."
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
              <th>ID</th>
              <th>Team Name</th>
              <th>Branch</th>
              <th>Members</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.length > 0 ? (
              teams.map(team => (
                <tr key={team.teamID}>
                  <td>{team.teamID}</td>
                  <td>{team.teamName}</td>
                  <td>{team.teamBranch}</td>
                  <td>{getMemberCount(team.teamID)}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdateClick(team)}
                      className="me-2"
                    >
                      <FontAwesomeIcon icon={faEdit} className="me-1" />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(team)}
                    >
                      <FontAwesomeIcon icon={faTrash} className="me-1" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No teams found</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <AddTeam
        show={showAddTeam}
        handleClose={() => setShowAddTeam(false)}
        onTeamAdded={handleTeamAdded}
      />

      {selectedTeam && (
        <UpdateTeam
          show={showUpdateTeam}
          handleClose={() => {
            setShowUpdateTeam(false);
            setSelectedTeam(null);
          }}
          onTeamUpdated={handleTeamUpdated}
          team={selectedTeam}
        />
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {teamToDelete && (
            <p>
              Are you sure you want to delete team {teamToDelete.teamName} (ID: {teamToDelete.teamID})?
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

export default TeamsList;
