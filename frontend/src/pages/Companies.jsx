import { useEffect, useState } from "react";
import { Building2, Users, Phone, Mail, X, Loader2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { useAppDispatch, useAppSelector } from "../store/hooks.js";
import { fetchCompanies } from "../store/slices/companiesSlice.js";

const Companies = () => {
  const dispatch = useAppDispatch();
  const { companies, isLoading } = useAppSelector((state) => state.companies);
  const [showAddModal, setShowAddModal] = useState(false);
  const [localCompanies, setLocalCompanies] = useState(companies);

  useEffect(() => {
    const setCompanies = async () => {
      await dispatch(fetchCompanies());
    };

    if (companies.length === 0) {
      setCompanies();
    }
  }, []);

  const handleAddCompany = (company) => {
    const newCompany = {
      ...company,
      id: Date.now(),
      employeeCount: 0,
    };
    setLocalCompanies([...localCompanies, newCompany]);
    setShowAddModal(false);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="page-title">Companies</h1>
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && (
            <div className="col-span-full flex items-center justify-center py-48">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}
          {companies.map((company, index) => (
            <div
              key={company.id}
              className="card-elevated p-6 animate-slide-up hover:border-primary/50 transition-colors cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">
                {company?.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {company?.address}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{company?.phone_number}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{company?.email}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {company?.employeeCount ?? 0} Employees
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isLoading && companies.length === 0 && (
          <div className="text-center py-48">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No companies found
            </h3>
          </div>
        )}

        {/* Add Company Modal */}
        {showAddModal && (
          <AddCompanyModal
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddCompany}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

// Add Company Modal Component
const AddCompanyModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-foreground/50" onClick={onClose} />
      <div className="relative bg-card rounded-2xl p-6 w-full max-w-md shadow-xl animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Add New Company
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
              Company Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter company name"
              required
              className="input-styled"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Enter address"
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
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="contact@company.com"
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
              Add Company
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Companies;
