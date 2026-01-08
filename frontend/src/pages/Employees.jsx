import { useState } from "react";
import {
  Plus,
  Search,
  Users,
  Phone,
  Mail,
  Briefcase,
  Building2,
  X,
  ChevronDown,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

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
    perDaySalary: 500,
    phoneNumber: "+1 555-1001",
    position: "Software Engineer",
    department: "Engineering",
  },
  {
    id: 2,
    companyId: 1,
    name: "Sarah Johnson",
    perDaySalary: 600,
    phoneNumber: "+1 555-1002",
    position: "Product Manager",
    department: "Product",
  },
  {
    id: 3,
    companyId: 1,
    name: "Mike Brown",
    perDaySalary: 450,
    phoneNumber: "+1 555-1003",
    position: "Designer",
    department: "Design",
  },
  {
    id: 4,
    companyId: 2,
    name: "Emily Davis",
    perDaySalary: 800,
    phoneNumber: "+1 555-2001",
    position: "CEO",
    department: "Executive",
  },
  {
    id: 5,
    companyId: 2,
    name: "Alex Wilson",
    perDaySalary: 480,
    phoneNumber: "+1 555-2002",
    position: "Developer",
    department: "Engineering",
  },
  {
    id: 6,
    companyId: 3,
    name: "Lisa Anderson",
    perDaySalary: 550,
    phoneNumber: "+1 555-3001",
    position: "HR Manager",
    department: "Human Resources",
  },
];

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [localEmployees, setLocalEmployees] = useState(demoEmployees);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  const filteredEmployees = localEmployees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany = selectedCompanyId
      ? employee.companyId === selectedCompanyId
      : true;
    return matchesSearch && matchesCompany;
  });

  const selectedCompany = demoCompanies.find((c) => c.id === selectedCompanyId);

  const handleAddEmployee = (employee) => {
    const newEmployee = {
      ...employee,
      id: Date.now(),
    };
    setLocalEmployees([...localEmployees, newEmployee]);
    setShowAddModal(false);

    // In production, call API:
    // dispatch(createEmployee({ companyId: employee.companyId, data: employee }));
  };

  const getCompanyName = (companyId) => {
    return demoCompanies.find((c) => c.id === companyId)?.name || "Unknown";
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
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-styled pl-11"
            />
          </div>

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
                <button
                  onClick={() => {
                    setSelectedCompanyId(null);
                    setShowCompanyDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-muted transition-colors"
                >
                  All Companies
                </button>
                {demoCompanies.map((company) => (
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
                {filteredEmployees.map((employee, index) => (
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
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {getCompanyName(employee.companyId)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {employee.position}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {employee.department}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{employee.phone}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEmployees.length === 0 && (
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
            companies={demoCompanies}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddEmployee}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

const AddEmployeeModal = ({ companies, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    companyId: companies[0]?.id || 0,
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
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
              className="input-styled"
            >
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
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
              className="input-styled"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="employee@company.com"
              required
              className="input-styled"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+1 555-0100"
              required
              className="input-styled"
            />
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
              required
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
              required
              className="input-styled"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-gradient py-3">
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Employees;
