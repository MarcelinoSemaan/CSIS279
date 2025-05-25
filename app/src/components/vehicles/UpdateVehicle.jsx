import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import api from '../../utils/api';

const UpdateVehicle = ({ show, handleClose, onVehicleUpdated, vehicle }) => {
  const [formData, setFormData] = useState({
    vehicleBrand: '',
    vehicleModel: '',
    vehicleType: 1,
    vehicleCapacity: '',
    vehicleDriverID: ''
  });
  const [drivers, setDrivers] = useState([]);
  const [assignedVehicles, setAssignedVehicles] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vehicleBrand: vehicle.vehicleBrand,
        vehicleModel: vehicle.vehicleModel,
        vehicleType: vehicle.vehicleType,
        vehicleCapacity: vehicle.vehicleCapacity,
        vehicleDriverID: vehicle.vehicleDriverID
      });
    }
    fetchDrivers();
    fetchVehiclesWithDrivers();
  }, [vehicle]);

  const fetchDrivers = async () => {
    try {
      const response = await api.get('/driver');
      if (response.data) {
        setDrivers(response.data);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setError('Failed to load drivers');
    }
  };

  // Fetch all vehicles to check driver assignments
  const fetchVehiclesWithDrivers = async () => {
    try {
      const response = await api.get('/vehicle');
      if (response.data) {
        // Create a mapping of driverID to assigned vehicleRegNum
        const driverAssignments = {};
        response.data.forEach(v => {
          if (v.vehicleDriverID && v.vehicleRegNum !== vehicle?.vehicleRegNum) {
            driverAssignments[v.vehicleDriverID] = v.vehicleRegNum;
          }
        });
        setAssignedVehicles(driverAssignments);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put(`/vehicle/${vehicle.vehicleRegNum}`, formData);
      handleClose();
      onVehicleUpdated();
    } catch (error) {
      console.error('Error updating vehicle:', error);

      if (error.response?.status === 409) {
        // For 409 Conflict (driver already assigned)
        setError(`${error.response?.data?.message || 'Driver is already assigned to another vehicle.'} You can try again to automatically reassign the driver.`);
      } else {
        setError('Failed to update vehicle. ' + (error.response?.data?.message || 'Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For driver selection, show warning if driver is already assigned
    if (name === 'vehicleDriverID' && value) {
      const driverId = parseInt(value, 10);
      if (assignedVehicles[driverId]) {
        setWarningMessage(`This driver is already assigned to vehicle ${assignedVehicles[driverId]}. Proceeding will reassign the driver to this vehicle.`);
      } else {
        setWarningMessage('');
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === 'vehicleType' || name === 'vehicleCapacity' || name === 'vehicleDriverID'
        ? value === '' ? '' : parseInt(value, 10)
        : value
    }));
  };

  // Find driver name by ID
  const getDriverNameById = (id) => {
    const driver = drivers.find(d => d.driverID === id);
    return driver ? driver.driverName : 'Unknown';
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Vehicle</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          {warningMessage && <Alert variant="warning">{warningMessage}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type="text"
              name="vehicleBrand"
              value={formData.vehicleBrand}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Model</Form.Label>
            <Form.Control
              type="text"
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              required
            >
              <option value={1}>Car</option>
              <option value={2}>Van</option>
              <option value={3}>Bus</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Capacity</Form.Label>
            <Form.Control
              type="number"
              name="vehicleCapacity"
              value={formData.vehicleCapacity}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Driver</Form.Label>
            <Form.Select
              name="vehicleDriverID"
              value={formData.vehicleDriverID || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select a driver</option>
              {drivers.map(driver => (
                <option key={driver.driverID} value={driver.driverID}>
                  {driver.driverName}
                  {assignedVehicles[driver.driverID] && assignedVehicles[driver.driverID] !== vehicle?.vehicleRegNum ?
                    ` (currently assigned to vehicle ${assignedVehicles[driver.driverID]})` : ''}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            title={warningMessage ? "This will reassign the driver from another vehicle" : ""}
          >
            {loading ? 'Updating...' : warningMessage ? 'Update & Reassign Driver' : 'Update Vehicle'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateVehicle;
