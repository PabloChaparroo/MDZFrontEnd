import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../services/AuthService";
import Loader from "../Loader/Loader";
import '../../styles/mdz-theme.css';
import '../../styles/mdz-site.css';

interface Cliente {
  id: number;
  nombreCliente: string;
  apellidoCliente: string;
  telefonoCliente: string | null;
  mailCliente: string;
  fechaHoraAltaCliente: string | null;
  fechaHoraModificacionCliente: string | null;
  fechaHoraBajaCliente: string | null;
}

interface Usuario {
  id: number;
  username: string;
  fechaAltaUsuario: string;
  fechaModificacionUsuario: string;
  fechaBajaUsuario: string;
  cliente?: Cliente;
  clienteId?: number;
  nombreCliente?: string;
  apellidoCliente?: string;
  mailCliente?: string;
  role?: string;
}

const PerfilUsuario: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUsuario = async () => {
      try {
        setIsLoading(true);

        try {
          const userData = await AuthService.getPerfil();
          setUsuario(userData);
        } catch (error) {
          const localUserData = localStorage.getItem('usuario');
          if (localUserData) {
            const parsedUser = JSON.parse(localUserData);
            setUsuario(parsedUser);
          } else {
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
                telefonoCliente: localStorage.getItem('telefonoCliente'),
                mailCliente: localStorage.getItem('mailCliente') || '',
                fechaHoraAltaCliente: null,
                fechaHoraModificacionCliente: null,
                fechaHoraBajaCliente: null
              }
            };
            setUsuario(basicUserData);
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

  const handleLogout = () => {
    AuthService.logout();
    navigate("/");
    window.location.reload();
  };

  if (isLoading) {
    return <div className="mdz-loading-state"><Loader /></div>;
  }

  if (!usuario) return null;

  const nombreCliente = usuario.cliente?.nombreCliente ?? usuario.nombreCliente ?? '';
  const apellidoCliente = usuario.cliente?.apellidoCliente ?? usuario.apellidoCliente ?? '';
  const mailCliente = usuario.cliente?.mailCliente ?? usuario.mailCliente ?? '';
  const nombreCompleto = `${nombreCliente} ${apellidoCliente}`.trim() || usuario.username;
  const iniciales = nombreCliente?.charAt(0)?.toUpperCase() || usuario.username.charAt(0).toUpperCase();

  return (
    <>
      <div className="mdz-page-header mdz-diagonal-detail">
        <div className="mdz-container">
          <p className="mdz-eyebrow">Cuenta</p>
          <h1>Mi perfil.</h1>
          <p className="mdz-section-copy">Revisá tus datos de cuenta.</p>
        </div>
      </div>

      <div className="mdz-container mdz-section">
        <div className="mdz-profile-card">
          <div className="mdz-profile-banner mdz-diagonal-detail"></div>
          <div className="mdz-profile-avatar-row">
            <div className="mdz-profile-avatar"><span>{iniciales}</span></div>
            <div style={{ paddingBottom: 10 }}>
              <h2 className="mdz-profile-name">{nombreCompleto || usuario.username}</h2>
              <p className="mdz-profile-username">@{usuario.username}</p>
              <div className="mdz-profile-status"><span className="dot"></span> Cuenta activa</div>
            </div>
          </div>

          <div className="mdz-profile-body">
            <h3 className="mdz-profile-section-title"><i className="fas fa-user"></i> Información personal</h3>
            <div className="mdz-profile-grid">
              <div className="mdz-profile-field">
                <label><i className="fas fa-user"></i> Nombre</label>
                <div className="mdz-profile-value">{nombreCliente || '-'}</div>
              </div>
              <div className="mdz-profile-field">
                <label><i className="fas fa-user"></i> Apellido</label>
                <div className="mdz-profile-value">{apellidoCliente || '-'}</div>
              </div>
              <div className="mdz-profile-field">
                <label><i className="fas fa-envelope"></i> Email</label>
                <div className="mdz-profile-value">{mailCliente || '-'}</div>
              </div>
              <div className="mdz-profile-field">
                <label><i className="fas fa-at"></i> Usuario</label>
                <div className="mdz-profile-value">{usuario.username}</div>
              </div>
              <div className="mdz-profile-field">
                <label><i className="fas fa-key"></i> ID de usuario</label>
                <div className="mdz-profile-value">#{usuario.id}</div>
              </div>
            </div>

            <div className="mdz-profile-actions">
              <button className="mdz-btn mdz-btn-filter" onClick={() => navigate('/')}>
                <i className="fas fa-home"></i> Ir al inicio
              </button>
              <button className="mdz-btn mdz-btn-filter" onClick={() => setShowLogoutModal(true)} style={{ color: 'oklch(0.62 0.2 25)', borderColor: 'oklch(0.62 0.2 25)' }}>
                <i className="fas fa-sign-out-alt"></i> Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <div className="mdz-confirm-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="mdz-modal-content mdz-confirm-card" onClick={(e) => e.stopPropagation()}>
            <h3><i className="fas fa-sign-out-alt"></i> Cerrar sesión</h3>
            <p>¿Estás seguro de que querés cerrar sesión?</p>
            <div className="mdz-confirm-actions">
              <button className="mdz-btn mdz-btn-filter" onClick={() => setShowLogoutModal(false)}>Cancelar</button>
              <button className="mdz-btn mdz-btn-brand" onClick={handleLogout}>Cerrar sesión</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PerfilUsuario;
