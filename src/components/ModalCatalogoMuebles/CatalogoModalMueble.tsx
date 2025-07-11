import { Button, Form, Modal, FormLabel, Table } from "react-bootstrap";
import './CatalogoModalMueble.css';
import { ModalType } from "../../types/ModalType";
import { Mueble } from "../../types/Mueble";

import * as Yup from "yup";
import { useFormik } from "formik";
import { MuebleService } from "../../services/MuebleService";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Categoria } from "../../types/Categoria";
import React, { useState } from "react";
import ImagenesModal, { SelectedFile } from "../ImagenesModal/ImagenesModal";

//que tipo de props puede recibir este componente 
type CatalogoModalMuebleProps = {
    show: boolean;
    onHide:() => void;
    modalType: ModalType;
    mue: Mueble;
    refreshData: React.Dispatch<React.SetStateAction<boolean>>;
    categoria: string; // Nuevo prop para almacenar la categoría seleccionada
    categorias: Categoria[]; // Lista de categorías
}

const CatalogoModalMueble = ({show, onHide, mue, modalType,refreshData, categoria,categorias  }: CatalogoModalMuebleProps) => {
    const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]); // Array de archivos seleccionados
    const [showImagenesModal, setShowImagenesModal] = useState(false); // Estado para controlar el modal de imágenes
    const [isLoading, setIsLoading] = useState(false); // Estado para mostrar indicador de carga

    // Función para abrir el modal de imágenes
    const handleOpenImagenesModal = () => {
        setShowImagenesModal(true);
    };

    // Función para cerrar el modal de imágenes
    const handleCloseImagenesModal = () => {
        setShowImagenesModal(false);
    };

    // Función para guardar las imágenes seleccionadas desde el modal
    const handleSaveImagenes = (imagenes: SelectedFile[]) => {
        setSelectedFiles(imagenes);
        toast.success(`${imagenes.length} imagen(es) seleccionada(s)`, {
            autoClose: 3000,
        });
    };

    // Función para obtener el título del modal según el tipo
    const getModalTitle = () => {
        switch (modalType) {
            case ModalType.CREATE:
                return "Crear Nuevo Mueble";
            case ModalType.UPDATE:
                return "Editar Mueble";
            case ModalType.DELETE:
                return "Eliminar Mueble";
            case ModalType.BAJA_LOGICA:
                return "Dar de Baja Mueble";
            default:
                return "Mueble";
        }
    };

    //CREATE - UPDATE
    const handleSaveUpdate = async(mue: Mueble)=>{
        setIsLoading(true); // Activar indicador de carga
        
        try {
            const isNew = mue.id === 0;
            
            // Si es un mueble nuevo, asignar la categoría seleccionada
            if (isNew && categoria) {
                const selectedCategory = categorias.find(c => c.nombreCategoria === categoria);
                if (selectedCategory) {
                    mue.categoria = selectedCategory;
                }
            }
            
            // Optimización: calcular valores una sola vez
            const selectedCategory = categorias.find(c => c.nombreCategoria === categoria);
            const portadaIndex = selectedFiles.findIndex(file => file.esPortada);
            
            if (isNew) {
                // Crear nuevo mueble
                if (!selectedCategory) {
                    throw new Error("Categoría no encontrada");
                }
                
                if (selectedFiles.length > 0) {
                    // Crear con imágenes
                    const fileList = new DataTransfer();
                    selectedFiles.forEach((file) => fileList.items.add(file.file));
                    
                    await MuebleService.createMueble(
                        mue, 
                        selectedCategory.id, 
                        fileList.files, 
                        portadaIndex
                    );
                } else {
                    // Crear sin imágenes
                    await MuebleService.createMueble(
                        mue, 
                        selectedCategory.id, 
                        new DataTransfer().files,
                        0
                    );
                }
            } else {
                // Actualizar mueble existente
                if (selectedFiles.length > 0) {
                    // Actualizar con imágenes
                    const fileList = new DataTransfer();
                    selectedFiles.forEach((file) => fileList.items.add(file.file));
                    
                    await MuebleService.updateMueble(mue.id, mue, fileList.files, portadaIndex);
                } else {
                    // Actualizar sin imágenes
                    await MuebleService.updateMueble(mue.id, mue, null);
                }
            }
            
            toast.success(isNew ? "Producto creado exitosamente" : "Producto actualizado exitosamente", {
                autoClose: 3000,
            });
            
            refreshData(prevState => !prevState);
            onHide();
            
        } catch(error) {
            console.error(error);
            
            // Mejorar manejo de errores
            let errorMessage = "Ha ocurrido un error al guardar el mueble";
            
            if (error instanceof Error) {
                const errorText = error.message;
                if (errorText.includes("Categoría no encontrada")) {
                    errorMessage = "Error: Categoría no encontrada";
                } else if (errorText.includes("Detalles:")) {
                    // Extraer mensaje específico del backend
                    try {
                        const jsonMatch = errorText.match(/Detalles: ({.*})/);
                        if (jsonMatch && jsonMatch[1]) {
                            const errorObj = JSON.parse(jsonMatch[1]);
                            if (errorObj.error) {
                                errorMessage = errorObj.error;
                            }
                        }
                    } catch (jsonError) {
                        // Si no se puede parsear, usar mensaje original
                        errorMessage = errorText;
                    }
                } else {
                    errorMessage = errorText;
                }
            }
            
            toast.error(errorMessage, {
                autoClose: 5000,
            });
        } finally {
            setIsLoading(false); // Desactivar indicador de carga
        }
    };

    //Función handleDelete (DELETE)
    const handleDelete = async () => {
        setIsLoading(true); // Activar indicador de carga
        
        try {
            if (mue.id) {
                await MuebleService.deleteMueble(mue.id);
                toast.success("Producto eliminado exitosamente", {
                    autoClose: 3000,
                });
                refreshData(prevState => !prevState);
                onHide();
            } else {
                throw new Error("El identificador del mueble es inválido");
            }
        } catch (error) {
            console.error(error);
            toast.error("Ha ocurrido un error al eliminar el producto", {
                autoClose: 5000,
            });
        } finally {
            setIsLoading(false); // Desactivar indicador de carga
        }
    }

    //Función handleBajaLogica (BAJA_LOGICA)
    const handleBajaLogica = async () => {
        setIsLoading(true); // Activar indicador de carga
        
        try {
            if (mue.id) {
                await MuebleService.bajaLogicaMueble(mue.id);
                toast.success("Producto dado de baja exitosamente", {
                    autoClose: 3000,
                });
                refreshData(prevState => !prevState);
                onHide();
            } else {
                throw new Error("El identificador del mueble es inválido");
            }
        } catch (error) {
            console.error(error);
            toast.error("Ha ocurrido un error al dar de baja el producto", {
                autoClose: 5000,
            });
        } finally {
            setIsLoading(false); // Desactivar indicador de carga
        }
    }

    //Yup, esquema de validacion
    const validationSchema = () => {
        return Yup.object().shape({
            id: Yup.number().integer().min(0),
            nombreMueble: Yup.string().required('El titulo es requerido'),
            colorMueble: Yup.string().min(0).required('El color es requido'),
            dimension: Yup.string().nullable().optional(), // Campo opcional
            tipoMadera: Yup.string().required('El tipo madera es requerido'),
            precio: Yup.number().nullable().optional().test('positive', 'El precio tiene que ser positivo', value => {
                return value === null || value === undefined || value > 0;
            }), // Campo opcional
            descripcion: Yup.string().min(0).required('La descripción es requerida'),
        });
    };

    //Formik, utiliza el esquema de validación para crear un formulario dinámico y que bloquee el formulario en caso de ver errores
    const formik = useFormik({
        initialValues: mue,
        validationSchema: validationSchema(),
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (obj: Mueble) => handleSaveUpdate(obj),
    });

    // Función para eliminar una imagen seleccionada (eliminada - ahora se maneja en ImagenesModal)
    // const handleDeleteImage = (indexToDelete: number) => {
    //     const updatedFiles = selectedFiles.filter((_, index) => index !== indexToDelete);
    //     setSelectedFiles(updatedFiles);
    // };

  return  (
    <>
    {modalType === ModalType.DELETE || modalType === ModalType.BAJA_LOGICA ?( 
        <> 
         <Modal show={show} onHide={onHide} centered backdrop="static" dialogClassName="responsive-scrollable-modal">
            <Modal.Header closeButton>
                <Modal.Title>{getModalTitle()}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="modal-body-scrollable">
                <p> 
                    {modalType === ModalType.DELETE 
                        ? "¿Está seguro que desea eliminar el producto"
                        : "¿Está seguro que desea dar de baja el producto"
                    }
                    <br /> <strong> {mue.nombreMueble} </strong> ?
                </p>
                {modalType === ModalType.BAJA_LOGICA && (
                    <div className="alert alert-info mt-3">
                        <i className="fas fa-info-circle me-2"></i>
                        El producto será dado de baja pero se mantendrá en el sistema para consultas históricas.
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={isLoading}>
                    Cancelar
                </Button>

                <Button 
                    variant={modalType === ModalType.DELETE ? "danger" : "warning"} 
                    onClick={modalType === ModalType.DELETE ? handleDelete : handleBajaLogica} 
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {modalType === ModalType.DELETE ? "Eliminando..." : "Dando de baja..."}
                        </>
                    ) : (
                        <>
                            <i className={`fas ${modalType === ModalType.DELETE ? 'fa-trash' : 'fa-ban'} me-2`}></i>
                            {modalType === ModalType.DELETE ? "Eliminar" : "Dar de Baja"}
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
        </>     
    ) : (
        <>
        <Modal show={show} onHide={onHide} centered backdrop="static" dialogClassName="responsive-scrollable-modal">
            <Modal.Header closeButton>
                <Modal.Title>
                    {isLoading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
                    {getModalTitle()}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-scrollable">
                <Form onSubmit={formik.handleSubmit}>
                    <fieldset disabled={isLoading}>
                    <Form.Group controlId="formNombreMueble">
                        <FormLabel> Nombre del Mueble </FormLabel>
                        <Form.Control
                            name= "nombreMueble"
                            type="text"
                            value={formik.values.nombreMueble ||''}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            isInvalid= {Boolean(formik.errors.nombreMueble && formik.touched.nombreMueble)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.nombreMueble}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formColorMueble">
                        <FormLabel> Color </FormLabel>
                        <Form.Control
                            name= "colorMueble"
                            type="text"
                            value={formik.values.colorMueble ||''}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            isInvalid= {Boolean(formik.errors.colorMueble && formik.touched.colorMueble)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.colorMueble}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formDimension">
                        <FormLabel> Tamaño <small className="text-muted">(opcional)</small></FormLabel>
                        <Form.Control
                            name= "dimension"
                            type="text"
                            placeholder="Ej: 200cm x 100cm x 50cm"
                            value={formik.values.dimension ||''}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            isInvalid= {Boolean(formik.errors.dimension && formik.touched.dimension)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.dimension}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formTipoMadera">
                        <FormLabel> Tipo de madera </FormLabel>
                        <Form.Control
                            as="select"
                            name="tipoMadera"
                            value={formik.values.tipoMadera || ''}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            isInvalid={Boolean(formik.errors.tipoMadera && formik.touched.tipoMadera)}
                        >
                            <option value="">Selecciona un tipo de madera</option>
                            <option value="MELAMINA">MELAMINA</option>
                        </Form.Control>
                        {formik.errors.tipoMadera && formik.touched.tipoMadera && (
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.tipoMadera}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>

                    <Form.Group controlId="formPrecio">
                        <FormLabel> Precio <small className="text-muted">(opcional)</small></FormLabel>
                        <Form.Control
                            name= "precio"
                            type="number"
                            placeholder="Ingrese el precio"
                            value={formik.values.precio ||''}
                            min="0"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            isInvalid= {Boolean(formik.errors.precio && !!formik.touched.precio)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.precio}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formDescripcion">
                        <FormLabel> Descripción </FormLabel>
                        <Form.Control
                            name= "descripcion"
                            type="text"
                            value={formik.values.descripcion ||''}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            isInvalid= {Boolean(formik.errors.descripcion && formik.touched.descripcion)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.descripcion}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Solo mostrar la sección de imágenes al crear un mueble nuevo */}
                    {modalType === ModalType.CREATE && (
                        <>                    {/* Sección de imágenes - Solo mostrar al crear un mueble nuevo */}
                    {modalType === ModalType.CREATE && (
                        <>
                            <hr/>

                            <Form.Group controlId="formImagenes">
                                <FormLabel>
                                    <i className="fas fa-images me-2"></i>
                                    Imágenes del Mueble
                                </FormLabel>
                                
                                {/* Botón para abrir el modal de imágenes */}
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <Button 
                                        variant="outline-primary" 
                                        onClick={handleOpenImagenesModal}
                                        className="me-2"
                                        disabled={isLoading}
                                    >
                                        <i className="fas fa-plus me-2"></i>
                                        {selectedFiles.length > 0 ? 'Editar Imágenes' : 'Agregar Imágenes'}
                                    </Button>
                                    
                                    {selectedFiles.length > 0 && (
                                        <span className="badge bg-success">
                                            {selectedFiles.length} imagen(es) seleccionada(s)
                                        </span>
                                    )}
                                </div>

                                {/* Tabla de imágenes seleccionadas */}
                                {selectedFiles.length > 0 && (
                                    <div className="mt-3">
                                        <h6 className="mb-2">
                                            <i className="fas fa-list me-2"></i>
                                            Imágenes Seleccionadas
                                        </h6>
                                        <Table striped bordered hover size="sm" className="mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th style={{ width: '60px' }}>Orden</th>
                                                    <th style={{ width: '80px' }}>Miniatura</th>
                                                    <th>Nombre</th>
                                                    <th style={{ width: '80px' }} className="text-center">Portada</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedFiles.map((file, index) => (
                                                    <tr key={file.id}>
                                                        <td className="text-center">
                                                            <span className="badge bg-secondary">
                                                                {index + 1}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <img 
                                                                src={file.url} 
                                                                alt={`Imagen ${index + 1}`}
                                                                style={{ 
                                                                    width: '50px', 
                                                                    height: '40px', 
                                                                    objectFit: 'cover',
                                                                    borderRadius: '4px',
                                                                    border: file.esPortada ? '2px solid #28a745' : '1px solid #dee2e6'
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div className="text-truncate" style={{ maxWidth: '150px' }}>
                                                                {file.file.name}
                                                            </div>
                                                            <small className="text-muted">
                                                                {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                                            </small>
                                                        </td>
                                                        <td className="text-center">
                                                            {file.esPortada && (
                                                                <i className="fas fa-check-circle text-success" title="Imagen portada"></i>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}

                                {/* Mensaje cuando no hay imágenes seleccionadas */}
                                {selectedFiles.length === 0 && (
                                    <div className="text-center py-3 bg-light rounded">
                                        <i className="fas fa-image fa-2x text-muted mb-2"></i>
                                        <p className="text-muted mb-0">No hay imágenes seleccionadas</p>
                                        <small className="text-muted">Haga clic en "Agregar Imágenes" para seleccionar</small>
                                    </div>
                                )}
                            </Form.Group>
                        </>
                    )}
                        </>
                    )}
                    </fieldset>
                </Form>

                <Modal.Footer className="mt-4">
                    <Button variant="secondary" onClick={onHide} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={!formik.isValid || isLoading}
                        onClick={(e) => {
                            e.preventDefault();
                            formik.handleSubmit();
                        }}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Guardando...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save me-2"></i>
                                Guardar
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal.Body>
        </Modal>
        
        {/* Modal de imágenes */}
        <ImagenesModal
            show={showImagenesModal}
            onHide={handleCloseImagenesModal}
            onSave={handleSaveImagenes}
            imagenesExistentes={selectedFiles}
        />
        </>
    )}
    
    </>
  )
}

export default CatalogoModalMueble
