
import { LoginRequest } from "../types/LoginRequest";
import { RegisterRequest } from "../types/RegisterRequest";



const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthService = {
  
 login: async (loginRequest: LoginRequest): Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginRequest),
    });

    if (!response.ok) {
      const error: any = new Error('Inicio de sesión fallido');
      error.response = { status: response.status };
      throw error;
    }

    const responseData = await response.json();
    console.log('Response completa del login:', responseData);
    const { token, refreshToken, username } = responseData;

    if (!token || !refreshToken) {
      throw new Error('No se encontró el token o refreshToken en la respuesta');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('username', username || loginRequest.username);

    return token;

  } catch (error) {
    console.error('Error al iniciar sesión desde el service');
    throw error;
  }
},

  register: async (registerRequest: RegisterRequest): Promise<string> => {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerRequest),
      });

      if (!response.ok) {
        throw new Error('Registro fallido');
      }

      const { token, refreshToken } = await response.json();

      if (!token || !refreshToken) {
        throw new Error('No se encontró el token o refreshToken en la respuesta');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      return token;

    } catch (error) {
      console.error('Error al registrar desde el service');
      throw error;
    }
  },
  // Función central para peticiones protegidas con refresh automático de token
  fetchWithAuth: async (input: RequestInfo, init: RequestInit = {}, retry = true): Promise<Response> => {
    let token = localStorage.getItem('token');
    if (!token) throw new Error('No autenticado');
    // Añadir el token al header
    const headers = new Headers(init.headers || {});
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');
    const fetchInit = { ...init, headers };
    let response = await fetch(input, fetchInit);
    if (response.status === 401 && retry) {
      // Intentar refresh
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        AuthService.logout();
        throw new Error('No autenticado (sin refreshToken)');
      }
      const refreshResponse = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      if (refreshResponse.ok) {
        const { token: newToken, refreshToken: newRefreshToken } = await refreshResponse.json();
        if (newToken && newRefreshToken) {
          localStorage.setItem('token', newToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          // Reintentar la petición original con el nuevo token
          headers.set('Authorization', `Bearer ${newToken}`);
          response = await fetch(input, { ...init, headers });
        } else {
          AuthService.logout();
          throw new Error('No autenticado (refresh inválido)');
        }
      } else {
        AuthService.logout();
        throw new Error('No autenticado (refresh expirado)');
      }
    }
    return response;
  },
  getPerfil: async (): Promise<any> => {
    const response = await AuthService.fetchWithAuth(`${BASE_URL}/api/v1/usuarios/showProfile`, {
      method: 'GET'
    });
    if (!response.ok) throw new Error('No autorizado');
    const userData = await response.json();
    // Guardar los datos completos en localStorage para uso posterior
    if (userData) {
      localStorage.setItem('usuario', JSON.stringify(userData));
      if (userData.id) localStorage.setItem('id', userData.id.toString());
      if (userData.username) localStorage.setItem('username', userData.username);
      if (userData.clienteId) {
        localStorage.setItem('clienteId', userData.clienteId.toString());
        localStorage.setItem('nombreCliente', userData.nombreCliente || '');
        localStorage.setItem('apellidoCliente', userData.apellidoCliente || '');
        localStorage.setItem('mailCliente', userData.mailCliente || '');
      }
      if (userData.fechaAltaUsuario) {
        localStorage.setItem('fechaAltaUsuario', userData.fechaAltaUsuario);
      }
      if (userData.role) {
        localStorage.setItem('role', userData.role);
      }
    }
    return userData;
  },

  logout: (): void => {
    // Limpiar todos los datos del usuario
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    localStorage.removeItem('usuario');
    // Datos del cliente del UsuarioProfileDTO
    localStorage.removeItem('clienteId');
    localStorage.removeItem('nombreCliente');
    localStorage.removeItem('apellidoCliente');
    localStorage.removeItem('mailCliente');
    // Datos adicionales del usuario
    localStorage.removeItem('fechaAltaUsuario');
    localStorage.removeItem('role');
    // Datos legacy (por compatibilidad)
    localStorage.removeItem('telefonoCliente');
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('emailUsuario');
    localStorage.removeItem('dniUsuario');
    localStorage.removeItem('telefonoUsuario');
  },
  updateProfile: async (usuarioActualizado: any): Promise<any> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No autenticado');
    const response = await fetch(`${BASE_URL}/api/usuarios/updateProfile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuarioActualizado)
    });
    if (!response.ok) throw new Error('No autorizado');
    return await response.json();
  },

  modifyUsuario: async (usuarioModifyDTO: any): Promise<any> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No autenticado');
    const response = await fetch(`${BASE_URL}/api/usuarios/modifyUsuario`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuarioModifyDTO)
    });
    if (!response.ok) throw new Error('No autorizado');
    return await response.json();
  },

  deleteUsuario: async (idUsuario: number): Promise<any> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No autenticado');
  const response = await fetch(`${BASE_URL}/api/usuarios/deleteUsuario`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(idUsuario)
  });
  if (!response.ok) throw new Error('No autorizado');
  return await response.json();
},

  getUsuarioByEmailUsuario: async (emailUsuario: string): Promise<any> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No autenticado');
    const response = await fetch(`${BASE_URL}/api/usuarios/getUsuarioByEmailUsuario?emailUsuario=${encodeURIComponent(emailUsuario)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('No autorizado');
    return await response.json();
  },

  restaurarUsuario: async (idUsuario: number): Promise<any> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No autenticado');
  const response = await fetch(`${BASE_URL}/api/usuarios/restaurar/${idUsuario}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(idUsuario)
  });
  if (!response.ok) throw new Error('No autorizado');
  return await response.json();
},
  // Refresca el token apenas se carga la app, si hay refreshToken
  refreshTokenOnLoad: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return; // No hay refreshToken, no hacer nada
    try {
      const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      if (response.ok) {
        const { token: newToken, refreshToken: newRefreshToken } = await response.json();
        if (newToken && newRefreshToken) {
          localStorage.setItem('token', newToken);
          localStorage.setItem('refreshToken', newRefreshToken);
        } else {
          AuthService.logout();
        }
      } else {
        AuthService.logout();
      }
    } catch (e) {
      AuthService.logout();
    }
  },
};