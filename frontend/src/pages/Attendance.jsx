import { useEffect, useState } from "react";
import {
  CalendarDays,
  Building2,
  ChevronDown,
  Check,
  X,
  FileBarChart,
  Calendar,
  Loader2,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { useAppDispatch, useAppSelector } from "../store/hooks.js";
import { fetchCompanies } from "../store/slices/companiesSlice.js";
import {
  fetchEmployeesByCompany,
  markAttendance,
  setAttendanceStatus,
} from "../store/slices/employeesSlice.js";
import { API_BASE_URL } from "../services/api.js";
import moment from "moment";

const attendanceStatuses = [
  {
    value: "present",
    label: "Present",
    icon: Check,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    value: "absent",
    label: "Absent",
    icon: X,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
];

const Attendance = () => {
  const { companies } = useAppSelector((state) => state.companies);
  const { employees, isLoading: employeeLoading } = useAppSelector(
    (state) => state.employees
  );
  const dispatch = useAppDispatch();

  const [selectedCompanyId, setSelectedCompanyId] = useState(
    companies[0]?.id || null
  );
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [reportEmployee, setReportEmployee] = useState(null);

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);

  const todayDate = moment().format("YYYY-MM-DD");

  useEffect(() => {
    if (companies.length === 0) {
      dispatch(fetchCompanies());
    }
  }, [companies.length, dispatch]);

  useEffect(() => {
    if (companies.length > 0 && employees.length === 0 && !selectedCompanyId) {
      dispatch(fetchEmployeesByCompany(companies[0].id));
    }
  }, [companies, employees.length, dispatch]);

  useEffect(() => {
    dispatch(fetchEmployeesByCompany(selectedCompanyId));
  }, [selectedCompanyId]);

  const handleMarkAttendance = async (employeeId, status) => {
    if (status === "absent") {
      // 1️⃣ Update Redux
      dispatch(
        setAttendanceStatus({
          employeeId,
          status: "absent",
        })
      );

      localStorage.setItem(`attendance_${todayDate}_${employeeId}`, "absent");
      return;
    }

    if (status === "present") {
      try {
        const data = {
          employee_ids: [employeeId],
          date: todayDate,
          company_id: selectedCompanyId || companies[0]?.id,
        };
        await dispatch(markAttendance(data));

        dispatch(
          setAttendanceStatus({
            employeeId,
            status: "present",
          })
        );
      } catch (error) {
        console.error("Failed to mark present", error);
      }
    }
  };

  const downloadPDF = async (data) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/reports/employee_attendance.xlsx`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data }),
        }
      );
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const downloadCSV = async () => {};

  const getAttendanceStatus = (employee) => {
    if (employee.attendance_status === "present")
      return employee.attendance_status;

    return (
      localStorage.getItem(`attendance_${todayDate}_${employee.id}`) ||
      "not_marked"
    );
  };

  const getStatusInfo = (status) => {
    return (
      attendanceStatuses.find((s) => s.value === status) ||
      attendanceStatuses[0]
    );
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="page-title">Mark Attendance</h1>
              <p className="page-subtitle">
                Record daily attendance for employees
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Company Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
              className="input-styled flex items-center justify-between gap-3 min-w-[200px]"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <span>{selectedCompany?.name || "All Companies"}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showCompanyDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showCompanyDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden">
                {companies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => {
                      setSelectedCompanyId(company.id);
                      setShowCompanyDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-t border-border"
                  >
                    {company.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Attendance List */}
        <div className="table-container">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Employee
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Department
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Current Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {employeeLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      <Loader2 className="w-6 h-6 mx-auto animate-spin text-muted-foreground" />
                    </td>
                  </tr>
                ) : (
                  employees.map((employee, index) => {
                    const attendanceStatus = getAttendanceStatus(employee);
                    const statusInfo =
                      attendanceStatus !== "not_marked"
                        ? getStatusInfo(attendanceStatus)
                        : null;
                    return (
                      <tr
                        key={employee.id}
                        className="border-t border-border hover:bg-muted/30 transition-colors animate-fade-in"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {employee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {employee.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {employee.position}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                            {employee.department}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {statusInfo ? (
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusInfo.bg} ${statusInfo.color} text-sm font-medium `}
                            >
                              <statusInfo.icon className="w-4 h-4" />
                              {statusInfo.label}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Not marked
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {attendanceStatuses.map((status) => (
                              <button
                                key={status.value}
                                onClick={() =>
                                  handleMarkAttendance(
                                    employee.id,
                                    status.value
                                  )
                                }
                                className={`p-2 rounded-lg transition-all ${
                                  attendanceStatus === status.value
                                    ? `${status.bg} ${status.color}`
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                } disabled:cursor-not-allowed disabled:opacity-75`}
                                title={status.label}
                                disabled={attendanceStatus !== "not_marked"}
                              >
                                <status.icon className="w-5 h-5" />
                              </button>
                            ))}
                            <button
                              onClick={() => setReportEmployee(employee)}
                              className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
                              title="Download Report"
                            >
                              <FileBarChart className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!employeeLoading && employees.length === 0 && (
            <div className="text-center py-12">
              <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No employees found
              </h3>
              <p className="text-muted-foreground">
                This company doesn't have any employees yet
              </p>
            </div>
          )}
        </div>

        {/* Report Modal */}
        {reportEmployee && (
          <AttendanceReportModal
            employee={reportEmployee}
            onClose={() => setReportEmployee(null)}
            downloadCSV={downloadCSV}
            downloadPDF={downloadPDF}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

const AttendanceReportModal = ({
  employee,
  onClose,
  downloadPDF,
  downloadCSV,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-foreground/50" onClick={onClose} />

      <div className="relative bg-card rounded-2xl p-6 w-full max-w-md shadow-xl animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            Attendance Report – {employee.name}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-styled pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-styled pl-10"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() =>
                downloadPDF({
                  from_date: startDate,
                  to_date: endDate,
                })
              }
              className="flex-1 btn-gradient"
            >
              Download PDF
            </button>
            <button
              onClick={() =>
                downloadCSV({
                  from_date: startDate,
                  to_date: endDate,
                })
              }
              className="flex-1 btn-gradient"
            >
              Download CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
