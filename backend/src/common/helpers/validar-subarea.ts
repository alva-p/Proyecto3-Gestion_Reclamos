export function validarSubareaPerteneceArea(subarea, areaId) {
  if (subarea && subarea.area.toString() !== areaId.toString()) {
    throw new Error('La subárea no pertenece al área indicada.');
  }
}
