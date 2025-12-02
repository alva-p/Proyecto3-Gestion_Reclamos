export function sanitizeReclamoForClient(reclamo: any) {
  if (!reclamo) return null;
  const plain = reclamo.toObject ? reclamo.toObject() : reclamo;
  return {
    ...plain,
    subarea: null,        
    area: plain.area,     
  };
}
