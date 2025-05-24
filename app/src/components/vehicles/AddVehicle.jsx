import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../utils/api';

const AddVehicle = ({ show, handleClose, onVehicleAdded }) => {
  const [formData, setFormData] = useState({
    vehicleRegNum: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleDriverID: ''
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
    if (!formData.vehicleRegNum) {
      newErrors.vehicleRegNum = 'Registration number is required';
    }
    if (!formData.vehicleBrand.trim()) {
      newErrors.vehicleBrand = 'Brand is required';
    }
    if (!formData.vehicleModel.trim()) {
      newErrors.vehicleModel = 'Model is required';
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
        vehicleDriverID: formData.vehicleDriverID ? parseInt(formData.vehicleDriverID) : null
      });

      if (response.data) {
        onVehicleAdded(response.data);
        handleClose();
        setFormData({
          vehicleRegNum: '',
          vehicleBrand: '',
          vehicleModel: '',
          vehicleDriverID: ''
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
            <Form.Label>Driver ID (Optional)</Form.Label>
            <Form.Control
              type="number"
              name="vehicleDriverID"
              value={formData.vehicleDriverID}
              onChange={handleChange}
            />
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
            Add Vehicle
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddVehicle;
