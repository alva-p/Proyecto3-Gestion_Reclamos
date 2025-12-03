// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ===== Autenticación básica (token en memoria + localStorage) =====
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    try { localStorage.setItem('accessToken', token); } catch {}
  } else {
    try { localStorage.removeItem('accessToken'); } catch {}
  }
}

export function getAuthToken() {
  if (authToken) return authToken;
  try {
    const stored = localStorage.getItem('accessToken');
    if (stored) authToken = stored;
    return authToken;
  } catch { return null; }
}

async function apiFetch(input: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', headers.get('Content-Type') || 'application/json');
  const token = getAuthToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}

// Helper para manejar respuestas
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la solicitud' }));
    throw new Error(error.message || `Error ${response.status}`);
  }
  return response.json();
}

// ==================== RECLAMOS ====================

export interface CreateReclamoData {
  titulo: string;
  descripcion: string;
  tipoReclamo: string;
  prioridad: string;
  criticidad: string;
  area?: string; // opcional: algunos backends no aceptan 'area' en creación
  subarea?: string;
  proyectoId: string;
}

export interface ReclamoResponse {
  _id: string;
  numeroReclamo?: string;
  titulo: string;
  descripcion: string;
  estadoActual: {
    _id: string;
    nombre: string;
  };
  tipoReclamo: {
    _id: string;
    nombre: string;
  };
  prioridad: {
    _id: string;
    nombre: string;
  };
  criticidad: {
    _id: string;
    nombre: string;
  };
  area: {
    _id: string;
    nombre: string;
  };
  subarea?: {
    _id: string;
    nombre: string;
  };
  proyectoId: {
    _id: string;
    nombre: string;
  } | string;
  clienteId: {
    _id: string;
    empresa: string;
  } | string;
  empleadoAsignado?: {
    _id: string;
    nombre: string;
  };
  historialIds?: Array<{
    _id: string;
    fechaHora: string;
    detalleAccion: string;
    comentario?: string;
    estadoReclamo?: {
      _id: string;
      nombre: string;
    };
    empleado?: {
      _id: string;
      usuarioId?: {
        nombre: string;
      };
    };
    area?: {
      _id: string;
      nombre: string;
    };
    subarea?: {
      _id: string;
      nombre: string;
    };
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export const reclamosApi = {
  // Crear reclamo
  async create(data: CreateReclamoData): Promise<ReclamoResponse> {
    // No enviar 'area' si el backend no lo acepta en la creación
    const { area, ...rest } = data;
    const payload = { ...rest } as any;
    // Si tu backend acepta 'area', descomenta la siguiente línea
    // if (area) payload.area = area;

    const response = await apiFetch(`${API_BASE_URL}/reclamos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return handleResponse<ReclamoResponse>(response);
  },

  // Listar todos los reclamos
  async getAll(filters?: Record<string, string>): Promise<ReclamoResponse[]> {
    const params = new URLSearchParams(filters);
    const response = await apiFetch(`${API_BASE_URL}/reclamos?${params}`);
    return handleResponse<ReclamoResponse[]>(response);
  },

  // Obtener un reclamo por ID
  async getById(id: string): Promise<ReclamoResponse> {
    const response = await apiFetch(`${API_BASE_URL}/reclamos/${id}`);
    return handleResponse<ReclamoResponse>(response);
  },

  // Actualizar reclamo
  async update(id: string, data: Partial<CreateReclamoData>): Promise<ReclamoResponse> {
    const response = await apiFetch(`${API_BASE_URL}/reclamos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<ReclamoResponse>(response);
  },

  // Cambiar estado
  async cambiarEstado(id: string, data: { nuevoEstadoId: string; empleadoId?: string; comentario?: string }): Promise<ReclamoResponse> {
    const response = await apiFetch(`${API_BASE_URL}/reclamos/${id}/estado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<ReclamoResponse>(response);
  },

  // Asignar empleado
  async asignarEmpleado(id: string, empleadoId: string): Promise<ReclamoResponse> {
    const response = await apiFetch(`${API_BASE_URL}/reclamos/${id}/asignar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ empleadoId }),
    });
    return handleResponse<ReclamoResponse>(response);
  },
};

// ==================== ESTADOS DE RECLAMO ====================

export interface EstadoReclamoResponse {
  _id: string;
  nombre: string;
  descripcion?: string;
}

export const estadosReclamoApi = {
  // Listar todos los estados
  async getAll(): Promise<EstadoReclamoResponse[]> {
    const response = await apiFetch(`${API_BASE_URL}/estado-reclamo`);
    return handleResponse<EstadoReclamoResponse[]>(response);
  },

  // Obtener un estado por ID
  async getById(id: string): Promise<EstadoReclamoResponse> {
    const response = await apiFetch(`${API_BASE_URL}/estado-reclamo/${id}`);
    return handleResponse<EstadoReclamoResponse>(response);
  },
};

// ==================== ÁREAS ====================

export interface CreateAreaData {
  nombre: string;
}

export interface AreaResponse {
  _id: string;
  nombre: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export const areasApi = {
  // Crear área
  async create(data: CreateAreaData): Promise<AreaResponse> {
    const response = await apiFetch(`${API_BASE_URL}/areas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<AreaResponse>(response);
  },

  // Listar todas las áreas
  async getAll(): Promise<AreaResponse[]> {
    const response = await apiFetch(`${API_BASE_URL}/areas`);
    return handleResponse<AreaResponse[]>(response);
  },

  // Obtener un área por ID
  async getById(id: string): Promise<AreaResponse> {
    const response = await apiFetch(`${API_BASE_URL}/areas/${id}`);
    return handleResponse<AreaResponse>(response);
  },

  // Actualizar área
  async update(id: string, data: Partial<CreateAreaData>): Promise<AreaResponse> {
    const response = await apiFetch(`${API_BASE_URL}/areas/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<AreaResponse>(response);
  },

  // Eliminar área
  async delete(id: string): Promise<void> {
    const response = await apiFetch(`${API_BASE_URL}/areas/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error al eliminar' }));
      throw new Error(error.message || `Error ${response.status}`);
    }
  },
};

// ==================== TIPOS DE RECLAMO ====================

export interface TipoReclamoResponse {
  _id: string;
  nombre: string;
}

export const tiposReclamoApi = {
  async getAll(): Promise<TipoReclamoResponse[]> {
    const response = await apiFetch(`${API_BASE_URL}/tipo-reclamo`);
    return handleResponse<TipoReclamoResponse[]>(response);
  },
};

// ==================== PRIORIDADES ====================

export interface PrioridadResponse {
  _id: string;
  nombre: string;
}

export const prioridadesApi = {
  async getAll(): Promise<PrioridadResponse[]> {
    const response = await apiFetch(`${API_BASE_URL}/prioridad`);
    return handleResponse<PrioridadResponse[]>(response);
  },
};

// ==================== CRITICIDADES ====================

export interface CriticidadResponse {
  _id: string;
  nombre: string;
}

export const criticidadesApi = {
  async getAll(): Promise<CriticidadResponse[]> {
    const response = await apiFetch(`${API_BASE_URL}/criticidad`);
    return handleResponse<CriticidadResponse[]>(response);
  },
};

// ==================== PROYECTOS ====================

export interface ProyectoResponse {
  _id: string;
  nombre: string;
  descripcion?: string;
  tipoProyecto?: {
    _id: string;
    nombre: string;
  };
}

export const proyectosApi = {
  // Listar proyectos, opcionalmente filtrando por clienteId/tipo/nombre
  async getAll(filters?: { clienteId?: string; tipoProyecto?: string; nombre?: string }): Promise<ProyectoResponse[]> {
    const params = new URLSearchParams();
    if (filters?.clienteId) params.set('clienteId', filters.clienteId);
    if (filters?.tipoProyecto) params.set('tipoProyecto', filters.tipoProyecto);
    if (filters?.nombre) params.set('nombre', filters.nombre);

    const qs = params.toString();
    const url = qs ? `${API_BASE_URL}/proyectos?${qs}` : `${API_BASE_URL}/proyectos`;

    const response = await apiFetch(url);
    return handleResponse<ProyectoResponse[]>(response);
  },

  // Crear proyecto
  async create(data: { nombre: string; descripcion?: string; tipoProyecto?: string; clienteId: string }): Promise<ProyectoResponse> {
    const response = await apiFetch(`${API_BASE_URL}/proyectos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<ProyectoResponse>(response);
  },
};


// ==================== TIPOS DE PROYECTO ====================

export interface TipoProyectoResponse {
  _id: string;
  nombre: string;
}

export const tiposProyectoApi = {
  async getAll(): Promise<TipoProyectoResponse[]> {
    const response = await apiFetch(`${API_BASE_URL}/tipo-proyecto`);
    return handleResponse<TipoProyectoResponse[]>(response);
  },
};

// ==================== CLIENTES ====================

export interface ClienteResponse {
  _id: string;
  empresa: string;
  telefono?: string;
  direccion?: string;
  usuarioId: any;
  estadoSolicitud: any;
  createdAt?: string;
  updatedAt?: string;
}

export const clientesApi = {
  async getAll(): Promise<ClienteResponse[]> {
    const response = await apiFetch(`${API_BASE_URL}/clientes`);
    return handleResponse<ClienteResponse[]>(response);
  },
  async getPendientes(): Promise<ClienteResponse[]> {
    const response = await apiFetch(`${API_BASE_URL}/clientes/solicitudes/pendientes`);
    return handleResponse<ClienteResponse[]>(response);
  },
  async aprobar(id: string) {
    const response = await apiFetch(`${API_BASE_URL}/clientes/${id}/aprobar`, { method: 'PUT' });
    return handleResponse(response);
  },
  async rechazar(id: string) {
    const response = await apiFetch(`${API_BASE_URL}/clientes/${id}/rechazar`, { method: 'PUT' });
    return handleResponse(response);
  },
};

// ==================== AUTH ====================

export interface LoginResponse {
  accessToken: string;
  usuario: {
    id: string;
    nombre: string;
    correo: string;
    rol: string;
    clienteId?: string; // ⬅️ NUEVO
  };
}


export const authApi = {
  async login({ correo, contraseña }: { correo: string; contraseña: string }): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contraseña }),
    });
    const data = await handleResponse<LoginResponse>(response);
    setAuthToken(data.accessToken);
    return data;
  },
  async registerCliente(data: { nombre: string; correo: string; contraseña: string; empresa: string; telefono: string; direccion: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/register/cliente`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};

// ==================== USUARIOS ====================

export interface UsuarioResponse {
  _id: string;
  nombre: string;
  correo: string;
  rol: {
    _id: string;
    nombre: string;
  } | string;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmpleadoData {
  nombre: string;
  correo: string;
  contraseña: string;
  puesto?: string;
  subareaId: string;
}

export interface CreateAdminData {
  nombre: string;
  correo: string;
  contraseña: string;
}

export const usuariosApi = {
  async getAll(): Promise<UsuarioResponse[]> {
    const response = await apiFetch(`${API_BASE_URL}/usuarios`);
    return handleResponse<UsuarioResponse[]>(response);
  },
  
  async createEmpleado(data: CreateEmpleadoData) {
    const response = await apiFetch(`${API_BASE_URL}/auth/register/empleado`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  async createAdmin(data: CreateAdminData) {
    const response = await apiFetch(`${API_BASE_URL}/auth/register/admin`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};

// ==================== COMENTARIOS INTERNOS ====================

export interface ComentarioInternoResponse {
  _id: string;
  reclamoId: string;
  usuarioId: {
    _id: string;
    nombre: string;
    correo: string;
  };
  texto: string;
  fechaCreacion: string;
  createdAt: string;
}

export interface CreateComentarioInternoData {
  texto: string;
}

export const comentariosInternosApi = {
  // Crear comentario interno
  async create(reclamoId: string, data: CreateComentarioInternoData): Promise<ComentarioInternoResponse> {
    const response = await apiFetch(`${API_BASE_URL}/reclamos/${reclamoId}/comentarios-internos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<ComentarioInternoResponse>(response);
  },

  // Listar comentarios de un reclamo
  async getByReclamoId(reclamoId: string): Promise<ComentarioInternoResponse[]> {
    const response = await apiFetch(`${API_BASE_URL}/reclamos/${reclamoId}/comentarios-internos`);
    return handleResponse<ComentarioInternoResponse[]>(response);
  },

  // Eliminar comentario
  async delete(reclamoId: string, comentarioId: string): Promise<void> {
    const response = await apiFetch(`${API_BASE_URL}/reclamos/${reclamoId}/comentarios-internos/${comentarioId}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};

// ==================== EMPLEADOS ====================

export interface EmpleadoResponse {
  _id: string;
  puesto: string;
  usuarioId: {
    _id: string;
    nombre: string;
    correo: string;
  };
  subarea?: {
    _id: string;
    nombre: string;
    area?: {
      _id: string;
      nombre: string;
    };
  };
}

export const empleadosApi = {
  async getAll(): Promise<EmpleadoResponse[]> {
    const response = await apiFetch(`${API_BASE_URL}/empleados`);
    return handleResponse<EmpleadoResponse[]>(response);
  },

  async getById(id: string): Promise<EmpleadoResponse> {
    const response = await apiFetch(`${API_BASE_URL}/empleados/${id}`);
    return handleResponse<EmpleadoResponse>(response);
  },
};

// ==================== SUBAREAS ====================

export interface SubareaResponse {
  _id: string;
  nombre: string;
  area: {
    _id: string;
    nombre: string;
  } | string;
}

export const subareasApi = {
  async getAll(): Promise<SubareaResponse[]> {
    const response = await apiFetch(`${API_BASE_URL}/subareas`);
    return handleResponse<SubareaResponse[]>(response);
  },
};
