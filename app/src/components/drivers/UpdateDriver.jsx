import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import api from '../../utils/api';

const UpdateDriver = ({ show, handleClose, onDriverUpdated, driver }) => {
  const [formData, setFormData] = useState({
    driverName: '',
    driverNumber: '',
    driverRegion: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (driver) {
      setFormData({
        driverName: driver.driverName,
        driverNumber: driver.driverNumber,
        driverRegion: driver.driverRegion
      });
    }
  }, [driver]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put(`/driver/${driver.driverID}`, formData);
      handleClose();
      onDriverUpdated();
    } catch (error) {
      console.error('Error updating driver:', error);
      setError('Failed to update driver. ' + (error.response?.data?.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'driverNumber' ? (value === '' ? '' : parseInt(value, 10)) : value
    }));
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Driver</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Number</Form.Label>
            <Form.Control
              type="number"
              name="driverNumber"
              value={formData.driverNumber}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Region</Form.Label>
            <Form.Control
              type="text"
              name="driverRegion"
              value={formData.driverRegion}
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
            {loading ? 'Updating...' : 'Update Driver'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateDriver;
