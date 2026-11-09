import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import PrivateRoute from "./PrivateRoutes";

const Catalogo = lazy(() => import("../pages/Catalogo"));
const Novedades = lazy(() => import("../pages/Novedades"));
const LoginPage = lazy(() => import("../pages/LoginPage/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage/RegisterPage"));
const ViewMueble = lazy(() => import("../components/ViewMueble/ViewMueble"));
const AdministrarCategorias = lazy(() => import("../pages/AdministrarCategorias"));
const QuienesSomos = lazy(() => import("../pages/QuienesSomos"));
const AdministrarSolicitudPage = lazy(() => import("../pages/AdministrarSolicitud"));
const PerfilPage = lazy(() => import("../pages/PerfilPage"));
const Privacidad = lazy(() => import("../pages/Privacidad"));

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registrarse" element={<RegisterPage />} />
            <Route path="/catalogo" element={<Catalogo/>}/>
            <Route path="/novedades" element={<Novedades/>}/>
            <Route path="/quienesSomos" element={<QuienesSomos/>}/>
            <Route path="/ViewMueble/:id" element={<ViewMueble/>} />
            <Route path="/privacidad" element={<Privacidad/>} />
            <Route path="/perfil" element={<PrivateRoute element={<PerfilPage/>}/>} />
            <Route path="/administrarCategorias" element={<PrivateRoute element={<AdministrarCategorias/>}/>}/>
            <Route path="/administrarSolicitud" element={<PrivateRoute element={<AdministrarSolicitudPage/>}/>}/>
        </Routes>
    );
};

export default AppRoutes;
