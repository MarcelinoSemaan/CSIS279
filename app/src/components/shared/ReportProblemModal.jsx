import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { clearReportModal } from '../../store/slices/authSlice';
import api from '../../utils/api';

const ReportProblemModal = ({ onProblemReported }) => {
  const dispatch = useDispatch();
  const { showReportModal, selectedEventForReport } = useSelector(state => state.auth);
  const [problemType, setProblemType] = useState(1);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    dispatch(clearReportModal());
    setProblemType(1);
    setDescription('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEventForReport) {
      console.error('No event selected for reporting');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/event/${selectedEventForReport}/report`, {
        problemType: Number(problemType),
        problemDescription: description
      });

      if (onProblemReported) {
        onProblemReported();
      }
      handleClose();
    } catch (error) {
      console.error('Error reporting problem:', error);
      alert('Failed to submit problem report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={showReportModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Report Problem</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Problem Severity</Form.Label>
            <Form.Select
              value={problemType}
              onChange={(e) => setProblemType(e.target.value)}
              required
            >
              <option value={1}>Low</option>
              <option value={2}>Medium</option>
              <option value={3}>High</option>
              <option value={4}>Critical</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Problem Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ReportProblemModal;
