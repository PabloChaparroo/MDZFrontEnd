import { Route, Routes } from "react-router-dom"
import HomePage from "../pages/HomePage"
import Catalogo from "../pages/Catalogo";
import Contacto from "../pages/Contacto";
import Administrador from "../pages/Administrador";
import MueblesAMedida from "../pages/MueblesAMedida";
import SoliciteSuPresupuesto from "../pages/SoliciteSuPresupuesto";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";


const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registrarse" element={<RegisterPage />} />
            <Route path="/catalogo" element={<Catalogo/>}/>
            <Route path="/contacto" element={<Contacto/>}/>
            <Route path="/administrador" element={<Administrador/>}/>
            <Route path="/MueblesAMedida" element={<MueblesAMedida/>}/>
            <Route path="/SoliciteSuPresupuesto" element={<SoliciteSuPresupuesto/>}/>



        </Routes>
    )
}
export default AppRoutes;