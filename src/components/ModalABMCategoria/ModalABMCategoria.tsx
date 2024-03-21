import { Categoria } from "../../types/Categoria";
import { ModalType } from "../../types/ModalType";
import { CategoriaService } from "../../services/CategoriaService";
import * as Yup from "yup";
import { useFormik } from "formik";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import { Button, FormLabel, Modal, Form } from "react-bootstrap";
import DatePicker from "react-datepicker"; // Importar react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Importar los estilos de react-datepicker

type CategoriaModalProps = {
    show: boolean;
    onHide: () => void;
    nombreCategoria: string;
    modalType: ModalType;
    cat: Categoria;
    refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalABMCategoria = ({
    show,
    onHide,
    nombreCategoria,
    cat,
    modalType,
    refreshData,
}: CategoriaModalProps) => {
    //CREATE - UPDATE
    const handleSaveUpdate = async (cat: Categoria) => {
        try {
            const isNew = cat.id === 0;
            if (isNew) {
                await CategoriaService.createCategoria(cat);
            } else {
                await CategoriaService.updateCategoria(cat.id, cat);
            }
            toast.success(isNew ? "Categoría creado" : "Categoría actualizado", {
                position: "top-center",
            });
            onHide();
            refreshData(prevState => !prevState);
        } catch (error) {
            console.error(error);
            toast.error("Ha ocurrido un error");
        }
    };

    // Función handleDelete (DELETE)
    const handleDelete = async () => {
        try {
            if (cat.id) {
                await CategoriaService.deleteCategoria(cat.id);
                toast.success("Categoría borrado", {
                    position: "top-center",
                });
                onHide();
                refreshData((prevState) => !prevState);
            } else {
                console.error("El identificador de la categoria es undefined");
            }
        } catch (error) {
            console.error(error);
            toast.error("Ha ocurrido un error");
        }
    };

    // Yup, esquema de validacion
    const validationSchema = () => {
        return Yup.object().shape({
            id: Yup.number().integer().min(0),
            nombreCategoria: Yup.string().required("El titulo es requerido"),
            fechaAltaCategoria: Yup.date().required("La fecha es requerida"),
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
                            <Modal.Title>{nombreCategoria}</Modal.Title>
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
            ) : (
                <>
                    <Modal show={show} onHide={onHide} centered backdrop="static" className="modal-xl">
                        <Modal.Header closeButton>
                            <Modal.Title> {nombreCategoria}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={formik.handleSubmit}>
                                <Form.Group controlId="formNombreCategoria">
                                    <FormLabel> Nombre de la categoría </FormLabel>
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
                                <Form.Group controlId="formfechaAltaCategoria">
                                    <FormLabel> Fecha Actual </FormLabel>
                                    <div>
                                    <DatePicker
                                        name="fechaAltaCategoria"
                                        selected={formik.values.fechaAltaCategoria ? new Date(formik.values.fechaAltaCategoria) : null}
                                        onChange={(date) => formik.setFieldValue("fechaAltaCategoria", date)}
                                        dateFormat="dd/MM/yyyy" // Establecer el formato de fecha
                                        className={formik.errors.fechaAltaCategoria && formik.touched.fechaAltaCategoria ? "is-invalid" : ""}
                                />
                                {formik.errors.fechaAltaCategoria && formik.touched.fechaAltaCategoria && (
                                    <div className="invalid-feedback">{formik.errors.fechaAltaCategoria}</div>
                                )}


                                    </div>
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
