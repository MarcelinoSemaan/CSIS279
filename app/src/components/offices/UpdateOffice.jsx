import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import api from '../../utils/api';

const UpdateOffice = ({ show, handleClose, onOfficeUpdated, office }) => {
  const [formData, setFormData] = useState({
    officeBranch: '',
    officePhone: '',
    officeEmail: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (office) {
      setFormData({
        officeBranch: office.officeBranch,
        officePhone: office.officePhone,
        officeEmail: office.officeEmail,
        password: '' // Don't populate the password for security reasons
      });
    }
  }, [office]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Only include password in update if one was provided
      const payload = {
        ...formData,
        officePhone: parseInt(formData.officePhone)
      };

      if (!payload.password) {
        delete payload.password;
      }

      await api.put(`/office/${office.officeID}`, payload);
      handleClose();
      onOfficeUpdated();
    } catch (error) {
      console.error('Error updating office:', error);
      setError('Failed to update office. ' + (error.response?.data?.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'officePhone' ? (value === '' ? '' : value) : value
    }));
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Office</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Branch</Form.Label>
            <Form.Control
              type="text"
              name="officeBranch"
              value={formData.officeBranch}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="number"
              name="officePhone"
              value={formData.officePhone}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="officeEmail"
              value={formData.officeEmail}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password (leave blank to keep current password)</Form.Label>
            <div className="input-group">
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </div>
            <Form.Text className="text-muted">
              Leave blank if you don't want to change the password
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Office'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateOffice;
