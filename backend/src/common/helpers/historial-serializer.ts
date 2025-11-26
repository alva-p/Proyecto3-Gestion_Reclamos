export function sanitizeHistorialForClient(historial: any[]) {
  return historial.map(item => {
    const plain = item.toObject ? item.toObject() : item;
    return {
      ...plain,
      subarea: null,
    };
  });
}
