import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import api from '../../utils/api';

const AddDriver = ({ show, handleClose, onDriverAdded }) => {
  const [formData, setFormData] = useState({
    driverID: '',
    driverName: '',
    driverNumber: '',
    driverRegion: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    if (!formData.driverID) {
      newErrors.driverID = 'Driver ID is required';
    }
    if (!formData.driverName.trim()) {
      newErrors.driverName = 'Driver name is required';
    }
    if (!formData.driverNumber) {
      newErrors.driverNumber = 'Driver number is required';
    }
    if (!formData.driverRegion.trim()) {
      newErrors.driverRegion = 'Driver region is required';
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
        driverID: parseInt(formData.driverID),
        driverName: formData.driverName.trim(),
        driverNumber: parseInt(formData.driverNumber),
        driverRegion: formData.driverRegion.trim()
      };

      console.log('Sending driver data:', payload);

      const response = await api.post('/driver', payload);

      console.log('Response from server:', response);

      if (response.data) {
        onDriverAdded(response.data);
        handleClose();
        // Reset form
        setFormData({
          driverID: '',
          driverName: '',
          driverNumber: '',
          driverRegion: ''
        });
      }
    } catch (error) {
      console.error('Error adding driver:', error.response || error);

      if (error.response?.data?.message) {
        setErrorMessage(`Error: ${error.response.data.message}`);
      } else if (error.response?.status === 409) {
        setErrorMessage('A driver with this ID already exists.');
      } else {
        setErrorMessage('Failed to add driver. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Driver</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {errorMessage && (
            <Alert variant="danger">{errorMessage}</Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Driver ID</Form.Label>
            <Form.Control
              type="number"
              name="driverID"
              value={formData.driverID}
              onChange={handleChange}
              isInvalid={!!errors.driverID}
            />
            <Form.Control.Feedback type="invalid">
              {errors.driverID}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              isInvalid={!!errors.driverName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.driverName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Number</Form.Label>
            <Form.Control
              type="number"
              name="driverNumber"
              value={formData.driverNumber}
              onChange={handleChange}
              isInvalid={!!errors.driverNumber}
            />
            <Form.Control.Feedback type="invalid">
              {errors.driverNumber}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Region</Form.Label>
            <Form.Control
              type="text"
              name="driverRegion"
              value={formData.driverRegion}
              onChange={handleChange}
              isInvalid={!!errors.driverRegion}
            />
            <Form.Control.Feedback type="invalid">
              {errors.driverRegion}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Driver'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddDriver;
