export function sanitizeReclamoForClient(reclamo: any) {
  if (!reclamo) return null;

  const plain = reclamo.toObject ? reclamo.toObject() : reclamo;

  return {
    ...plain,
    subarea: null,        // 🔥 clave
    area: plain.area,     // el cliente sí ve el área general
  };
}
