export const statusLabels: Record<string, string> = {
  enviado: 'Enviado',
  en_revision: 'En Revisión',
  asignado: 'Asignado',
  en_proceso: 'En Proceso',
  solucionado: 'Solucionado',
  cerrado: 'Cerrado',
  cancelado: 'Cancelado',
};

export const priorityLabels: Record<string, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  critica: 'Crítica',
};

export const typeLabels: Record<string, string> = {
  error: 'Error',
  mejora: 'Mejora',
  consulta: 'Consulta',
  incidente: 'Incidente',
  otro: 'Otro',
};

export const projectTypeLabels: Record<string, string> = {
  software: 'Software',
  marketing: 'Marketing',
  consultoria: 'Consultoría',
  soporte: 'Soporte',
  otro: 'Otro',
};

export const roleLabels: Record<string, string> = {
  cliente: 'Cliente',
  empleado: 'Empleado',
  administrador: 'Administrador',
};

export const statusColors: Record<string, string> = {
  enviado: 'bg-blue-100 text-blue-800',
  en_revision: 'bg-yellow-100 text-yellow-800',
  asignado: 'bg-purple-100 text-purple-800',
  en_proceso: 'bg-orange-100 text-orange-800',
  solucionado: 'bg-green-100 text-green-800',
  cerrado: 'bg-gray-100 text-gray-800',
  cancelado: 'bg-red-100 text-red-800',
};

export const priorityColors: Record<string, string> = {
  baja: 'bg-green-100 text-green-800',
  media: 'bg-yellow-100 text-yellow-800',
  alta: 'bg-orange-100 text-orange-800',
  critica: 'bg-red-100 text-red-800',
};
