import Footer from "./components/Footer/Footer"
import Header from "./components/Header/Header"
import { BrowserRouter as Router, useLocation} from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { Suspense, useEffect, type ReactNode } from "react"
import { AuthService } from "./services/AuthService";
import Loader from "./components/Loader/Loader"
import { Container } from "react-bootstrap"
import './styles/mdz-site.css'

// Reinicia la animación de entrada de página en cada cambio de ruta,
// usando el pathname como key para forzar el remount del wrapper.
function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="mdz-page-transition">
      {children}
    </div>
  );
}

function App() {
  useEffect(() => {
    AuthService.refreshTokenOnLoad();
  }, []);
  return(
    <>
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    <Router>
      <Header/>
      <Container style={{minHeight: '100vh', minWidth: '100%', padding: '0'}}>
        <Suspense fallback={<Loader/>}>
        <PageTransition>
          <AppRoutes/>
        </PageTransition>
        </Suspense>
      </Container>
      <Footer/>
    </Router>
    </>
  )
}

export default App
