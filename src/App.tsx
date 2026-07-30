import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DevConsole from "./pages/DevConsole";
import SuperAdmin from "./pages/SuperAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Main Website */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/auth"
          element={
            <Layout>
              <Auth />
            </Layout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/devconsole"
          element={
            <Layout>
              <DevConsole />
            </Layout>
          }
        />

        {/* Super Admin (NO Layout) */}
        <Route
          path="/super-admin"
          element={<SuperAdmin />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;