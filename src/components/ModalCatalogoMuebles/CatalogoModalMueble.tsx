import { Button, Form, Modal, FormLabel, FormCheck } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import { Mueble } from "../../types/Mueble";

import * as Yup from "yup";
import { useFormik } from "formik";
import { MuebleService } from "../../services/MuebleService";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Categoria } from "../../types/Categoria";
import React, { useState } from "react";

// Definir tipo de archivo
type SelectedFile = {
    file: File;
    url: string;
    esPortada: boolean; // Nuevo atributo para indicar si la imagen es la portada o no
  };

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

    // Función para obtener el título del modal según el tipo
    const getModalTitle = () => {
        switch (modalType) {
            case ModalType.CREATE:
                return "Crear Nuevo Mueble";
            case ModalType.UPDATE:
                return "Editar Mueble";
            case ModalType.DELETE:
                return "Eliminar Mueble";
            default:
                return "Mueble";
        }
    };

    //CREATE - UPDATE
    const handleSaveUpdate = async(mue: Mueble)=>{
        console.log("Guardando o actualizando el mueble...");
        try {
           
            const isNew = mue.id === 0;
       
            
            console.log("Valor de isNew:", isNew);
            console.log("Valor de selectedFiles:", selectedFiles);
            
            // Si es un mueble nuevo, asignar la categoría seleccionada
            if (isNew && categoria) {
                const selectedCategory = categorias.find(c => c.nombreCategoria === categoria);
                if (selectedCategory) {
                    mue.categoria = selectedCategory;
                    console.log("Categoría asignada:", selectedCategory);
                }
            }
            
            if (isNew && selectedFiles.length > 0) {
                console.log("Se cumple la condición de crear un nuevo mueble con imágenes.");
                
                // Convertir array de SelectedFile a FileList
                const fileList = new DataTransfer();
                selectedFiles.forEach((file) => fileList.items.add(file.file));
                
                // Crear el mueble
                await MuebleService.createMueble(mue, fileList.files, selectedFiles.findIndex(file => file.esPortada));
                
            } else if (isNew && selectedFiles.length === 0) {
                console.log("Se cumple la condición de crear un nuevo mueble sin imágenes.");
                await MuebleService.createMueble(mue, new DataTransfer().files);
            }
            
            else if (!isNew && selectedFiles.length > 0) {
                console.log("Se cumple la condición actualizar un nuevo mueble.");
                //await MuebleService.updateMueble(mue.id, mue, selectedFiles.map((file) => file.file));
                 // Convertir array de SelectedFile a FileList
                const fileList = new DataTransfer();
                selectedFiles.forEach((file) => fileList.items.add(file.file));
                        
                // Actualizar el mueble
                await MuebleService.updateMueble(mue.id, mue, fileList.files, selectedFiles.findIndex(file => file.esPortada));
                
                
            } 
            else if(!isNew) {
            console.log("Se cumple la condición actualizar un nuevo mueble.");
            await MuebleService.updateMueble(mue.id, mue, null);
            
            
        }
            
            else {
                console.log("No se cumple ninguna condición.");
            }
            
            toast.success(isNew ? "Producto creado" : "Producto actualizado", {
                position: "top-center"
            });
            
            onHide();
            refreshData(prevState => !prevState);
        } catch(error) {
            console.error(error);
            toast.error("Ha ocurrido un error");
        }
    };

    //Función handleDelete (DELETE)
    const handleDelete = async () => {
        try {
            if (mue.id) { // Verificar si mue.id es válido
                await MuebleService.deleteMueble(mue.id);
                toast.success("Producto borrado", {
                    position: "top-center",
                });
                onHide();
                refreshData(prevState => !prevState);
            } else {
                console.error("El identificador del mueble es undefined");
            }
        } catch (error) {
            console.error(error);
            toast.error("Ha ocurrido un error");
            
        }
    }

    //Yup, esquema de validacion
    const validationSchema = () => {
        return Yup.object().shape({
            id: Yup.number().integer().min(0),
            nombreMueble: Yup.string().required('El titulo es requerido'),
            colorMueble: Yup.string().min(0).required('El color es requido'),
            dimension: Yup.string().required('La dimencion es requerido'),
            tipoMadera: Yup.string().required('El tipo madera es requerido'),
            precio: Yup.number().positive('El precio tiene que ser positivo').required('El precio es requerido'),
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

    // Función para eliminar un archivo seleccionado
    const handleDeleteImage = (indexToDelete: number) => {
        const updatedFiles = selectedFiles.filter((_, index) => index !== indexToDelete);
        setSelectedFiles(updatedFiles);
    };

  return  (
    <>
    {modalType === ModalType.DELETE ?( 
        <>
         <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{getModalTitle()}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p> ¿Está seguro que desea eliminar el producto  
                    <br /> <strong> {mue.nombreMueble} </strong> ?
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
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{getModalTitle()}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={formik.handleSubmit}>
                    <Form.Group controlId="formNombreMueble">
                        <FormLabel> Nombre del producto </FormLabel>
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
                        <FormLabel> Tamaño </FormLabel>
                        <Form.Control
                            name= "dimension"
                            type="text"
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
                            <option value="DURA">DURA</option>
                            <option value="HAYA">HAYA</option>
                            <option value="BLANDA">BLANDA</option>
                            <option value="PINO">PINO</option>
                            <option value="ABETO">ABETO</option>
                            <option value="OLIVO">OLIVO</option>
                            <option value="NOGAL">NOGAL</option>
                            <option value="ROBLE">ROBLE</option>
                            <option value="ABEDUL">ABEDUL</option>
                            <option value="ACACIA">ACACIA</option>
                        </Form.Control>
                        {formik.errors.tipoMadera && formik.touched.tipoMadera && (
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.tipoMadera}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>

                    <Form.Group controlId="formPrecio">
                        <FormLabel> Precio </FormLabel>
                        <Form.Control
                            name= "precio"
                            type="number"
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

                    <Form.Group controlId="formImagenes">
                        <FormLabel>Imagen</FormLabel>
                        <Form.Control
                            name="imagenes"
                            type="file"
                            onBlur={formik.handleBlur}
                            onChange={(event) => {
                                const inputElement = event.target as HTMLInputElement;
                                const files = inputElement.files;

                                if (files && files.length > 0) {
                                    const newFiles: SelectedFile[] = Array.from(files).map((file, index) => ({
                                        file,
                                        url: URL.createObjectURL(file),
                                        esPortada: index === 0 && selectedFiles.length === 0 ? true : false, // Marca la primera imagen como portada solo si no hay imágenes seleccionadas aún
                                    }));

                                    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
                                }
                            }}
                            multiple // Permite seleccionar múltiples archivos
                            isInvalid={Boolean(formik.errors.imagenes && formik.touched.imagenes)}
                        />
                        {/* Mostrar las imágenes seleccionadas */}
                        <FormLabel>Seleccione imagen de portada:</FormLabel>
                        {selectedFiles.map((file, index) => 
                        (
                            <div key={index} style={{ marginBottom: "5px" }}>
                                <FormCheck
                                    type="checkbox"
                                    id={`checkbox-${index}`}
                                    label={`Imagen ${index + 1}`}
                                    checked={file.esPortada}
                                    onChange={() => {
                                        const updatedFiles = selectedFiles.map((f, i) => ({
                                            ...f,
                                            esPortada: i === index, // Marca solo la imagen correspondiente como portada
                                        }));
                                        setSelectedFiles(updatedFiles);
                                    }}
                                />
                                <Button variant="danger" size="sm" onClick={() => handleDeleteImage(index)}>Eliminar</Button> {/* Botón para eliminar la imagen */}
                            </div>
                        ))}
                    </Form.Group>

                    <Modal.Footer className="mt-4">
                        <Button variant="secondary" onClick={onHide}> Cancelar</Button>
                        <Button variant="primary" type="submit" disabled={!formik.isValid}> Guardar</Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
        </>
    )}
    
    </>
  )
}

export default CatalogoModalMueble
