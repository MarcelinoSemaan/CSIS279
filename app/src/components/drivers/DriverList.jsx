import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Form, InputGroup, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import AddDriver from './AddDriver';
import UpdateDriver from './UpdateDriver';
import api from '../../utils/api';

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);
  const [vehicles, setVehicles] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [showUpdateDriver, setShowUpdateDriver] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);

  useEffect(() => {
    fetchDrivers();
    fetchVehicles();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/driver');
      console.log('Drivers response:', response);

      if (response.data && Array.isArray(response.data)) {
        setAllDrivers(response.data);
        setDrivers(response.data);
      } else if (response.data) {
        const driversData = Array.isArray(response.data) ? response.data : [response.data];
        setAllDrivers(driversData);
        setDrivers(driversData);
      } else {
        console.error('No data received from API');
        setAllDrivers([]);
        setDrivers([]);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error.response || error);
      setAllDrivers([]);
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicle');
      console.log('Vehicles response:', response);
      const vehiclesMap = {};
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach(vehicle => {
          if (vehicle.vehicleDriverID) {
            vehiclesMap[vehicle.vehicleDriverID] = vehicle;
          }
        });
      }
      setVehicles(vehiclesMap);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setVehicles({});
    }
  };

  const getAssignedVehicle = (driverId) => {
    const vehicle = vehicles[driverId];
    if (!vehicle) return 'No vehicle assigned';
    return `${vehicle.vehicleBrand} ${vehicle.vehicleModel} (${vehicle.vehicleRegNum})`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setDrivers(allDrivers);
      return;
    }

    const filteredDrivers = allDrivers.filter(driver =>
      driver.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.driverRegion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.driverNumber.toString().includes(searchTerm)
    );
    setDrivers(filteredDrivers);
  };

  const handleDriverAdded = (newDriver) => {
    fetchDrivers();
    fetchVehicles();
  };

  const handleUpdateClick = (driver) => {
    setSelectedDriver(driver);
    setShowUpdateDriver(true);
  };

  const handleDriverUpdated = () => {
    fetchDrivers();
    fetchVehicles();
  };

  const handleDeleteClick = (driver) => {
    setDriverToDelete(driver);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!driverToDelete) return;

    try {
      // Get all vehicles (not just the ones in our current state)
      const vehiclesResponse = await api.get('/vehicle');
      const allVehicles = vehiclesResponse.data || [];

      // Find any vehicles assigned to this driver
      const assignedVehicles = allVehicles.filter(vehicle =>
        vehicle.vehicleDriverID === driverToDelete.driverID
      );

      // Update all assigned vehicles to remove the driver reference
      for (const vehicle of assignedVehicles) {
        await api.put(`/vehicle/${vehicle.vehicleRegNum}`, {
          ...vehicle,
          vehicleDriverID: null // Completely remove driver reference
        });
      }

      // Then delete the driver
      await api.delete(`/driver/${driverToDelete.driverID}`);
      setShowDeleteModal(false);
      setDriverToDelete(null);
      fetchDrivers();
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting driver:', error);
      alert('Failed to delete driver: ' + (error.response?.data?.message || 'Please try again.'));
    }
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Drivers</h2>
        <div>
          <Button
            variant="primary"
            onClick={() => setShowAddDriver(true)}
          >
            Add Driver
          </Button>
        </div>
      </div>

      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search drivers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline-secondary" type="submit">
            <FontAwesomeIcon icon={faSearch} />
          </Button>
        </InputGroup>
      </Form>

      {loading ? (
        <div className="text-center p-4">Loading...</div>
      ) : (
        <Table responsive hover>
          <thead>
            <tr>
              <th>Driver ID</th>
              <th>Name</th>
              <th>Number</th>
              <th>Region</th>
              <th>Assigned Vehicle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(driver => (
              <tr key={driver.driverID}>
                <td>{driver.driverID}</td>
                <td>{driver.driverName}</td>
                <td>{driver.driverNumber}</td>
                <td>{driver.driverRegion}</td>
                <td>{getAssignedVehicle(driver.driverID)}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpdateClick(driver)}
                    className="me-2"
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(driver)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-1" />
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {drivers.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">No drivers found</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <AddDriver
        show={showAddDriver}
        handleClose={() => setShowAddDriver(false)}
        onDriverAdded={handleDriverAdded}
      />

      {selectedDriver && (
        <UpdateDriver
          show={showUpdateDriver}
          handleClose={() => {
            setShowUpdateDriver(false);
            setSelectedDriver(null);
          }}
          onDriverUpdated={handleDriverUpdated}
          driver={selectedDriver}
        />
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {driverToDelete && (
            <p>
              Are you sure you want to delete driver {driverToDelete.driverName} (ID: {driverToDelete.driverID})?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DriverList;
