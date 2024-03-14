import { Route, Routes } from "react-router-dom"
import HomePage from "../pages/HomePage"
import Catalogo from "../pages/Catalogo";
import Contacto from "../pages/Contacto";
import Administrador from "../pages/Administrador";

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/catalogo" element={<Catalogo/>}/>
            <Route path="/contacto" element={<Contacto/>}/>
            <Route path="/administrador" element={<Administrador/>}/>

        </Routes>
    )
}
export default AppRoutes;