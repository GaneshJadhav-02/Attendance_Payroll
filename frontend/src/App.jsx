import { Toaster } from "./components/ui/toaster.jsx";
import { Toaster as Sonner } from "./components/ui/sonner.jsx";
import { TooltipProvider } from "./components/ui/tooltip.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "./components/AuthGuard.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Companies from "./pages/Companies.jsx";
import Employees from "./pages/Employees.jsx";
import Attendance from "./pages/Attendance.jsx";
// import Reports from "./pages/Reports.jsx";
import NotFound from "./pages/NotFound.jsx";
import AppToast from "./components/ui/AppToast.jsx";
import { useAppDispatch, useAppSelector } from "./store/hooks.js";
import { hideToast } from "./store/slices/toastSlice.js";

const queryClient = new QueryClient();

const App = () => {
  const dispatch = useAppDispatch();
  const toast = useAppSelector((state) => state.toast);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            <Route
              path="/companies"
              element={
                <AuthGuard>
                  <Companies />
                </AuthGuard>
              }
            />
            <Route
              path="/employees"
              element={
                <AuthGuard>
                  <Employees />
                </AuthGuard>
              }
            />
            <Route
              path="/attendance"
              element={
                <AuthGuard>
                  <Attendance />
                </AuthGuard>
              }
            />

            {/* Redirect root to dashboard or login */}
            <Route path="/" element={<Navigate to="/companies" replace />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <AppToast
            open={toast.open}
            onOpenChange={() => dispatch(hideToast())}
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
          />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
