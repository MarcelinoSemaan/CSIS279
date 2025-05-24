import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faUserPlus, faUsers, faPlus } from '@fortawesome/free-solid-svg-icons';
import api from '../../utils/api';

const TeamsList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamBranch, setNewTeamBranch] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [showMembersModal, setShowMembersModal] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await api.get('/team');
      setTeams(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('Failed to load teams');
      setLoading(false);
    }
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    try {
      await api.post('/team', {
        teamName: newTeamName,
        teamBranch: newTeamBranch
      });
      setShowAddTeamModal(false);
      setNewTeamName('');
      setNewTeamBranch('');
      fetchTeams();
    } catch (error) {
      console.error('Error adding team:', error);
      alert('Failed to add team');
    }
  };

  const handleViewMembers = async (team) => {
    setSelectedTeam(team);
    try {
      const response = await api.get(`/team/${team.teamID}/members`);
      setTeamMembers(response.data);
      setShowMembersModal(true);
    } catch (error) {
      console.error('Error fetching team members:', error);
      alert('Failed to load team members');
    }
  };

  const handleAddMember = (team) => {
    setSelectedTeam(team);
    setShowAddMemberModal(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Teams</h1>
        <Button variant="primary" onClick={() => setShowAddTeamModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Team
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Team Name</th>
            <th>Branch</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teams.map(team => (
            <tr key={team.teamID}>
              <td>{team.teamName}</td>
              <td>{team.teamBranch}</td>
              <td>
                <Button
                  variant="info"
                  className="me-2"
                  onClick={() => handleViewMembers(team)}
                >
                  <FontAwesomeIcon icon={faUsers} className="me-2" />
                  View Members
                </Button>
                <Button
                  variant="success"
                  onClick={() => handleAddMember(team)}
                >
                  <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                  Add Member
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Team Modal */}
      <Modal show={showAddTeamModal} onHide={() => setShowAddTeamModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Team</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddTeam}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Team Name</Form.Label>
              <Form.Control
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Branch</Form.Label>
              <Form.Control
                type="text"
                value={newTeamBranch}
                onChange={(e) => setNewTeamBranch(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddTeamModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Team
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* View Members Modal */}
      <Modal
        show={showMembersModal}
        onHide={() => setShowMembersModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Team Members - {selectedTeam?.teamName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map(member => (
                <tr key={member.memberID}>
                  <td>{member.memberName}</td>
                  <td>{member.memberRole}</td>
                  <td>{member.memberContact}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {teamMembers.length === 0 && (
            <p className="text-center">No members in this team yet.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMembersModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TeamsList;
