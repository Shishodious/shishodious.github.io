import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./shell/Layout";
import Chooser from "./pages/Chooser";
import ServicePage from "./pages/ServicePage";

// "/" is the gate; every service world lives at "/:slug" (see services/registry).
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Chooser />} />
        <Route path=":slug" element={<ServicePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
