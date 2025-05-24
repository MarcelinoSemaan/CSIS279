import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Login.css'; // Reusing the same CSS file for consistent styling

const API_URL = 'http://localhost:3001';

const validationSchema = Yup.object({
  officeID: Yup.number()
    .required('Office ID is required')
    .positive('Office ID must be positive')
    .integer('Office ID must be an integer'),
  officeBranch: Yup.string()
    .required('Office branch is required')
    .min(2, 'Office branch must be at least 2 characters'),
  officePhone: Yup.number()
    .required('Office phone is required')
    .positive('Phone number must be positive'),
  officeEmail: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required')
});

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Remove confirmPassword as it's not needed in the API request
      const { confirmPassword, ...officeData } = values;

      // Send signup request to the backend
      await axios.post(`${API_URL}/office`, officeData);

      // Show success message
      setSuccessMessage('Office registered successfully! You can now log in.');
      resetForm();

      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Registration failed:', err);
      setError(
        err.response?.data?.message ||
        'Registration failed. Please try again later.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Clear error when component unmounts or on route change
  useEffect(() => {
    return () => setError(null);
  }, []);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Office Registration</h2>
          <p>Create a new office account</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        <Formik
          initialValues={{
            officeID: '',
            officeBranch: '',
            officePhone: '',
            officeEmail: '',
            password: '',
            confirmPassword: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="signup-form">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="officeID" className="form-label">Office ID</label>
                  <Field
                    type="number"
                    name="officeID"
                    className="form-control"
                    placeholder="Enter office ID"
                  />
                  <ErrorMessage name="officeID" component="div" className="text-danger" />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="officeBranch" className="form-label">Office Branch</label>
                  <Field
                    type="text"
                    name="officeBranch"
                    className="form-control"
                    placeholder="Enter office branch name"
                  />
                  <ErrorMessage name="officeBranch" component="div" className="text-danger" />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="officePhone" className="form-label">Office Phone</label>
                  <Field
                    type="number"
                    name="officePhone"
                    className="form-control"
                    placeholder="Enter office phone number"
                  />
                  <ErrorMessage name="officePhone" component="div" className="text-danger" />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="officeEmail" className="form-label">Email Address</label>
                  <Field
                    type="email"
                    name="officeEmail"
                    className="form-control"
                    placeholder="office@example.com"
                  />
                  <ErrorMessage name="officeEmail" component="div" className="text-danger" />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-control"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </div>

                <div className="col-md-6 mb-4">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <div className="input-group">
                    <Field
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                </div>
              </div>

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registering...' : 'Register'}
                </button>

                <div className="text-center mt-3">
                  <span>Already have an account? </span>
                  <Link to="/login">Login</Link>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
