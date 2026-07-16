import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import DesarrolloWeb from "./pages/DesarrolloWeb";
import ServiciosIT from "./pages/ServiciosIT";
import IaAutomatizacion from "./pages/IaAutomatizacion";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/desarrollo-web" element={<DesarrolloWeb />} />
        <Route path="/servicios-it" element={<ServiciosIT />} />
        <Route path="/ia-automatizacion" element={<IaAutomatizacion />} />
      </Route>
    </Routes>
  );
}
