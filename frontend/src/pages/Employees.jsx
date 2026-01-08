import { useEffect, useState } from "react";
import {
  Plus,
  Users,
  Phone,
  Briefcase,
  Building2,
  X,
  ChevronDown,
  Loader2,
  IndianRupee,
  Trash2,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  createEmployee,
  deleteEmployee,
  fetchEmployeesByCompany,
} from "../store/slices/employeesSlice";
import { fetchCompanies } from "../store/slices/companiesSlice";
import { showToast } from "../store/slices/toastSlice";

const Employees = () => {
  const { companies } = useAppSelector((state) => state.companies);
  const {
    employees,
    isLoading: employeeLoading,
    error,
    isCreating,
  } = useAppSelector((state) => state.employees);
  const dispatch = useAppDispatch();

  const [selectedCompanyId, setSelectedCompanyId] = useState(
    companies[0]?.id || null
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);

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

  const handleAddEmployee = async (employee) => {
    const newEmployee = {
      company_id: employee.companyId,
      name: employee.name,
      per_day_salary: employee.perDaySalary,
      position: employee.position,
      department: employee.department,
      phone_no: employee.phone,
    };

    // dispatch(createEmployee({ companyId: employee.companyId, data: employee }));
    const response = await dispatch(createEmployee({ data: newEmployee }));
    if (response.meta.requestStatus === "fulfilled") {
      setShowAddModal(false);
      dispatch(
        showToast({
          description: "Employee added successfully!",
          variant: "success",
        })
      );
      setSelectedCompanyId(Number(employee.companyId));
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) return;

    await dispatch(deleteEmployee(employeeId));
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="page-title">Employees</h1>
              <p className="page-subtitle">
                Manage employees across all companies
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-gradient flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Filters */}
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

        {/* Employees Table */}
        <div className="table-container overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Employee
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Company
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Position
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Department
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Per Day Salary
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Contact
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
                  employees.map((employee, index) => (
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
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {employee?.company_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {employee?.position || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {employee?.department || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <IndianRupee className="w-4 h-4" />
                          <span>{employee.per_day_salary ?? 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>{employee?.phone_no || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="inline-flex items-center gap-1 p-2 rounded-lg text-sm
                        text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {employees.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No employees found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or add a new employee
              </p>
            </div>
          )}
        </div>

        {/* Add Employee Modal */}
        {showAddModal && (
          <AddEmployeeModal
            companies={companies}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddEmployee}
            error={error}
            isCreating={isCreating}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

const AddEmployeeModal = ({
  companies,
  onClose,
  onSubmit,
  error,
  isCreating,
}) => {
  const [formData, setFormData] = useState({
    companyId: companies[0]?.id || 0,
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    perDaySalary: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-foreground/50" onClick={onClose} />
      <div className="relative bg-card rounded-2xl p-6 w-full max-w-md shadow-xl animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Add New Employee
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Company
            </label>
            <select
              value={formData.companyId}
              onChange={(e) =>
                setFormData({ ...formData, companyId: Number(e.target.value) })
              }
              required
              className={`input-styled${
                error?.company_id ? "border-red-500 focus:ring-red-500" : ""
              }`}
            >
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            {error?.company_id && (
              <p className="mt-1 text-sm text-red-600">
                {error?.company_id[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter full name"
              required
              className={`input-styled${
                error?.name ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {error?.name && (
              <p className="mt-1 text-sm text-red-600">{error?.name[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setFormData({ ...formData, phone: value });
              }}
              placeholder="+1 555 0100"
              className={`input-styled${
                error?.phone_no ? "border-red-500 focus:ring-red-500" : ""
              }`}
              inputMode="numeric"
              autoComplete="tel"
            />
            {error?.phone_no && (
              <p className="mt-1 text-sm text-red-600">{error?.phone_no[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Position
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              placeholder="e.g., Software Engineer"
              className="input-styled"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              placeholder="e.g., Engineering"
              className="input-styled"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Per Day Salary
            </label>
            <input
              type="number"
              value={formData.perDaySalary}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  perDaySalary: Number(e.target.value),
                })
              }
              placeholder="40000"
              required
              className={`input-styled${
                error?.per_day_salary ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {error?.per_day_salary && (
              <p className="mt-1 text-sm text-red-600">
                {error?.per_day_salary[0]}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-gradient py-3 justify-center flex items-center gap-2 font-medium"
              disabled={isCreating}
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Add Employee"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Employees;
