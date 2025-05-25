import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import api from '../../utils/api';

const AddTeam = ({ show, handleClose, onTeamAdded }) => {
  const [formData, setFormData] = useState({
    teamName: '',
    teamBranch: '',
    teamLeader: ''
  });

  const [members, setMembers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch members for the dropdown when component mounts
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await api.get('/member');
        setMembers(response.data || []);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    if (show) {
      fetchMembers();
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear specific field error when the user makes changes
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.teamName.trim()) {
      newErrors.teamName = 'Team name is required';
    }
    if (!formData.teamBranch.trim()) {
      newErrors.teamBranch = 'Branch name is required';
    }
    if (!formData.teamLeader) {
      newErrors.teamLeader = 'Team leader is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const payload = {
        teamName: formData.teamName.trim(),
        teamBranch: formData.teamBranch.trim(),
        teamLeader: formData.teamLeader
      };

      const response = await api.post('/team', payload);

      if (response.data) {
        onTeamAdded(response.data);
        handleClose();
        // Reset form
        setFormData({
          teamName: '',
          teamBranch: '',
          teamLeader: ''
        });
      }
    } catch (error) {
      console.error('Error adding team:', error.response || error);

      if (error.response?.data?.message) {
        setErrorMessage(`Error: ${error.response.data.message}`);
      } else {
        setErrorMessage('Failed to add team. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Team</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {errorMessage && (
            <Alert variant="danger">{errorMessage}</Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Team Name</Form.Label>
            <Form.Control
              type="text"
              name="teamName"
              value={formData.teamName}
              onChange={handleChange}
              isInvalid={!!errors.teamName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.teamName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Branch</Form.Label>
            <Form.Control
              type="text"
              name="teamBranch"
              value={formData.teamBranch}
              onChange={handleChange}
              isInvalid={!!errors.teamBranch}
            />
            <Form.Control.Feedback type="invalid">
              {errors.teamBranch}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Team Leader</Form.Label>
            <Form.Select
              name="teamLeader"
              value={formData.teamLeader}
              onChange={handleChange}
              isInvalid={!!errors.teamLeader}
            >
              <option value="">Select Team Leader</option>
              {members.map((member) => (
                <option key={member.memberID} value={member.memberName}>
                  {member.memberName}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.teamLeader}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Team'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddTeam;
