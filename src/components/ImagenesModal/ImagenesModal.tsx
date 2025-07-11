import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Table } from "react-bootstrap";
import { toast } from "react-toastify";

// Definir tipo de archivo
export type SelectedFile = {
    file: File;
    url: string;
    esPortada: boolean;
    id: string; // ID único para cada imagen
};

type ImagenesModalProps = {
    show: boolean;
    onHide: () => void;
    onSave: (imagenes: SelectedFile[]) => void;
    imagenesExistentes?: SelectedFile[]; // Imágenes que ya fueron seleccionadas previamente
};

const ImagenesModal = ({ show, onHide, onSave, imagenesExistentes = [] }: ImagenesModalProps) => {
    const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

    // Cargar imágenes existentes al abrir el modal
    useEffect(() => {
        if (show && imagenesExistentes.length > 0) {
            setSelectedFiles([...imagenesExistentes]);
        } else if (show) {
            setSelectedFiles([]);
        }
    }, [show, imagenesExistentes]);

    // Función para generar ID único
    const generateId = () => {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    };

    // Función para agregar nuevas imágenes (optimizada)
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newFiles: SelectedFile[] = [];
            
            // Procesar archivos de manera optimizada
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                // Validar tamaño de archivo (máximo 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    toast.warning(`El archivo ${file.name} es demasiado grande. Máximo 5MB.`, {
                        autoClose: 3000,
                    });
                    continue;
                }
                
                // Validar tipo de archivo
                if (!file.type.startsWith('image/')) {
                    toast.warning(`El archivo ${file.name} no es una imagen válida.`, {
                        autoClose: 3000,
                    });
                    continue;
                }
                
                newFiles.push({
                    file,
                    url: URL.createObjectURL(file),
                    esPortada: false,
                    id: generateId()
                });
            }

            if (newFiles.length > 0) {
                setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
                
                toast.success(`${newFiles.length} imagen(es) agregada(s)`, {
                    autoClose: 2000,
                });
            }
            
            // Limpiar el input
            event.target.value = '';
        }
    };

    // Función para marcar/desmarcar como portada
    const handlePortadaChange = (targetId: string) => {
        setSelectedFiles(prevFiles => 
            prevFiles.map(file => ({
                ...file,
                esPortada: file.id === targetId // Solo la imagen seleccionada será portada
            }))
        );
    };

    // Función para eliminar una imagen
    const handleDeleteImage = (targetId: string) => {
        setSelectedFiles(prevFiles => {
            const updatedFiles = prevFiles.filter(file => file.id !== targetId);
            
            // Si eliminamos la imagen que era portada y quedan otras imágenes, 
            // hacer que la primera sea portada automáticamente
            if (updatedFiles.length > 0 && !updatedFiles.some(file => file.esPortada)) {
                updatedFiles[0].esPortada = true;
            }
            
            return updatedFiles;
        });

        toast.success("Imagen eliminada", {
            autoClose: 3000,
        });
    };

    // Función para guardar y cerrar el modal (optimizada)
    const handleSave = () => {
        // Verificar que haya al menos una imagen
        if (selectedFiles.length === 0) {
            toast.warning("Debe seleccionar al menos una imagen", {
                autoClose: 2000,
            });
            return;
        }

        // Verificar que haya una imagen marcada como portada
        let filesToSave = [...selectedFiles];
        const hasPortada = filesToSave.some(file => file.esPortada);
        
        if (!hasPortada && filesToSave.length > 0) {
            // Marcar la primera como portada automáticamente
            filesToSave[0].esPortada = true;
            setSelectedFiles(filesToSave);
        }

        onSave(filesToSave);
        
        toast.success("Imágenes guardadas correctamente", {
            autoClose: 2000,
        });
        
        onHide();
    };

    // Función para cancelar y cerrar el modal
    const handleCancel = () => {
        // Restaurar las imágenes existentes si las había
        setSelectedFiles([...imagenesExistentes]);
        onHide();
    };

    return (
        <Modal show={show} onHide={handleCancel} centered backdrop="static" size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="fas fa-images me-2"></i>
                    Gestión de Imágenes
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* Botón para seleccionar imágenes */}
                <div className="mb-3">
                    <Form.Group>
                        <Form.Label>
                            <i className="fas fa-upload me-2"></i>
                            Seleccionar Imágenes
                        </Form.Label>
                        <Form.Control
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="mb-2"
                        />
                        <Form.Text className="text-muted">
                            Puede seleccionar múltiples imágenes. Formatos soportados: JPG, PNG, GIF
                        </Form.Text>
                    </Form.Group>
                </div>

                {/* Tabla de imágenes seleccionadas */}
                {selectedFiles.length > 0 && (
                    <div>
                        <h6 className="mb-3">
                            <i className="fas fa-list me-2"></i>
                            Imágenes Seleccionadas ({selectedFiles.length})
                        </h6>
                        
                        <Table striped bordered hover responsive className="mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th style={{ width: '80px' }}>Orden</th>
                                    <th style={{ width: '120px' }}>Miniatura</th>
                                    <th style={{ width: '200px' }}>Nombre del Archivo</th>
                                    <th style={{ width: '100px' }} className="text-center">Portada</th>
                                    <th style={{ width: '100px' }} className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedFiles.map((file, index) => (
                                    <tr key={file.id}>
                                        <td className="text-center">
                                            <span className="badge bg-primary">
                                                Imagen {index + 1}
                                            </span>
                                        </td>
                                        <td>
                                            <img 
                                                src={file.url} 
                                                alt={`Imagen ${index + 1}`}
                                                style={{ 
                                                    width: '80px', 
                                                    height: '60px', 
                                                    objectFit: 'cover',
                                                    borderRadius: '4px',
                                                    border: file.esPortada ? '3px solid #28a745' : '1px solid #dee2e6'
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <div className="text-truncate" style={{ maxWidth: '180px' }}>
                                                {file.file.name}
                                            </div>
                                            <small className="text-muted">
                                                {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                            </small>
                                        </td>
                                        <td className="text-center">
                                            <Form.Check
                                                type="checkbox"
                                                checked={file.esPortada}
                                                onChange={() => handlePortadaChange(file.id)}
                                                className={file.esPortada ? 'text-success' : ''}
                                                label={file.esPortada ? 
                                                    <><i className="fas fa-check-circle text-success"></i> Portada</> : 
                                                    "Marcar"
                                                }
                                            />
                                        </td>
                                        <td className="text-center">
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleDeleteImage(file.id)}
                                                title="Eliminar imagen"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {/* Información adicional */}
                        <div className="mt-2">
                            <small className="text-muted">
                                <i className="fas fa-info-circle me-1"></i>
                                {selectedFiles.filter(f => f.esPortada).length > 0 ? 
                                    `Imagen portada: ${selectedFiles.findIndex(f => f.esPortada) + 1}` : 
                                    "Seleccione una imagen como portada"
                                }
                            </small>
                        </div>
                    </div>
                )}

                {selectedFiles.length === 0 && (
                    <div className="text-center py-4">
                        <i className="fas fa-image fa-3x text-muted mb-3"></i>
                        <p className="text-muted">No hay imágenes seleccionadas</p>
                        <p className="text-muted">Use el botón "Seleccionar Imágenes" para agregar imágenes</p>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>
                    <i className="fas fa-times me-2"></i>
                    Cancelar
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleSave}
                    disabled={selectedFiles.length === 0}
                >
                    <i className="fas fa-save me-2"></i>
                    Guardar Imágenes ({selectedFiles.length})
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ImagenesModal;
