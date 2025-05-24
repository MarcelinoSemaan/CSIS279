import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../utils/api';

const AddDriver = ({ show, handleClose, onDriverAdded }) => {
  const [formData, setFormData] = useState({
    driverID: '',
    driverName: '',
    driverNumber: '',
    driverRegion: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
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

    try {
      const response = await api.post('/driver', {
        ...formData,
        driverID: parseInt(formData.driverID),
        driverNumber: parseInt(formData.driverNumber)
      });

      if (response.data) {
        onDriverAdded(response.data);
        handleClose();
        setFormData({
          driverID: '',
          driverName: '',
          driverNumber: '',
          driverRegion: ''
        });
      }
    } catch (error) {
      console.error('Error adding driver:', error);
      setErrors({ submit: 'Error adding driver. Please try again.' });
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Driver</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
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
            <Form.Label>Driver Name</Form.Label>
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
            <Form.Label>Driver Number</Form.Label>
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

          {errors.submit && (
            <div className="alert alert-danger">{errors.submit}</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Add Driver
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddDriver;
