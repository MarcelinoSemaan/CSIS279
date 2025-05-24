import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Modal } from 'react-bootstrap';

const AddMember = ({ show, handleClose, onMemberAdded }) => {
  const [formData, setFormData] = useState({
    memberID: '',
    memberVehicleRegNum: '',
    memberDriverID: '',
    memberTeamID: '',
    memberTeamOfficeID: '',
    memberName: '',
    memberNumber: ''
  });

  const [teams, setTeams] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    // Fetch teams, vehicles, and drivers for dropdowns
    const fetchData = async () => {
      try {
        const [teamsRes, vehiclesRes, driversRes] = await Promise.all([
          axios.get('http://localhost:3000/team'),
          axios.get('http://localhost:3000/vehicle'),
          axios.get('http://localhost:3000/driver')
        ]);
        setTeams(teamsRes.data);
        setVehicles(vehiclesRes.data);
        setDrivers(driversRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If team is selected, update the office ID
    if (name === 'memberTeamID') {
      const selectedTeam = teams.find(team => team.teamID === parseInt(value));
      if (selectedTeam) {
        setFormData(prev => ({
          ...prev,
          memberTeamOfficeID: selectedTeam.teamOfficeID
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/member', formData);
      if (response.status === 201) {
        onMemberAdded(response.data);
        handleClose();
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Member ID</Form.Label>
            <Form.Control
              type="number"
              name="memberID"
              value={formData.memberID}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Member Name</Form.Label>
            <Form.Control
              type="text"
              name="memberName"
              value={formData.memberName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Member Number</Form.Label>
            <Form.Control
              type="number"
              name="memberNumber"
              value={formData.memberNumber}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Team</Form.Label>
            <Form.Select
              name="memberTeamID"
              value={formData.memberTeamID}
              onChange={handleChange}
              required
            >
              <option value="">Select Team</option>
              {teams.map(team => (
                <option key={team.teamID} value={team.teamID}>
                  {team.teamName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Vehicle</Form.Label>
            <Form.Select
              name="memberVehicleRegNum"
              value={formData.memberVehicleRegNum}
              onChange={handleChange}
              required
            >
              <option value="">Select Vehicle</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.vehicleRegNum} value={vehicle.vehicleRegNum}>
                  {vehicle.vehicleModel} - {vehicle.vehicleRegNum}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Driver ID</Form.Label>
            <Form.Select
              name="memberDriverID"
              value={formData.memberDriverID}
              onChange={handleChange}
              required
            >
              <option value="">Select Driver</option>
              {drivers.map(driver => (
                <option key={driver.driverID} value={driver.driverID}>
                  {driver.driverName} - {driver.driverID}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Add Member
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddMember;
