import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Form, Alert, Spinner } from 'react-bootstrap';
import { MuebleService } from '../../services/MuebleService';
import { MuebleImagenes } from '../../types/MuebleImagenes';
import { Mueble } from '../../types/Mueble';
import './ModalGestionImagenes.css';

interface ModalGestionImagenesProps {
  show: boolean;
  onHide: () => void;
  mueble: Mueble;
  onImagenesActualizadas: () => void;
}

const ModalGestionImagenes: React.FC<ModalGestionImagenesProps> = ({
  show,
  onHide,
  mueble,
  onImagenesActualizadas
}) => {
  // Estados principales
  const [imagenes, setImagenes] = useState<MuebleImagenes[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Estados para nuevas imágenes
  const [nuevasImagenes, setNuevasImagenes] = useState<FileList | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Estado para la imagen seleccionada como portada
  const [imagenPortadaSeleccionada, setImagenPortadaSeleccionada] = useState<number | null>(null);

  // Cargar imágenes del mueble
  useEffect(() => {
    if (show && mueble.id) {
      cargarImagenes();
    }
  }, [show, mueble.id]);

  const cargarImagenes = async () => {
    try {
      setLoading(true);
      setError('');
      const imagenesData = await MuebleService.obtenerImagenesMueble(mueble.id);
      setImagenes(imagenesData);
      
      // Encontrar la imagen actual de portada
      const imagenPortada = imagenesData.find((img: MuebleImagenes) => img.esPortada);
      if (imagenPortada) {
        setImagenPortadaSeleccionada(imagenPortada.id);
      }
    } catch (error) {
      console.error('Error al cargar imágenes:', error);
      setError('Error al cargar las imágenes del mueble');
    } finally {
      setLoading(false);
    }
  };

  // Manejar selección de nuevas imágenes
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setNuevasImagenes(files);
      
      // Crear previews de las nuevas imágenes
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        urls.push(URL.createObjectURL(files[i]));
      }
      setPreviewUrls(urls);
    }
  };

  // Eliminar imagen existente
  const handleEliminarImagen = async (imagenId: number) => {
    if (window.confirm('¿Está seguro que desea eliminar esta imagen?')) {
      try {
        setSaving(true);
        setError('');
        await MuebleService.eliminarImagen(imagenId);
        setSuccess('Imagen eliminada exitosamente');
        
        // Recargar imágenes
        await cargarImagenes();
        
        // Si la imagen eliminada era la portada, limpiar selección
        if (imagenPortadaSeleccionada === imagenId) {
          setImagenPortadaSeleccionada(null);
        }
      } catch (error) {
        console.error('Error al eliminar imagen:', error);
        setError('Error al eliminar la imagen');
      } finally {
        setSaving(false);
      }
    }
  };

  // Manejar cambio de imagen de portada
  const handlePortadaChange = (imagenId: number, isChecked: boolean) => {
    if (isChecked) {
      setImagenPortadaSeleccionada(imagenId);
    } else {
      setImagenPortadaSeleccionada(null);
    }
  };

  // Guardar cambios
  const handleGuardar = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      let cambiosRealizados = false;

      // 1. Agregar nuevas imágenes si las hay
      if (nuevasImagenes && nuevasImagenes.length > 0) {
        await MuebleService.agregarImagenesMueble(mueble.id, nuevasImagenes);
        cambiosRealizados = true;
      }

      // 2. Establecer nueva imagen de portada si se seleccionó una diferente
      const imagenPortadaActual = imagenes.find(img => img.esPortada);
      if (imagenPortadaSeleccionada && imagenPortadaSeleccionada !== imagenPortadaActual?.id) {
        await MuebleService.establecerImagenPortada(imagenPortadaSeleccionada);
        cambiosRealizados = true;
      }

      if (cambiosRealizados) {
        // 3. Recargar imágenes para mostrar los cambios
        await cargarImagenes();
        
        // 4. Notificar al componente padre
        onImagenesActualizadas();

        // 5. Mostrar mensaje de éxito temporal
        setSuccess('Cambios guardados exitosamente');
        
        // 6. Cerrar el modal después de un breve delay para mostrar el mensaje
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setError('No hay cambios para guardar');
      }

    } catch (error) {
      console.error('Error al guardar cambios:', error);
      setError('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  // Limpiar previews al cerrar modal
  const handleClose = () => {
    // Liberar URLs de objeto para evitar memory leaks
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setNuevasImagenes(null);
    setError('');
    setSuccess('');
    onHide();
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      size="lg" 
      centered
      className="modal-gestion-imagenes"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-images me-2"></i>
          Gestión de Imágenes - {mueble.nombreMueble}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Alertas */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess('')}>
            <i className="fas fa-check-circle me-2"></i>
            {success}
          </Alert>
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Cargando imágenes...</p>
          </div>
        )}

        {/* Sección para agregar nuevas imágenes */}
        <div className="seccion-agregar-imagenes mb-4">
          <h5 className="mb-3">
            <i className="fas fa-plus-circle me-2"></i>
            Agregar Nuevas Imágenes
          </h5>
          <Form.Group>
            <Form.Label>Seleccionar imágenes (múltiples)</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              disabled={saving}
              placeholder="Selecciona una o varias imágenes..."
            />
            <Form.Text className="text-muted">
              <i className="fas fa-info-circle me-1"></i>
              Puede seleccionar múltiples imágenes a la vez manteniendo presionado Ctrl (o Cmd en Mac). 
              Formatos permitidos: JPG, PNG, GIF (máx. 5MB cada una)
            </Form.Text>
          </Form.Group>

          {/* Preview de nuevas imágenes */}
          {previewUrls.length > 0 && (
            <div className="preview-container mt-3">
              <h6>Vista previa de nuevas imágenes:</h6>
              <div className="preview-grid">
                {previewUrls.map((url, index) => (
                  <div key={index} className="preview-item">
                    <img src={url} alt={`Preview ${index + 1}`} className="preview-image" />
                    <span className="preview-label">Nueva imagen {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabla de imágenes existentes */}
        {!loading && (
          <div className="seccion-imagenes-existentes">
            <h5 className="mb-3">
              <i className="fas fa-list me-2"></i>
              Imágenes Existentes ({imagenes.length})
            </h5>
            
            {imagenes.length === 0 ? (
              <div className="text-center py-4">
                <i className="fas fa-info-circle fa-2x text-muted mb-3"></i>
                <p className="text-muted">Este mueble no tiene imágenes aún.</p>
                <p className="text-muted">Agregue algunas imágenes usando el formulario de arriba.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th style={{ width: '100px' }}>Imagen</th>
                      <th style={{ width: '80px' }}>ID</th>
                      <th style={{ width: '180px' }}>Estado de Portada</th>
                      <th style={{ width: '100px' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {imagenes.map((imagen) => (
                      <tr key={imagen.id}>
                        <td>
                          <img
                            src={`data:image/png;base64,${imagen.imagenes}`}
                            alt={`Imagen ${imagen.id}`}
                            className="imagen-tabla"
                          />
                        </td>
                        <td>
                          <span className="badge bg-primary">#{imagen.id}</span>
                        </td>
                        <td>
                          <div className="portada-control">
                            <input
                              type="radio"
                              name="imagenPortada"
                              id={`portada-${imagen.id}`}
                              checked={imagenPortadaSeleccionada === imagen.id}
                              onChange={(e) => handlePortadaChange(imagen.id, e.target.checked)}
                              disabled={saving}
                            />
                            <label 
                              htmlFor={`portada-${imagen.id}`} 
                              className={`portada-label ${imagen.esPortada ? 'current-portada' : ''}`}
                            >
                              {imagen.esPortada ? (
                                <>
                                  <i className="fas fa-star"></i>
                                  Portada Actual
                                </>
                              ) : (
                                <>
                                  <i className="far fa-star"></i>
                                  Establecer como portada
                                </>
                              )}
                            </label>
                          </div>
                        </td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleEliminarImagen(imagen.id)}
                            disabled={saving || imagenes.length === 1}
                            title={imagenes.length === 1 ? "No se puede eliminar la única imagen" : "Eliminar imagen"}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={saving}>
          <i className="fas fa-times me-2"></i>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleGuardar}
          disabled={
            saving || 
            (
              (!nuevasImagenes || nuevasImagenes.length === 0) && 
              (imagenPortadaSeleccionada === imagenes.find(img => img.esPortada)?.id || imagenPortadaSeleccionada === null)
            )
          }
        >
          {saving ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Guardando...
            </>
          ) : (
            <>
              <i className="fas fa-save me-2"></i>
              Guardar Cambios
              {(nuevasImagenes && nuevasImagenes.length > 0) && (
                <span className="ms-1">({nuevasImagenes.length} imagen{nuevasImagenes.length > 1 ? 'es' : ''})</span>
              )}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalGestionImagenes;
