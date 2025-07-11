import { Categoria } from "../../types/Categoria";
import { ModalType } from "../../types/ModalType";
import { CategoriaService } from "../../services/CategoriaService";
import * as Yup from "yup";
import { useFormik } from "formik";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import { Button, FormLabel, Modal, Form } from "react-bootstrap";
import { useState } from "react";

type CategoriaModalProps = {
    show: boolean;
    onHide: () => void;
    modalType: ModalType;
    cat: Categoria;
    refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalABMCategoria = ({
    show,
    onHide,
    cat,
    modalType,
    refreshData,
}: CategoriaModalProps) => {

    const [isLoading, setIsLoading] = useState(false); // Estado para controlar la carga

    // Función para obtener el título del modal según el tipo
    const getModalTitle = () => {
        switch (modalType) {
            case ModalType.CREATE:
                return "Crear Nueva Categoría";
            case ModalType.UPDATE:
                return "Editar Categoría";
            case ModalType.BAJA_LOGICA:
                return "Dar de Baja Categoría";
            default:
                return "Categoría";
        }
    };

    //CREATE - UPDATE
    const handleSaveUpdate = async (cat: Categoria) => {
        setIsLoading(true); // Activar indicador de carga
        
        try {
            const isNew = cat.id === 0;
            
            if (isNew) {
                await CategoriaService.createCategoria(cat);
                toast.success("Categoría creada exitosamente", {
                    autoClose: 3000,
                });
            } else {
                await CategoriaService.updateCategoria(cat.id, cat);
                toast.success("Categoría actualizada exitosamente", {
                    autoClose: 3000,
                });
            }
            
            // Refrescar datos inmediatamente
            refreshData(prevState => !prevState);
            
            // Cerrar modal sin delay
            onHide();
           
        } catch (error) {
            console.error(error);
            
            // Optimizar manejo de errores
            let errorMessage = "Ha ocurrido un error al guardar la categoría";
            
            if (error instanceof Error) {
                const errorText = error.message;
                
                if (errorText.includes("Ya existe una categoría")) {
                    const matches = errorText.match(/Ya existe una categoría[^"]*/);
                    if (matches) {
                        errorMessage = matches[0];
                    }
                } else if (errorText.includes("Detalles:")) {
                    try {
                        const jsonMatch = errorText.match(/Detalles: ({.*})/);
                        if (jsonMatch && jsonMatch[1]) {
                            const errorObj = JSON.parse(jsonMatch[1]);
                            if (errorObj.error) {
                                errorMessage = errorObj.error;
                            }
                        }
                    } catch (jsonError) {
                        // Usar mensaje original si no se puede parsear
                        const detailsMatch = errorText.match(/Detalles: (.+)$/);
                        if (detailsMatch && detailsMatch[1]) {
                            errorMessage = detailsMatch[1];
                        }
                    }
                }
            }
            
            toast.error(errorMessage, {
                autoClose: 5000,
            });
        } finally {
            setIsLoading(false); // Desactivar indicador de carga
        }
    };

    // Función handleBajaLogica (BAJA_LOGICA)
    const handleBajaLogica = async () => {
        setIsLoading(true); // Activar indicador de carga
        
        try {
            if (cat.id) {
                const response = await CategoriaService.bajaLogicaCategoria(cat.id);
                toast.success(`Categoría dada de baja exitosamente el ${response.fechaBaja}`, {
                    autoClose: 3000,
                });
                
                // Refrescar datos inmediatamente
                refreshData(prevState => !prevState);
                
                // Cerrar modal sin delay
                onHide();
            } else {
                throw new Error("El identificador de la categoría es inválido");
            }
        } catch (error) {
            console.error(error);
            
            // Optimizar manejo de errores
            let errorMessage = "Ha ocurrido un error al dar de baja la categoría";
            
            if (error instanceof Error) {
                const errorText = error.message;
                
                if (errorText.includes("Detalles:")) {
                    try {
                        const jsonMatch = errorText.match(/Detalles: ({.*})/);
                        if (jsonMatch && jsonMatch[1]) {
                            const errorObj = JSON.parse(jsonMatch[1]);
                            if (errorObj.error) {
                                errorMessage = errorObj.error;
                            }
                        }
                    } catch (jsonError) {
                        const detailsMatch = errorText.match(/Detalles: (.+)$/);
                        if (detailsMatch && detailsMatch[1]) {
                            errorMessage = detailsMatch[1];
                        }
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

    // Yup, esquema de validacion
    const validationSchema = () => {
        return Yup.object().shape({
            id: Yup.number().integer().min(0),
            nombreCategoria: Yup.string().required("El titulo es requerido"),
        });
    };

    // Formik, utiliza el esquema de validación para crear un formulario dinámico y que bloquee el formulario en caso de ver errores
    const formik = useFormik({
        initialValues: cat,
        validationSchema: validationSchema(),
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (obj: Categoria) => handleSaveUpdate(obj),
    });

    return (
        <>
            {modalType === ModalType.BAJA_LOGICA ? (
                <>
                    <Modal show={show} onHide={onHide} centered backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>
                                {isLoading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
                                {getModalTitle()}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>
                                ¿Está seguro que desea dar de baja la categoría?
                                <br /> <strong>{cat.nombreCategoria}</strong> ?
                            </p>
                            <div className="alert alert-warning mt-3">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                <strong>Nota:</strong> Esta acción realizará una baja lógica. 
                                La categoría no será eliminada permanentemente, solo será deshabilitada.
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={onHide} disabled={isLoading}>
                                Cancelar
                            </Button>
                            <Button variant="warning" onClick={handleBajaLogica} disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-ban me-2"></i>
                                        Dar de Baja
                                    </>
                                )}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            ) : (
                <>
                    <Modal show={show} onHide={onHide} centered backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>
                                {isLoading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
                                {getModalTitle()}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={formik.handleSubmit}>
                                <fieldset disabled={isLoading}>
                                    <Form.Group controlId="formNombreCategoria">
                                        <FormLabel> Nombre Categoría: </FormLabel>
                                        <Form.Control
                                            name="nombreCategoria"
                                            type="text"
                                            value={formik.values.nombreCategoria || ""}
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            isInvalid={Boolean(formik.errors.nombreCategoria && formik.touched.nombreCategoria)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.nombreCategoria}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </fieldset>

                                <Modal.Footer className="mt-4">
                                    <Button variant="secondary" onClick={onHide} disabled={isLoading}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={!formik.isValid || isLoading}>
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
                            </Form>
                        </Modal.Body>
                    </Modal>
                </>
            )}
        </>
    );
};

export default ModalABMCategoria;
