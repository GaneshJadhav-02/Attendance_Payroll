const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

// Helper to handle API responses
const handleResponse = async (response) => {
  if (response.status === 401) {
    // localStorage.removeItem("auth_token");
    // localStorage.removeItem("user");
    // window.location.href = "/login";

    throw {
      status: 401,
      message: "Unauthorized",
    };
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);

    throw {
      status: response.status,
      ...errorBody,
    };
  }
  return response.json();
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

  // POST /api/v1/auth/logout
  logout: async () => {
    return apiRequest("/admin/auth/sign_out", { method: "DELETE" });
  },

  // GET /api/v1/auth/me - Verify token and get current user
  getCurrentUser: async () => {
    return apiRequest("/auth/me");
  },
};

// Companies API Calls
export const companiesAPI = {
  // GET /api/v1/companies
  getAll: async () => {
    return apiRequest("/admin/companies");
  },

  // GET /api/v1/companies/:id
  getById: async (id) => {
    return apiRequest(`/companies/${id}`);
  },

  // POST /api/v1/companies
  // Body: { name: string, address: string, phone: string, email: string }
  create: async (data) => {
    return apiRequest("/companies", {
      method: "POST",
      body: JSON.stringify({ company: data }),
    });
  },

  // PUT /api/v1/companies/:id
  update: async (id, data) => {
    return apiRequest(`/companies/${id}`, {
      method: "PUT",
      body: JSON.stringify({ company: data }),
    });
  },

  // DELETE /api/v1/companies/:id
  delete: async (id) => {
    return apiRequest(`/companies/${id}`, { method: "DELETE" });
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
  // GET /api/v1/companies/:company_id/employees
  getByCompany: async (companyId) => {
    return apiRequest(`/companies/${companyId}/employees`);
  },

  // GET /api/v1/employees/:id
  getById: async (id) => {
    return apiRequest(`/employees/${id}`);
  },

  // POST /api/v1/companies/:company_id/employees
  // Body: { name: string, email: string, phone: string, position: string, department: string }
  create: async (companyId, data) => {
    return apiRequest(`/companies/${companyId}/employees`, {
      method: "POST",
      body: JSON.stringify({ employee: data }),
    });
  },

  // PUT /api/v1/employees/:id
  update: async (id, data) => {
    return apiRequest(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify({ employee: data }),
    });
  },

  // DELETE /api/v1/employees/:id
  delete: async (id) => {
    return apiRequest(`/employees/${id}`, { method: "DELETE" });
  },
};
