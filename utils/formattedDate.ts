export const formattedDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        });
  };