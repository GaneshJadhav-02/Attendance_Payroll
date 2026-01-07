import { useState } from "react";
import {
  CalendarDays,
  Building2,
  ChevronDown,
  Check,
  X,
  Clock,
  UserX,
  ChevronLeft,
  ChevronRight,
  FileBarChart,
  Calendar,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { useAppDispatch, useAppSelector } from "../store/hooks.js";

// Demo data
const demoCompanies = [
  {
    id: 1,
    name: "TechCorp Inc.",
    address: "123 Silicon Valley, CA",
    phone: "+1 555-0101",
    email: "contact@techcorp.com",
    employeeCount: 156,
  },
  {
    id: 2,
    name: "StartUp Labs",
    address: "456 Innovation Drive, NY",
    phone: "+1 555-0102",
    email: "hello@startuplabs.io",
    employeeCount: 42,
  },
  {
    id: 3,
    name: "Global Solutions",
    address: "789 Enterprise Blvd, TX",
    phone: "+1 555-0103",
    email: "info@globalsolutions.com",
    employeeCount: 328,
  },
];

const demoEmployees = [
  {
    id: 1,
    companyId: 1,
    name: "John Smith",
    email: "john@techcorp.com",
    phone: "+1 555-1001",
    position: "Software Engineer",
    department: "Engineering",
  },
  {
    id: 2,
    companyId: 1,
    name: "Sarah Johnson",
    email: "sarah@techcorp.com",
    phone: "+1 555-1002",
    position: "Product Manager",
    department: "Product",
  },
  {
    id: 3,
    companyId: 1,
    name: "Mike Brown",
    email: "mike@techcorp.com",
    phone: "+1 555-1003",
    position: "Designer",
    department: "Design",
  },
  {
    id: 4,
    companyId: 1,
    name: "Emily Chen",
    email: "emily@techcorp.com",
    phone: "+1 555-1004",
    position: "Developer",
    department: "Engineering",
  },
  {
    id: 5,
    companyId: 2,
    name: "Alex Wilson",
    email: "alex@startuplabs.io",
    phone: "+1 555-2002",
    position: "Developer",
    department: "Engineering",
  },
  {
    id: 6,
    companyId: 2,
    name: "Lisa Davis",
    email: "lisa@startuplabs.io",
    phone: "+1 555-2001",
    position: "CEO",
    department: "Executive",
  },
];

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
  //   {
  //     value: "late",
  //     label: "Late",
  //     icon: Clock,
  //     color: "text-warning",
  //     bg: "bg-warning/10",
  //   },
  //   {
  //     value: "half_day",
  //     label: "Half Day",
  //     icon: UserX,
  //     color: "text-primary",
  //     bg: "bg-primary/10",
  //   },
];

const Attendance = () => {
  const [reportEmployee, setReportEmployee] = useState(null);

  const dispatch = useAppDispatch();
  const { records } = useAppSelector((state) => state.attendance);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedCompanyId, setSelectedCompanyId] = useState(
    demoCompanies[0].id
  );
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [localRecords, setLocalRecords] = useState(new Map());

  const selectedCompany = demoCompanies.find((c) => c.id === selectedCompanyId);
  const companyEmployees = demoEmployees.filter(
    (e) => e.companyId === selectedCompanyId
  );

  const getAttendanceKey = (employeeId, date) => `${employeeId}-${date}`;

  const getAttendance = (employeeId) => {
    const key = getAttendanceKey(employeeId, selectedDate);
    return localRecords.get(key);
  };

  const handleMarkAttendance = (employeeId, status) => {
    const key = getAttendanceKey(employeeId, selectedDate);
    const employee = demoEmployees.find((e) => e.id === employeeId);

    const record = {
      id: Date.now(),
      employeeId,
      employeeName: employee?.name,
      date: selectedDate,
      status,
    };

    setLocalRecords(new Map(localRecords.set(key, record)));
  };

  const changeDate = (days) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const getStatusInfo = (status) => {
    return (
      attendanceStatuses.find((s) => s.value === status) ||
      attendanceStatuses[0]
    );
  };

  // Calculate stats for the current view
  const presentCount = companyEmployees.filter(
    (e) => getAttendance(e.id)?.status === "present"
  ).length;
  const absentCount = companyEmployees.filter(
    (e) => getAttendance(e.id)?.status === "absent"
  ).length;
  const lateCount = companyEmployees.filter(
    (e) => getAttendance(e.id)?.status === "late"
  ).length;
  const halfDayCount = companyEmployees.filter(
    (e) => getAttendance(e.id)?.status === "half_day"
  ).length;
  const unmarkedCount =
    companyEmployees.length -
    presentCount -
    absentCount -
    lateCount -
    halfDayCount;

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
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Company Selector */}
          <div className="relative">
            <button
              onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
              className="input-styled flex items-center justify-between gap-3 min-w-[250px]"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <span>{selectedCompany?.name || "Select Company"}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showCompanyDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showCompanyDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden">
                {demoCompanies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => {
                      setSelectedCompanyId(company.id);
                      setShowCompanyDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center justify-between ${
                      company.id === selectedCompanyId ? "bg-muted" : ""
                    }`}
                  >
                    <span>{company.name}</span>
                    {company.id === selectedCompanyId && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Selector */}
          {/* <div className="flex items-center gap-2">
            <button
              onClick={() => changeDate(-1)}
              className="p-3 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-card">
              <CalendarDays className="w-5 h-5 text-primary" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-foreground"
              />
            </div>

            <button
              onClick={() => changeDate(1)}
              className="p-3 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div> */}
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
          <div className="stat-card text-center">
            <p className="text-2xl font-bold text-success">{presentCount}</p>
            <p className="text-sm text-muted-foreground">Present</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-2xl font-bold text-destructive">{absentCount}</p>
            <p className="text-sm text-muted-foreground">Absent</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-2xl font-bold text-warning">{lateCount}</p>
            <p className="text-sm text-muted-foreground">Late</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-2xl font-bold text-primary">{halfDayCount}</p>
            <p className="text-sm text-muted-foreground">Half Day</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-2xl font-bold text-muted-foreground">
              {unmarkedCount}
            </p>
            <p className="text-sm text-muted-foreground">Unmarked</p>
          </div>
        </div> */}

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
                    Mark Attendance
                  </th>
                </tr>
              </thead>
              <tbody>
                {companyEmployees.map((employee, index) => {
                  const attendance = getAttendance(employee.id);
                  const statusInfo = attendance
                    ? getStatusInfo(attendance.status)
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
                                handleMarkAttendance(employee.id, status.value)
                              }
                              className={`p-2 rounded-lg transition-all ${
                                attendance?.status === status.value
                                  ? `${status.bg} ${status.color}`
                                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
                              } disabled:cursor-not-allowed disabled:opacity-75`}
                              title={status.label}
                              disabled={attendance?.status}
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
                })}
              </tbody>
            </table>
          </div>

          {companyEmployees.length === 0 && (
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
          />
        )}
      </div>
    </DashboardLayout>
  );
};

const AttendanceReportModal = ({ employee, onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const downloadCSV = () => {
    if (!startDate || !endDate) return;

    const rows = [
      ["Employee", "Date", "Status"],
      [employee.name, startDate, "Present"],
      [employee.name, endDate, "Absent"],
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${employee.name}-attendance.csv`;
    link.click();

    URL.revokeObjectURL(url);
    onClose();
  };

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
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border rounded-lg"
            >
              Cancel
            </button>
            <button onClick={downloadCSV} className="flex-1 btn-gradient">
              Download CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
