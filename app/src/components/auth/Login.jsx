import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login, clearError } from '../../store/slices/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Login.css';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [showError, setShowError] = useState(false);
  const [savedEmail, setSavedEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const formikRef = useRef();

  useEffect(() => {
    // Clear any existing errors when the component mounts
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/events/calendar');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 6000); // Increased to 6 seconds (was 3 seconds)
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = (values, { setFieldValue }) => {
    // Save email in case login fails
    setSavedEmail(values.email);

    // Clear any existing errors before attempting login
    dispatch(clearError());
    dispatch(login({ email: values.email, password: values.password }))
      .unwrap()
      .catch(() => {
        // If login fails, only clear the password field
        setFieldValue('password', '', false);
      });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Office Login</h2>
          <p>Enter your credentials to access the dashboard</p>
        </div>

        {showError && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <Formik
          innerRef={formikRef}
          initialValues={{ email: savedEmail || '', password: '' }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <Field
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="office@example.com"
                />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>

              <div className="form-group mb-4">
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

              <button
                type="submit"
                className="btn btn-primary w-100 mb-3"
                disabled={loading || isSubmitting}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className="text-center mt-3">
                <span>Don't have an account? </span>
                <Link to="/signup">Register</Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
