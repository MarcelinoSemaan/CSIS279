import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import AddVehicle from './AddVehicle';
import api from '../../utils/api';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVehicles();
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
      console.error('Error fetching vehicles:', error.response || error);
      setAllVehicles([]);
      setVehicles([]);
    } finally {
      setLoading(false);
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

  const handleVehicleAdded = (newVehicle) => {
    fetchVehicles(); // Refresh the list after adding
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
              <th>Driver ID</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(vehicle => (
              <tr key={vehicle.vehicleRegNum}>
                <td>{vehicle.vehicleRegNum}</td>
                <td>{vehicle.vehicleBrand}</td>
                <td>{vehicle.vehicleModel}</td>
                <td>{vehicle.vehicleDriverID || 'Not Assigned'}</td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">No vehicles found</td>
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
    </Container>
  );
};

export default VehicleList;
