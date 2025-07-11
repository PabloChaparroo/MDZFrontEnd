import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './PerfilUsuario_new.css';
import { AuthService } from "../../services/AuthService";

interface Cliente {
  id: number;
  nombreCliente: string;
  apellidoCliente: string;
  telefonoCliente: number | null;
  mailCliente: string;
  fechaHoraAltaCliente: string | null;
  fechaHoraModificacionCliente: string | null;
  fechaHoraBajaCliente: string | null;
  estadoCliente: string | null;
}

interface Usuario {
  id: number;
  username: string;
  fechaAltaUsuario: string;
  fechaModificacionUsuario: string;
  fechaBajaUsuario: string;
  cliente?: Cliente;
  // Para compatibilidad con DTO plano
  clienteId?: number;
  nombreCliente?: string;
  apellidoCliente?: string;
  mailCliente?: string;
  role?: string;
}

const PerfilUsuario: React.FC = () => {
  // console.log('PerfilUsuario component rendered'); // Debug temporal
  
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing ] = useState(false);
  const [formData, setFormData] = useState<Cliente | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('PerfilUsuario - No token, redirecting to login');
      navigate("/login");
      return;
    }
    
    const fetchUsuario = async () => {
      try {
        setIsLoading(true);
        
        // Intentar obtener datos del backend
        try {
          const userData = await AuthService.getPerfil();
          setUsuario(userData);
          setFormData(userData.cliente);
        } catch (error) {
          console.log('Error al obtener perfil del backend:', error);
          
          // Fallback: usar datos del localStorage si existen
          const localUserData = localStorage.getItem('usuario');
          if (localUserData) {
            const parsedUser = JSON.parse(localUserData);
            console.log('PerfilUsuario - Using localStorage user data:', parsedUser);
            setUsuario(parsedUser);
            setFormData(parsedUser.cliente);
          } else {
            // Último fallback con datos básicos
            const basicUserData: Usuario = {
              id: parseInt(localStorage.getItem('id') || '0'),
              username: localStorage.getItem('username') || 'usuario',
              fechaAltaUsuario: '',
              fechaModificacionUsuario: '',
              fechaBajaUsuario: '',
              cliente: {
                id: 0,
                nombreCliente: localStorage.getItem('nombreCliente') || '',
                apellidoCliente: localStorage.getItem('apellidoCliente') || '',
                telefonoCliente: parseInt(localStorage.getItem('telefonoCliente') || '0') || null,
                mailCliente: localStorage.getItem('mailCliente') || '',
                fechaHoraAltaCliente: null,
                fechaHoraModificacionCliente: null,
                fechaHoraBajaCliente: null,
                estadoCliente: 'ACTIVO'
              }
            };
            
            console.log('PerfilUsuario - Using basic user data:', basicUserData);
            setUsuario(basicUserData);
            setFormData(basicUserData.cliente || null);
          }
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsuario();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate("/");
    window.location.reload();
  };

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }


  if (!usuario) return null;

  // Adaptar para DTO plano o con cliente anidado
  const nombreCliente = usuario.cliente?.nombreCliente ?? usuario.nombreCliente ?? '';
  const apellidoCliente = usuario.cliente?.apellidoCliente ?? usuario.apellidoCliente ?? '';
  const mailCliente = usuario.cliente?.mailCliente ?? usuario.mailCliente ?? '';
  const nombreCompleto = `${nombreCliente} ${apellidoCliente}`.trim() || usuario.username;
  const iniciales = nombreCliente?.charAt(0)?.toUpperCase() || usuario.username.charAt(0).toUpperCase();
  return (
    <div className="perfilusuario-container">
      <div className="perfilusuario-card">
        <div className="perfilusuario-header">
          <div className="perfilusuario-banner"></div>
          <div className="perfilusuario-avatar-section">
            <div className="perfilusuario-avatar">
              <span>{iniciales}</span>
            </div>
            <div className="perfilusuario-info">
              <h1 className="perfilusuario-nombre">{nombreCompleto || usuario.username}</h1>
              <p className="perfilusuario-username">@{usuario.username}</p>
              <div className="perfilusuario-status">
                <span className="perfilusuario-status-indicator perfilusuario-active"></span>
                <span>Cuenta Activa</span>
              </div>
            </div>
          </div>
        </div>

        <div className="perfilusuario-content">
          <div className="perfilusuario-info-card">
            <div className="perfilusuario-info-header">
              <h2>
                <i className="fas fa-user"></i>
                Información Personal
              </h2>
              
            
            </div>

            <div className="perfilusuario-details">
              <div className="perfilusuario-detail-row">
                <div className="perfilusuario-detail-item">
                  <label>
                    <i className="fas fa-user"></i>
                    Nombre
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nombreCliente"
                      value={formData?.nombreCliente || ''}
                      onChange={handleInputChange}
                      className="perfilusuario-edit-input"
                    />
                  ) : (
                    <span className="perfilusuario-detail-value">{nombreCliente}</span>
                  )}
                </div>

                <div className="perfilusuario-detail-item">
                  <label>
                    <i className="fas fa-user"></i>
                    Apellido
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="apellidoCliente"
                      value={formData?.apellidoCliente || ''}
                      onChange={handleInputChange}
                      className="perfilusuario-edit-input"
                    />
                  ) : (
                    <span className="perfilusuario-detail-value">{apellidoCliente}</span>
                  )}
                </div>
              </div>

              <div className="perfilusuario-detail-row">
                <div className="perfilusuario-detail-item">
                  <label>
                    <i className="fas fa-envelope"></i>
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="mailCliente"
                      value={formData?.mailCliente || ''}
                      onChange={handleInputChange}
                      className="perfilusuario-edit-input"
                    />
                  ) : (
                    <span className="perfilusuario-detail-value">{mailCliente}</span>
                  )}
                </div>
              </div>

              <div className="perfilusuario-detail-row">
                <div className="perfilusuario-detail-item">
                  <label>
                    <i className="fas fa-at"></i>
                    Usuario
                  </label>
                  <span className="perfilusuario-detail-value">{usuario.username}</span>
                </div>

                <div className="perfilusuario-detail-item">
                  <label>
                    <i className="fas fa-key"></i>
                    ID de Usuario
                  </label>
                  <span className="perfilusuario-detail-value">#{usuario.id}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="perfilusuario-actions-card">
            <h3>
              <i className="fas fa-cog"></i>
              Configuración de Cuenta
            </h3>
            <div className="perfilusuario-action-buttons">
              <button className="perfilusuario-action-btn secondary" onClick={() => navigate('/')}> 
                <i className="fas fa-home"></i>
                <span>Ir al Inicio</span>
              </button>
              <button className="perfilusuario-action-btn danger" onClick={confirmLogout}>
                <i className="fas fa-sign-out-alt"></i>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de logout */}
      {showLogoutModal && (
        <div className="perfilusuario-modal-overlay">
          <div className="perfilusuario-logout-modal">
            <div className="perfilusuario-modal-header">
              <h3>
                <i className="fas fa-sign-out-alt"></i>
                Cerrar Sesión
              </h3>
            </div>
            <div className="perfilusuario-modal-body">
              <p>¿Estás seguro de que deseas cerrar sesión?</p>
            </div>
            <div className="perfilusuario-modal-actions">
              <button className="perfilusuario-modal-btn cancel" onClick={() => setShowLogoutModal(false)}>
                Cancelar
              </button>
              <button className="perfilusuario-modal-btn confirm" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfilUsuario;