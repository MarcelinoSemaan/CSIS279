import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Form, InputGroup, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import AddVehicle from './AddVehicle';
import UpdateVehicle from './UpdateVehicle';
import api from '../../utils/api';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [drivers, setDrivers] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showUpdateVehicle, setShowUpdateVehicle] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await api.get('/vehicle');
      console.log('Vehicles response:', response);

      if (response.data && Array.isArray(response.data)) {
        setAllVehicles(response.data);
        setVehicles(response.data);
      } else if (response.data) {
        const vehiclesData = Array.isArray(response.data) ? response.data : [response.data];
        setAllVehicles(vehiclesData);
        setVehicles(vehiclesData);
      } else {
        console.error('No data received from API');
        setAllVehicles([]);
        setVehicles([]);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setAllVehicles([]);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await api.get('/driver');
      console.log('Drivers response:', response);
      const driversMap = {};
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach(driver => {
          driversMap[driver.driverID] = driver;  // Changed from id to driverID to match backend entity
        });
      }
      setDrivers(driversMap);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setDrivers({});  // Set empty object on error
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setVehicles(allVehicles);
      return;
    }

    const filteredVehicles = allVehicles.filter(vehicle =>
      vehicle.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vehicleRegNum.toString().includes(searchTerm)
    );
    setVehicles(filteredVehicles);
  };

  const getDriverName = (driverId) => {
    if (!driverId) return 'No Driver';
    return drivers[driverId]?.driverName || 'No Driver';
  };

  const getVehicleTypeName = (type) => {
    const types = {
      1: 'Car',
      2: 'Van',
      3: 'Bus'
    };
    return types[type] || 'Unknown';
  };

  const handleVehicleAdded = () => {
    fetchVehicles();
    fetchDrivers();
  };

  const handleUpdateClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowUpdateVehicle(true);
  };

  const handleVehicleUpdated = () => {
    fetchVehicles();
    fetchDrivers();
  };

  const handleDeleteClick = (vehicle) => {
    setVehicleToDelete(vehicle);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return;

    try {
      await api.delete(`/vehicle/${vehicleToDelete.vehicleRegNum}`);
      setShowDeleteModal(false);
      setVehicleToDelete(null);
      fetchVehicles(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      // You could add error handling here (showing an error message)
    }
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Vehicles</h2>
        <div>
          <Button
            variant="primary"
            onClick={() => setShowAddVehicle(true)}
          >
            Add Vehicle
          </Button>
        </div>
      </div>

      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search vehicles..."
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
              <th>Registration Number</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Driver</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(vehicle => (
              <tr key={vehicle.vehicleRegNum}>
                <td>{vehicle.vehicleRegNum}</td>
                <td>{vehicle.vehicleBrand}</td>
                <td>{vehicle.vehicleModel}</td>
                <td>{getVehicleTypeName(vehicle.vehicleType)}</td>
                <td>{vehicle.vehicleCapacity}</td>
                <td>{getDriverName(vehicle.vehicleDriverID)}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpdateClick(vehicle)}
                    className="me-2"
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(vehicle)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-1" />
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">No vehicles found</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <AddVehicle
        show={showAddVehicle}
        handleClose={() => setShowAddVehicle(false)}
        onVehicleAdded={handleVehicleAdded}
      />

      {selectedVehicle && (
        <UpdateVehicle
          show={showUpdateVehicle}
          handleClose={() => {
            setShowUpdateVehicle(false);
            setSelectedVehicle(null);
          }}
          onVehicleUpdated={handleVehicleUpdated}
          vehicle={selectedVehicle}
        />
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {vehicleToDelete && (
            <p>
              Are you sure you want to delete vehicle {vehicleToDelete.vehicleRegNum} ({vehicleToDelete.vehicleBrand} {vehicleToDelete.vehicleModel})?
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

export default VehicleList;
