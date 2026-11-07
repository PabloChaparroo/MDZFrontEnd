const PESO_SIN_COMPRIMIR = 1024 * 1024; // 1 MB
const LADO_MAXIMO = 2000;
const CALIDAD_JPEG = 0.85;

// Límite por archivo del backend (spring.servlet.multipart.max-file-size)
export const PESO_MAXIMO_SUBIDA = 10 * 1024 * 1024;

const cargarImagen = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });

// Solo comprime fotos de más de 1 MB. Mantiene la proporción, por lo que nunca recorta.
// Si no puede procesarla o no logra achicarla, devuelve el archivo original.
export const comprimirImagen = async (file: File): Promise<File> => {
  if (file.size <= PESO_SIN_COMPRIMIR || file.type === 'image/gif') return file;

  const url = URL.createObjectURL(file);
  try {
    const img = await cargarImagen(url);
    const escala = Math.min(1, LADO_MAXIMO / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * escala);
    canvas.height = Math.round(img.naturalHeight * escala);
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    const esPng = file.type === 'image/png'; // PNG conserva la transparencia
    if (!esPng) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const tipo = esPng ? 'image/png' : 'image/jpeg';
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, tipo, CALIDAD_JPEG));
    if (!blob || blob.size >= file.size) return file;

    const nombre = esPng ? file.name : file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], nombre, { type: tipo, lastModified: file.lastModified });
  } catch (error) {
    console.error(`No se pudo comprimir ${file.name}:`, error);
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
};
