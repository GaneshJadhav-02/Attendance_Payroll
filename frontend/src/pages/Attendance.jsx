import { useEffect, useState } from "react";
import {
  CalendarDays,
  Building2,
  ChevronDown,
  Check,
  X,
  FileBarChart,
  Loader2,
  HandCoins,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { useAppDispatch, useAppSelector } from "../store/hooks.js";
import { fetchCompanies } from "../store/slices/companiesSlice.js";
import {
  advanceEmployeePayment,
  fetchEmployeesByCompany,
  markAttendance,
  setAttendanceStatus,
} from "../store/slices/employeesSlice.js";
import { API_BASE_URL } from "../services/api.js";
import moment from "moment";
import AttendanceReportModal from "../components/AttendanceReportModal.jsx";
import AdvancePaymentModal from "../components/AdvancePaymentModal.jsx";
import { showToast } from "../store/slices/toastSlice.js";

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
  const dispatch = useAppDispatch();

  const { companies, isLoading } = useAppSelector((state) => state.companies);
  const {
    employees,
    isLoading: employeeLoading,
    isPaying,
  } = useAppSelector((state) => state.employees);
  const { token } = useAppSelector((state) => state.auth);

  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [reportEmployee, setReportEmployee] = useState(null);
  const [advanceEmployee, setAdvanceEmployee] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);

  const todayDate = moment().format("YYYY-MM-DD");

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);

  useEffect(() => {
    if (companies.length === 0) {
      dispatch(fetchCompanies());
    }
  }, [companies.length, dispatch]);

  useEffect(() => {
    if (companies.length > 0 && !selectedCompanyId) {
      setSelectedCompanyId(companies[0].id);
    }
  }, [companies, selectedCompanyId]);

  useEffect(() => {
    if (selectedCompanyId) {
      dispatch(fetchEmployeesByCompany(selectedCompanyId));
    }
  }, [selectedCompanyId, dispatch]);

  const handleMarkAttendance = async (employeeId, status) => {
    const employee = employees.find((e) => e.id === employeeId);
    const employeeName = employee?.name || "Employee";

    if (status === "absent") {
      dispatch(
        setAttendanceStatus({
          employeeId,
          status: "absent",
        })
      );
      dispatch(
        showToast({
          title: "Attendance Marked Successful",
          description: `Attendance for ${employeeName} has been marked successfully.`,
          variant: "success",
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
        dispatch(
          showToast({
            title: "Attendance Marked Successful",
            description: `Attendance for ${employeeName} has been marked successfully.`,
            variant: "success",
          })
        );
      } catch (error) {
        console.error("Failed to mark present", error);
      }
    }
  };

  const handleAdvancePayment = async (data) => {
    const response = await dispatch(advanceEmployeePayment(data));
    if (response.meta.requestStatus === "fulfilled") {
      const employeeName = advanceEmployee?.name || "Employee";
      setAdvanceEmployee(null);
      dispatch(
        showToast({
          title: "Advance Payment Successful",
          description: `Advance payment for ${employeeName} has been recorded successfully.`,
          variant: "success",
        })
      );
    }
  };

  const downloadPDF = async (data) => {
    setPdfLoading(true);
    const response = await fetch(
      `${API_BASE_URL}/admin/reports/employee_attendance.pdf?employee_id=${reportEmployee.id}&from_date=${data.from_date}&to_date=${data.to_date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
          Authorization: token,
        },
      }
    );

    setPdfLoading(false);

    if (!response.ok) {
      dispatch(
        showToast({
          title: "Error Downloading Report",
          variant: "error",
        })
      );
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `attendance_report_${reportEmployee.name}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    setReportEmployee(null);
    dispatch(
      showToast({
        title: "Attendance Report Downloaded Successfully.",
        variant: "success",
      })
    );
  };

  const downloadCSV = async (data) => {
    setExcelLoading(true);
    const response = await fetch(
      `${API_BASE_URL}/admin/reports/employee_attendance.xlsx?employee_id=${reportEmployee.id}&from_date=${data.from_date}&to_date=${data.to_date}`,
      {
        method: "GET",
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          Authorization: token,
        },
      }
    );
    setExcelLoading(false);

    if (!response.ok) {
      dispatch(
        showToast({
          title: "Error Downloading Report",
          variant: "error",
        })
      );
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `attendance_report_${reportEmployee.name}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    setReportEmployee(null);
    dispatch(
      showToast({
        title: "Attendance Report Downloaded Successfully.",
        variant: "success",
      })
    );
  };

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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="col-span-full flex items-center justify-center py-48">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

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
                            <button
                              onClick={() => setAdvanceEmployee(employee)}
                              className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
                              title="Pay Advance"
                            >
                              <HandCoins className="w-5 h-5" />
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
            pdfLoading={pdfLoading}
            excelLoading={excelLoading}
          />
        )}

        {advanceEmployee && (
          <AdvancePaymentModal
            onClose={() => setAdvanceEmployee(null)}
            employee={advanceEmployee}
            onSubmit={handleAdvancePayment}
            isLoading={isPaying}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
