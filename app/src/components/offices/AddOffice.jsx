import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import api from '../../utils/api';

const AddOffice = ({ show, handleClose, onOfficeAdded }) => {
  const [formData, setFormData] = useState({
    officeID: '',
    officeBranch: '',
    officePhone: '',
    officeEmail: '',
    password: ''
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
    if (!formData.officeID) {
      newErrors.officeID = 'Office ID is required';
    }
    if (!formData.officeBranch.trim()) {
      newErrors.officeBranch = 'Branch name is required';
    }
    if (!formData.officePhone) {
      newErrors.officePhone = 'Phone number is required';
    }
    if (!formData.officeEmail.trim()) {
      newErrors.officeEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.officeEmail)) {
      newErrors.officeEmail = 'Email is invalid';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
        officeID: parseInt(formData.officeID),
        officeBranch: formData.officeBranch.trim(),
        officePhone: parseInt(formData.officePhone),
        officeEmail: formData.officeEmail.trim(),
        password: formData.password
      };

      console.log('Sending office data:', payload);

      const response = await api.post('/office', payload);

      console.log('Response from server:', response);

      if (response.data) {
        onOfficeAdded(response.data);
        handleClose();
        // Reset form
        setFormData({
          officeID: '',
          officeBranch: '',
          officePhone: '',
          officeEmail: '',
          password: ''
        });
      }
    } catch (error) {
      console.error('Error adding office:', error.response || error);

      if (error.response?.data?.message) {
        setErrorMessage(`Error: ${error.response.data.message}`);
      } else if (error.response?.status === 409) {
        setErrorMessage('An office with this ID already exists.');
      } else {
        setErrorMessage('Failed to add office. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Office</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {errorMessage && (
            <Alert variant="danger">{errorMessage}</Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Office ID</Form.Label>
            <Form.Control
              type="number"
              name="officeID"
              value={formData.officeID}
              onChange={handleChange}
              isInvalid={!!errors.officeID}
            />
            <Form.Control.Feedback type="invalid">
              {errors.officeID}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Branch</Form.Label>
            <Form.Control
              type="text"
              name="officeBranch"
              value={formData.officeBranch}
              onChange={handleChange}
              isInvalid={!!errors.officeBranch}
            />
            <Form.Control.Feedback type="invalid">
              {errors.officeBranch}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="number"
              name="officePhone"
              value={formData.officePhone}
              onChange={handleChange}
              isInvalid={!!errors.officePhone}
            />
            <Form.Control.Feedback type="invalid">
              {errors.officePhone}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="officeEmail"
              value={formData.officeEmail}
              onChange={handleChange}
              isInvalid={!!errors.officeEmail}
            />
            <Form.Control.Feedback type="invalid">
              {errors.officeEmail}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Office'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddOffice;
