import React from 'react';
import { useNavigate } from 'react-router-dom';

const FloatingProfileButton: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  if (!isLoggedIn) return null;

  const handleClick = () => {
    console.log('🔥 FLOATING BUTTON - Navegando a perfil...');
    alert('Floating Button: Navegando a perfil...');
    navigate('/perfil');
  };

  return (
    <button
      onClick={handleClick}
      onMouseDown={() => console.log('🔥 FLOATING BUTTON - Mouse down')}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        backgroundColor: '#ff6b6b',
        color: 'white',
        border: '3px solid #ffffff',
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        cursor: 'pointer',
        fontSize: '24px',
        fontWeight: 'bold',
        boxShadow: '0 4px 20px rgba(255, 107, 107, 0.5)',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        animation: 'pulse 2s infinite'
      }}
      onMouseEnter={(e) => {
        (e.target as HTMLElement).style.transform = 'scale(1.1)';
        (e.target as HTMLElement).style.boxShadow = '0 6px 25px rgba(255, 107, 107, 0.7)';
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLElement).style.transform = 'scale(1)';
        (e.target as HTMLElement).style.boxShadow = '0 4px 20px rgba(255, 107, 107, 0.5)';
      }}
    >
      <i className="fas fa-user" style={{ fontSize: '20px', marginBottom: '2px' }}></i>
      <span style={{ fontSize: '10px', fontWeight: 'normal' }}>PERFIL</span>
    </button>
  );
};

export default FloatingProfileButton;
