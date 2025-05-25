import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import api from '../../utils/api';

const AddMember = ({ show, handleClose, onMemberAdded }) => {
  const [formData, setFormData] = useState({
    memberID: '',
    memberName: '',
    memberNumber: '',
    memberTeamID: '',
    memberTeamOfficeID: '',
    memberVehicleRegNum: '',
    memberDriverID: ''
  });

  const [teams, setTeams] = useState([]);
  const [offices, setOffices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch reference data when component mounts
  useEffect(() => {
    if (show) {
      fetchTeams();
      fetchOffices();
      fetchVehicles();
      fetchDrivers();
    }
  }, [show]);

  const fetchTeams = async () => {
    try {
      const response = await api.get('/team');
      setTeams(response.data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchOffices = async () => {
    try {
      const response = await api.get('/office');
      setOffices(response.data || []);
    } catch (error) {
      console.error('Error fetching offices:', error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicle');
      setVehicles(response.data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await api.get('/driver');
      setDrivers(response.data || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

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
    if (!formData.memberID) {
      newErrors.memberID = 'Member ID is required';
    }
    if (!formData.memberName.trim()) {
      newErrors.memberName = 'Member name is required';
    }
    if (!formData.memberNumber) {
      newErrors.memberNumber = 'Member number is required';
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
        memberID: parseInt(formData.memberID),
        memberName: formData.memberName.trim(),
        memberNumber: parseInt(formData.memberNumber),
        memberTeamID: formData.memberTeamID ? parseInt(formData.memberTeamID) : null,
        memberTeamOfficeID: formData.memberTeamOfficeID ? parseInt(formData.memberTeamOfficeID) : null,
        memberVehicleRegNum: formData.memberVehicleRegNum ? parseInt(formData.memberVehicleRegNum) : null,
        memberDriverID: formData.memberDriverID ? parseInt(formData.memberDriverID) : null
      };

      const response = await api.post('/member', payload);

      if (response.data) {
        onMemberAdded(response.data);
        handleClose();
        // Reset form
        setFormData({
          memberID: '',
          memberName: '',
          memberNumber: '',
          memberTeamID: '',
          memberTeamOfficeID: '',
          memberVehicleRegNum: '',
          memberDriverID: ''
        });
      }
    } catch (error) {
      console.error('Error adding member:', error.response || error);

      if (error.response?.data?.message) {
        setErrorMessage(`Error: ${error.response.data.message}`);
      } else {
        setErrorMessage('Failed to add member. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Member</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {errorMessage && (
            <Alert variant="danger">{errorMessage}</Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Member ID*</Form.Label>
            <Form.Control
              type="number"
              name="memberID"
              value={formData.memberID}
              onChange={handleChange}
              isInvalid={!!errors.memberID}
            />
            <Form.Control.Feedback type="invalid">
              {errors.memberID}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Member Name*</Form.Label>
            <Form.Control
              type="text"
              name="memberName"
              value={formData.memberName}
              onChange={handleChange}
              isInvalid={!!errors.memberName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.memberName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Member Number*</Form.Label>
            <Form.Control
              type="number"
              name="memberNumber"
              value={formData.memberNumber}
              onChange={handleChange}
              isInvalid={!!errors.memberNumber}
            />
            <Form.Control.Feedback type="invalid">
              {errors.memberNumber}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Team</Form.Label>
            <Form.Select
              name="memberTeamID"
              value={formData.memberTeamID}
              onChange={handleChange}
            >
              <option value="">Select Team</option>
              {teams.map((team) => (
                <option key={team.teamID} value={team.teamID}>
                  {team.teamName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Team Office</Form.Label>
            <Form.Select
              name="memberTeamOfficeID"
              value={formData.memberTeamOfficeID}
              onChange={handleChange}
            >
              <option value="">Select Office</option>
              {offices.map((office) => (
                <option key={office.officeID} value={office.officeID}>
                  {office.officeName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Vehicle Registration Number</Form.Label>
            <Form.Select
              name="memberVehicleRegNum"
              value={formData.memberVehicleRegNum}
              onChange={handleChange}
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.vehicleRegNum} value={vehicle.vehicleRegNum}>
                  {vehicle.vehicleMake} {vehicle.vehicleModel} ({vehicle.vehicleRegNum})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Driver</Form.Label>
            <Form.Select
              name="memberDriverID"
              value={formData.memberDriverID}
              onChange={handleChange}
            >
              <option value="">Select Driver</option>
              {drivers.map((driver) => (
                <option key={driver.driverID} value={driver.driverID}>
                  {driver.driverName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Member'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddMember;
