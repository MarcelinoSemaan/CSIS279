import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import api from '../../utils/api';

const UpdateTeam = ({ show, handleClose, onTeamUpdated, team }) => {
  const [formData, setFormData] = useState({
    teamName: '',
    teamBranch: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (team) {
      setFormData({
        teamName: team.teamName || '',
        teamBranch: team.teamBranch || ''
      });
    }
  }, [team]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.put(`/team/${team.teamID}`, formData);
      handleClose();
      onTeamUpdated(response.data);
    } catch (error) {
      console.error('Error updating team:', error);
      setError('Failed to update team. ' + (error.response?.data?.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Team</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Team Name</Form.Label>
            <Form.Control
              type="text"
              name="teamName"
              value={formData.teamName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Branch</Form.Label>
            <Form.Control
              type="text"
              name="teamBranch"
              value={formData.teamBranch}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Team'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateTeam;
