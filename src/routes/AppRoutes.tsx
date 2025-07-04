import { Route, Routes } from "react-router-dom"
import HomePage from "../pages/HomePage"
import Catalogo from "../pages/Catalogo";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import ViewMueble from "../components/ViewMueble/ViewMueble";
import AdministrarCategorias from "../pages/AdministrarCategorias";
import QuienesSomos from "../pages/QuienesSomos";
import AdministrarSolicitudPage from "../pages/AdministrarSolicitud";


const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registrarse" element={<RegisterPage />} />
            <Route path="/catalogo" element={<Catalogo/>}/>
            
            <Route path="/administrarCategorias" element={<AdministrarCategorias/>}/>
            <Route path="/administrarSolicitud" element={<AdministrarSolicitudPage/>}/>
            <Route path="/quienesSomos" element={<QuienesSomos/>}/>
            <Route path="/ViewMueble/:nombreMueble" element={<ViewMueble/>} />

            
        </Routes>



    
    )
}
export default AppRoutes;