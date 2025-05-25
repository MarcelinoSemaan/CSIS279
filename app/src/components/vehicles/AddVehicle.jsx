import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../utils/api';

const AddVehicle = ({ show, handleClose, onVehicleAdded }) => {
  const [formData, setFormData] = useState({
    vehicleRegNum: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleDriverID: '',
    vehicleType: '',
    vehicleCapacity: ''
  });

  const [errors, setErrors] = useState({});
  const [availableDrivers, setAvailableDrivers] = useState([]);

  useEffect(() => {
    if (show) {
      fetchAvailableDrivers();
    }
  }, [show]);

  const fetchAvailableDrivers = async () => {
    try {
      const response = await api.get('/driver');
      if (response.data) {
        setAvailableDrivers(response.data);
      }
    } catch (error) {
      console.error('Error fetching available drivers:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vehicleRegNum) {
      newErrors.vehicleRegNum = 'Registration number is required';
    }
    if (!formData.vehicleBrand.trim()) {
      newErrors.vehicleBrand = 'Brand is required';
    }
    if (!formData.vehicleModel.trim()) {
      newErrors.vehicleModel = 'Model is required';
    }
    if (!formData.vehicleDriverID) {
      newErrors.vehicleDriverID = 'Driver is required';
    }
    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Vehicle type is required';
    }
    if (!formData.vehicleCapacity) {
      newErrors.vehicleCapacity = 'Vehicle capacity is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await api.post('/vehicle', {
        ...formData,
        vehicleRegNum: parseInt(formData.vehicleRegNum),
        vehicleDriverID: parseInt(formData.vehicleDriverID),
        vehicleType: parseInt(formData.vehicleType),
        vehicleCapacity: parseInt(formData.vehicleCapacity)
      });

      if (response.data) {
        onVehicleAdded(response.data);
        handleClose();
        setFormData({
          vehicleRegNum: '',
          vehicleBrand: '',
          vehicleModel: '',
          vehicleDriverID: '',
          vehicleType: '',
          vehicleCapacity: ''
        });
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
      setErrors({ submit: 'Error adding vehicle. Please try again.' });
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Vehicle</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Registration Number</Form.Label>
            <Form.Control
              type="number"
              name="vehicleRegNum"
              value={formData.vehicleRegNum}
              onChange={handleChange}
              isInvalid={!!errors.vehicleRegNum}
            />
            <Form.Control.Feedback type="invalid">
              {errors.vehicleRegNum}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type="text"
              name="vehicleBrand"
              value={formData.vehicleBrand}
              onChange={handleChange}
              isInvalid={!!errors.vehicleBrand}
            />
            <Form.Control.Feedback type="invalid">
              {errors.vehicleBrand}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Model</Form.Label>
            <Form.Control
              type="text"
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleChange}
              isInvalid={!!errors.vehicleModel}
            />
            <Form.Control.Feedback type="invalid">
              {errors.vehicleModel}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Vehicle Type</Form.Label>
            <Form.Select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              isInvalid={!!errors.vehicleType}
              required
            >
              <option value="">Select a vehicle type</option>
              <option value="1">Car</option>
              <option value="2">Van</option>
              <option value="3">Bus</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.vehicleType}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Vehicle Capacity</Form.Label>
            <Form.Control
              type="number"
              name="vehicleCapacity"
              value={formData.vehicleCapacity}
              onChange={handleChange}
              isInvalid={!!errors.vehicleCapacity}
              required
              min="1"
            />
            <Form.Control.Feedback type="invalid">
              {errors.vehicleCapacity}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Driver</Form.Label>
            <Form.Select
              name="vehicleDriverID"
              value={formData.vehicleDriverID}
              onChange={handleChange}
              isInvalid={!!errors.vehicleDriverID}
              required
            >
              <option value="">Select a driver</option>
              {availableDrivers.map(driver => (
                <option key={driver.driverID} value={driver.driverID}>
                  {driver.driverName} (ID: {driver.driverID})
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.vehicleDriverID}
            </Form.Control.Feedback>
          </Form.Group>

          {availableDrivers.length === 0 && (
            <div className="alert alert-warning">
              No available drivers found. All drivers currently have vehicles assigned.
            </div>
          )}

          {errors.submit && (
            <div className="alert alert-danger">{errors.submit}</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={availableDrivers.length === 0}
          >
            Add Vehicle
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddVehicle;
