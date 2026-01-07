import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarCheck,
  FileBarChart,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Wallet,
  Loader2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks.js";
import { logoutUser } from "../store/slices/authSlice.js";

const navItems = [
  { path: "/companies", label: "Companies", icon: Building2 },
  { path: "/employees", label: "Employees", icon: Users },
  { path: "/attendance", label: "Attendance", icon: CalendarCheck },
  {
    path: "/salary-records",
    label: "Employee Salary Records",
    icon: Wallet,
  },
  //   { path: "/reports", label: "Reports", icon: FileBarChart },
];

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex flex-col bg-sidebar-background transition-all duration-300 h-screen ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {sidebarOpen && (
            <span className="text-xl font-bold text-sidebar-foreground animate-fade-in">
              Payroll
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-sidebar-background-accent text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors"
          >
            <ChevronRight
              className={`w-5 h-5 transition-transform ${
                sidebarOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "sidebar-item-active" : ""} ${
                  !sidebarOpen ? "justify-center px-2" : ""
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="animate-fade-in">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          {sidebarOpen && user && (
            <div className="mb-3 px-2 animate-fade-in">
              <p className="text-sm font-medium text-sidebar-foreground">
                {user.name}
              </p>
              <p className="text-xs text-sidebar-foreground/60">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`sidebar-item w-full text-destructive hover:bg-destructive/10 ${
              !sidebarOpen ? "justify-center px-2" : ""
            }`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <span className="text-xl font-bold text-foreground">Payroll</span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-16 left-0 bottom-0 w-64 bg-sidebar-background z-50 transform transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "sidebar-item-active" : ""}`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          {user && (
            <div className="mb-3 px-2">
              <p className="text-sm font-medium text-sidebar-foreground">
                {user.name}
              </p>
              <p className="text-xs text-sidebar-foreground/60">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="sidebar-item w-full text-destructive hover:bg-destructive/10"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loging out...
              </>
            ) : (
              <>
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pt-0 pt-16 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
