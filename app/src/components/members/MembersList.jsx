import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Form, InputGroup, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import AddMember from './AddMember';
import api from '../../utils/api';

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/member');
      console.log('Members response:', response);

      if (response.data && Array.isArray(response.data)) {
        setAllMembers(response.data);
        setMembers(response.data);
      } else if (response.data) {
        const membersData = Array.isArray(response.data) ? response.data : [response.data];
        setAllMembers(membersData);
        setMembers(membersData);
      } else {
        console.error('No data received from API');
        setAllMembers([]);
        setMembers([]);
      }
    } catch (error) {
      console.error('Error fetching members:', error.response || error);
      setAllMembers([]);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setMembers(allMembers);
      return;
    }

    const filteredMembers = allMembers.filter(member =>
      member.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.memberID && member.memberID.toString().includes(searchTerm))
    );
    setMembers(filteredMembers);
  };

  const handleDeleteClick = (member) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;

    try {
      await api.delete(`/member/${memberToDelete.memberID}`);
      setShowDeleteModal(false);
      setMemberToDelete(null);
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error.response || error);
      // Handle error
    }
  };

  const handleMemberAdded = (newMember) => {
    setAllMembers([...allMembers, newMember]);
    setMembers([...members, newMember]);
  };

  const getTeamName = (member) => {
    if (!member.memberTeamID) return 'No Team';
    return member.team ? member.team.teamName : `Team ID: ${member.memberTeamID}`;
  };

  return (
    <Container fluid className="py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Members</h2>
        <Button variant="success" onClick={() => setShowAddMember(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Member
        </Button>
      </div>

      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="primary" type="submit">
            <FontAwesomeIcon icon={faSearch} className="me-1" /> Search
          </Button>
        </InputGroup>
      </Form>

      {loading ? (
        <div className="text-center py-5">Loading members...</div>
      ) : members.length === 0 ? (
        <div className="text-center py-5">No members found.</div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Team</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.memberID}>
                <td>{member.memberID}</td>
                <td>{member.memberName}</td>
                <td>{getTeamName(member)}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(member)}
                    className="ms-2"
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{' '}
          {memberToDelete ? `member "${memberToDelete.memberName}"` : 'this member'}?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Member Modal */}
      <AddMember
        show={showAddMember}
        handleClose={() => setShowAddMember(false)}
        onMemberAdded={handleMemberAdded}
      />
    </Container>
  );
};

export default MembersList;
