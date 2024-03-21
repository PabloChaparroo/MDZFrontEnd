import { Button, Form, Modal, FormLabel } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import { Mueble } from "../../types/Mueble";

import * as Yup from "yup";
import { useFormik } from "formik";
import { MuebleService } from "../../services/MuebleService";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Categoria } from "../../types/Categoria";


//que tipo de props puede recibir este componente 
type CatalogoModalMuebleProps = {
    show: boolean;
    onHide:() => void;
    nombreMueble: string;
    modalType: ModalType;
    mue: Mueble;
    refreshData: React.Dispatch<React.SetStateAction<boolean>>;
    categoria: string; // Nuevo prop para almacenar la categoría seleccionada
    categorias: Categoria[]; // Lista de categorías

}

const CatalogoModalMueble = ({show, onHide, nombreMueble, mue, modalType,refreshData, categoria,categorias }: CatalogoModalMuebleProps) => {

    //CREATE - UPDATE
    const handleSaveUpdate = async(mue: Mueble)=>{
        try{
            const isNew = mue.id === 0;
            if(isNew){
                 // Buscar la categoría correspondiente al nombre seleccionado
                 const selectedCategory = categorias.find(c => c.nombreCategoria === categoria);

                 if (selectedCategory) {
                     // Si se encuentra la categoría, asigna el objeto Categoria al mueble
                     mue.categoria = selectedCategory;
                     await MuebleService.createMueble(mue);
                     
                 } else {
                     console.error("La categoría seleccionada no se encontró en la lista de categorías.");
                 }
                
            } else {
                await MuebleService.updateMueble(mue.id , mue);
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
            imagen: Yup.string().required('La URL de la imagen es requerida'),
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


  return (
    <>
    {modalType === ModalType.DELETE ?( 
        <>
         
         <Modal show={show} onHide={onHide} centered backdrop="static">
<Modal.Header closeButton>
  <Modal.Title>{nombreMueble}</Modal.Title>
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

</>     ) : (
        <>
        <Modal show={show} onHide={onHide} centered backdrop= 'static' className="modal-xl">
            <Modal.Header closeButton>
                <Modal.Title> { nombreMueble }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={formik.handleSubmit}>
{/*Form.Group por cada campo para dar de alta o modificar un producto*/}

                   
                    <Form.Group controlId="formNombreMueble">
                    <FormLabel> Nombre del producto </FormLabel>
                    <Form.Control
                        name= "nombreMueble"
                        type="text"
                        value={formik.values.nombreMueble ||''}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        isInvalid= {Boolean(formik.errors.nombreMueble && formik.touched.nombreMueble)}
                        //isInvalid= {formik.touched.nombreMueble && !!formik.errors.nombreMueble}
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
                        //isInvalid= {formik.touched.colorMueble && !!formik.errors.colorMueble}
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
                        //isInvalid= {formik.touched.dimension && !!formik.errors.dimension}
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
                        {/* Agrega más opciones según tus necesidades */}
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

                    
                    <Form.Group controlId="formImagen">
                    <FormLabel> Imagen </FormLabel>
                    <Form.Control
                        name= "imagen"
                        type="text"
                        value={formik.values.imagen ||''}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        isInvalid= {Boolean(formik.errors.imagen && formik.touched.imagen)}
                        
                        
                        />
                    <Form.Control.Feedback type="invalid">
                        {formik.errors.imagen}
                    </Form.Control.Feedback>
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
