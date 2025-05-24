import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import AddDriver from './AddDriver';
import api from '../../utils/api';

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async (search = '') => {
    setLoading(true);
    try {
      const response = await api.get('/driver', {
        params: { search }
      });
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDrivers(searchTerm);
  };

  const handleDriverAdded = (newDriver) => {
    fetchDrivers(); // Refresh the list after adding
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
            </tr>
          </thead>
          <tbody>
            {drivers.map(driver => (
              <tr key={driver.driverID}>
                <td>{driver.driverID}</td>
                <td>{driver.driverName}</td>
                <td>{driver.driverNumber}</td>
                <td>{driver.driverRegion}</td>
              </tr>
            ))}
            {drivers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">No drivers found</td>
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
    </Container>
  );
};

export default DriverList;
