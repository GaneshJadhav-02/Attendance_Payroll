export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

// Helper to handle API responses
const handleResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    window.location.href = "/login";

    throw { status: 401, message: "Unauthorized" };
  }

  if (!response.ok) {
    const text = await response.text();
    let errorBody = null;

    try {
      errorBody = text ? JSON.parse(text) : null;
    } catch {
      errorBody = null;
    }

    throw {
      status: response.status,
      ...(errorBody || { message: response.statusText }),
    };
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

// API request helper with auth token
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: token }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleResponse(response);
};

// Auth API Calls
export const authAPI = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/admin/auth/sign_in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
  },

  logout: async () => {
    return apiRequest("/admin/auth/sign_out", { method: "DELETE" });
  },

  getCurrentUser: async () => {
    return apiRequest("/auth/me");
  },
};

// Companies API Calls
export const companiesAPI = {
  getAll: async () => {
    return apiRequest("/admin/companies");
  },

  getById: async (id) => {
    return apiRequest(`/companies/${id}`);
  },

  create: async (data) => {
    return apiRequest("/companies", {
      method: "POST",
      body: JSON.stringify({ company: data }),
    });
  },
};

// Attendance API Calls
export const attendanceAPI = {
  // GET /api/v1/companies/:company_id/attendance?date=YYYY-MM-DD
  getByCompanyAndDate: async (companyId, date) => {
    return apiRequest(`/companies/${companyId}/attendance?date=${date}`);
  },

  // POST /api/v1/employees/:employee_id/attendance
  // Body: { date: string, status: 'present' | 'absent' | 'late' | 'half_day', notes: string }
  markAttendance: async (employeeId, data) => {
    return apiRequest(`/employees/${employeeId}/attendance`, {
      method: "POST",
      body: JSON.stringify({ attendance: data }),
    });
  },

  // PUT /api/v1/attendance/:id
  updateAttendance: async (id, data) => {
    return apiRequest(`/attendance/${id}`, {
      method: "PUT",
      body: JSON.stringify({ attendance: data }),
    });
  },

  // GET /api/v1/employees/:employee_id/attendance/report?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
  // Returns attendance records for download
  getEmployeeReport: async (employeeId, startDate, endDate) => {
    return apiRequest(
      `/employees/${employeeId}/attendance/report?start_date=${startDate}&end_date=${endDate}`
    );
  },

  // GET /api/v1/companies/:company_id/attendance/report?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
  // Returns company-wide attendance report
  getCompanyReport: async (companyId, startDate, endDate) => {
    return apiRequest(
      `/companies/${companyId}/attendance/report?start_date=${startDate}&end_date=${endDate}`
    );
  },
};

// Employees API Calls
export const employeesAPI = {
  getByCompany: async (companyId) => {
    return apiRequest(`/admin/employees?company_id=${parseInt(companyId)}`);
  },

  getAllEmployees: async () => {
    return apiRequest("/admin/employees");
  },

  create: async (data) => {
    return apiRequest("/admin/employees", {
      method: "POST",
      body: JSON.stringify({ ...data }),
    });
  },

  delete: async (id) => {
    return apiRequest(`/admin/employees/${id}`, { method: "DELETE" });
  },

  markAttendance: async (data) => {
    return apiRequest("/admin/employees/mark_present", {
      method: "POST",
      body: JSON.stringify({ ...data }),
    });
  },
};
