import { Routes, Route } from "react-router-dom";
import { LocaleProvider } from "./i18n/locale";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import DesarrolloWeb from "./pages/DesarrolloWeb";
import ServiciosIT from "./pages/ServiciosIT";
import IaAutomatizacion from "./pages/IaAutomatizacion";

/* ============================================================
   Español (sin prefijo) e inglés (/en) son árboles de rutas
   separados, cada uno envuelto en su propio LocaleProvider —
   así cada página tiene una URL propia por idioma, compartible
   directamente (ver decisión de ruteo en la memoria del proyecto).
   ============================================================ */
export default function App() {
  return (
    <Routes>
      <Route
        element={
          <LocaleProvider locale="es">
            <Layout />
          </LocaleProvider>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/desarrollo-web" element={<DesarrolloWeb />} />
        <Route path="/servicios-it" element={<ServiciosIT />} />
        <Route path="/ia-automatizacion" element={<IaAutomatizacion />} />
      </Route>

      <Route
        path="/en"
        element={
          <LocaleProvider locale="en">
            <Layout />
          </LocaleProvider>
        }
      >
        <Route index element={<Home />} />
        <Route path="desarrollo-web" element={<DesarrolloWeb />} />
        <Route path="servicios-it" element={<ServiciosIT />} />
        <Route path="ia-automatizacion" element={<IaAutomatizacion />} />
      </Route>
    </Routes>
  );
}
