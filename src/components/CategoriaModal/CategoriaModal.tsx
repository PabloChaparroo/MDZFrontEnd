import { Categoria } from "../../types/Categoria";
import { ModalType } from "../../types/ModalType";
import { CategoriaService } from "../../services/CategoriaService";
import * as Yup from "yup";
import { useFormik } from "formik";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import { Button, FormLabel, Modal, Form } from "react-bootstrap";

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

    // Función para obtener el título del modal según el tipo
    const getModalTitle = () => {
        switch (modalType) {
            case ModalType.CREATE:
                return "Crear Nueva Categoría";
            case ModalType.UPDATE:
                return "Editar Categoría";
            case ModalType.DELETE:
                return "Eliminar Categoría";
            case ModalType.BAJA_LOGICA:
                return "Dar de Baja Categoría";
            default:
                return "Categoría";
        }
    };

    //CREATE - UPDATE
    const handleSaveUpdate = async (cat: Categoria) => {
        try {
            const isNew = cat.id === 0;
            if (isNew) {
                await CategoriaService.createCategoria(cat);
                toast.success("Categoría creada exitosamente", {
                    position: "top-center",
                });
            } else {
                console.log("Actualizando categoría con ID:", cat.id);
                await CategoriaService.updateCategoria(cat.id, cat);
                toast.success("Categoría actualizada exitosamente", {
                    position: "top-center",
                });
            }
            
            // Cerrar el modal primero
            onHide();
            
            // Luego refrescar los datos
            refreshData(prevState => !prevState);
           
        } catch (error) {
            console.error(error);
            toast.error("Ha ocurrido un error al guardar la categoría");
        }
    };

    // Función handleDelete (DELETE)
    const handleDelete = async () => {
        try {
            if (cat.id) {
                await CategoriaService.deleteCategoria(cat.id);
                toast.success("Categoría eliminada exitosamente", {
                    position: "top-center",
                });
                
                // Cerrar el modal primero
                onHide();
                
                // Luego refrescar los datos
                refreshData(prevState => !prevState);
            } else {
                console.error("El identificador de la categoria es undefined");
                toast.error("Error: No se pudo identificar la categoría");
            }
        } catch (error) {
            console.error(error);
            toast.error("Ha ocurrido un error al eliminar la categoría");
        }
    };

    // Función handleBajaLogica (BAJA_LOGICA)
    const handleBajaLogica = async () => {
        try {
            if (cat.id) {
                const response = await CategoriaService.bajaLogicaCategoria(cat.id);
                toast.success(`Categoría dada de baja exitosamente el ${response.fechaBaja}`, {
                    position: "top-center",
                });
                
                // Cerrar el modal primero
                onHide();
                
                // Luego refrescar los datos
                refreshData(prevState => !prevState);
            } else {
                console.error("El identificador de la categoria es undefined");
                toast.error("Error: No se pudo identificar la categoría");
            }
        } catch (error) {
            console.error(error);
            toast.error("Ha ocurrido un error al dar de baja la categoría");
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
            {modalType === ModalType.DELETE ? (
                <>
                    <Modal show={show} onHide={onHide} centered backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>{getModalTitle()}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>
                                ¿Está seguro que desea eliminar la categoría?
                                <br /> <strong>{cat.nombreCategoria}</strong> ?
                            </p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={onHide}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={handleDelete}>
                                Borrar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            ) : modalType === ModalType.BAJA_LOGICA ? (
                <>
                    <Modal show={show} onHide={onHide} centered backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>{getModalTitle()}</Modal.Title>
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
                            <Button variant="secondary" onClick={onHide}>
                                Cancelar
                            </Button>
                            <Button variant="warning" onClick={handleBajaLogica}>
                                Dar de Baja
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            ) : (
                <>
                    <Modal show={show} onHide={onHide} centered backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>{getModalTitle()}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={formik.handleSubmit}>
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

                                <Modal.Footer className="mt-4">
                                    <Button variant="secondary" onClick={onHide}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={!formik.isValid}>
                                        Guardar
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
