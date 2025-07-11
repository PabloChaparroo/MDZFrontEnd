import Footer from "./components/Footer/Footer"
import Header from "./components/Header/Header"
import { BrowserRouter as Router} from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { Suspense, useEffect } from "react"
import { AuthService } from "./services/AuthService";
import Loader from "./components/Loader/Loader"
import 'animate.css/animate.min.css'
import { Container } from "react-bootstrap"

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
        <AppRoutes/>
        </Suspense>
      </Container>  
      <Footer/>
    </Router>
    </>
  )
}

export default App
