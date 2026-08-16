import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DevConsole from "./pages/DevConsole";
import ReportIncident from "./pages/ReportIncident";

import SuperAdminLayout from "./components/superadmin/SuperAdminLayout";
import SuperAdminDashboard from "./components/superadmin/SuperAdminDashboard";

import UserManagement from "./components/superadmin/pages/UserManagement";
import ReportsManagement from "./components/superadmin/pages/ReportsManagement";
import Comments from "./components/superadmin/pages/Comments";
import Notifications from "./components/superadmin/pages/Notifications";
import SettingsPanel from "./components/superadmin/pages/SettingsPanel";

import AuditOverview from "./components/superadmin/pages/AuditOverview";
import CategoryChart from "./components/superadmin/pages/CategoryChart";

import PageTransition from "./components/PageTransition";

import { store } from "./services/store";
import { ThemeProvider } from "./components/context/ThemeProvider";

// ============================================================
// SUPER ADMIN PROTECTION
// ============================================================

function SuperAdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = store.getCurrentUser();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== "super-admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// ============================================================
// ANIMATED ROUTES
// ============================================================

    function AnimatedRoutes() {
      const location = useLocation();

      return (
        <Routes location={location}>
          {/* ==================================================
              PUBLIC HOME
          ================================================== */}

          <Route
            path="/"
            element={
              <Layout>
                <PageTransition>
                  <Home />
                </PageTransition>
              </Layout>
            }
          />

          {/* ==================================================
              AUTHENTICATION
          ================================================== */}

          <Route
            path="/auth"
            element={
              <Layout>
                <PageTransition>
                  <Auth />
                </PageTransition>
              </Layout>
            }
          />

          {/* ==================================================
              DASHBOARD
          ================================================== */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                    <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ==================================================
              DEVELOPER CONSOLE
          ================================================== */}

          <Route
            path="/devconsole"
            element={
              <ProtectedRoute
                roles={[
                  "super-admin",
                ]}
              >
                <Layout>
                    <DevConsole />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ==================================================
              REPORT INCIDENT
          ================================================== */}

          <Route
            path="/report-incident"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Layout>
                    <ReportIncident />
                </Layout>
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* ==================================================
              SUPER ADMIN
          ================================================== */}

          <Route
            path="/super-admin"
            element={
              <SuperAdminRoute>
                <SuperAdminLayout />
              </SuperAdminRoute>
            }
          >
            <Route
              index
              element={<SuperAdminDashboard />}
            />

            <Route
              path="users"
              element={<UserManagement />}
            />

            <Route
              path="reports"
              element={<ReportsManagement />}
            />

            <Route
              path="comments"
              element={<Comments />}
            />

            <Route
              path="notifications"
              element={<Notifications />}
            />

            <Route
              path="settings"
              element={<SettingsPanel />}
            />

            <Route
              path="audit-logs"
              element={<AuditOverview />}
            />

            <Route
              path="analytics"
              element={<CategoryChart />}
            />

            <Route
              path="announcements"
              element={
                <Navigate
                  to="/super-admin/notifications"
                  replace
                />
              }
            />

            <Route
              path="*"
              element={
                <Navigate
                  to="/super-admin"
                  replace
                />
              }
            />
          </Route>

          {/* ==================================================
              GLOBAL FALLBACK
          ================================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      );
    }
// ============================================================
// APP
// ============================================================

    function App() {
      return (
        <ThemeProvider>
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </ThemeProvider>
      );
    }
  export default App;