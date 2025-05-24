import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api'; // Use our configured axios instance
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:3001/auth';

// Check if we have a token in localStorage
const token = localStorage.getItem('token');
let user = null;

// If token exists, decode it to get user info
if (token) {
  try {
    user = jwtDecode(token);
  } catch (error) {
    localStorage.removeItem('token');
  }
}

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Map the email field from the form to officeEmail expected by the backend
      const response = await api.post(`${API_URL}/login`, {
        officeEmail: email, // Send as officeEmail to match backend
        password
      });
      // Store the token in localStorage
      localStorage.setItem('token', response.data.access_token);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(error.response?.data?.message || 'Invalid credentials');
    }
  }
);

// Initial state
const initialState = {
  user: user,
  token: token,
  isAuthenticated: !!token,
  loading: false,
  error: null,
  showReportModal: false,
  selectedEventForReport: null
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setShowReportModal: (state, action) => {
      state.showReportModal = action.payload.show;
      state.selectedEventForReport = action.payload.eventId;
    },
    clearReportModal: (state) => {
      state.showReportModal = false;
      state.selectedEventForReport = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.access_token;
        state.user = {
          id: action.payload.officeId,
          email: action.payload.officeEmail,
          branch: action.payload.officeBranch,
        };
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });
  },
});

export const { logout, clearError, setShowReportModal, clearReportModal } = authSlice.actions;
export default authSlice.reducer;
