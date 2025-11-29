// Utilidad rápida (podés extraerla a un helper si querés)
export function getAreaIdFromSubarea(subarea: any): string {
  // Si está populado (objeto con _id)
  if (subarea.area && typeof subarea.area === 'object' && subarea.area._id) {
    return subarea.area._id.toString();
  }
  // Si no está populado (ObjectId plano)
  return subarea.area.toString();
}
