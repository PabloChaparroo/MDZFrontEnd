import { useEffect, useState } from 'react'

;
import { Mueble } from '../../types/Mueble';
import { MuebleService } from '../../services/MuebleService';
import { Button, Table } from 'react-bootstrap';
import Loader from '../Loader/Loader';
import { ModalType } from '../../types/ModalType';
import CatalogoModalMueble from '../ModalCatalogoMuebles/CatalogoModalMueble';
import { EditButton } from '../EditButton/EditButton';

import DeleteButton from '../DeleteButton/DeleteButton';
import { Categoria } from '../../types/Categoria';
import { CategoriaService } from '../../services/CategoriaService';
import '../CatalogoMueble/CatalogoMueble.css'
import ModalABMCategoria from '../ModalABMCategoria/ModalABMCategoria';
import { useLocation } from 'react-router-dom';
import './CatalogoTabla.css'
import InhabilitarButton from '../InhabilitarButton/InhabilitarButton';




const CatalogoTabla = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Desplaza la ventana hacia arriba al acceder a la página de inicio
  }, [location]); // Ejecuta el efecto cada vez que cambie la ubicación
   
//----------------------Principal--------------------------
//Varibale que muestra el componente Loeader Hasta que se reciban los datos de la API
const[isLoading, setIsLoading] = useState(true); 
//Variable que va actualizar los datos de la tabla luego de cada operacion exitosa
const [refreshData, setRefreshData] = useState(false);
//const para manejar el estado del Modal
const [showModal, setShowModal] = useState(false);        //No se muestra en pantalla

const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);


//-------------Mostrar Categoria------------------
//Categoria
const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(""); // Nueva variable de estado para la categoría seleccionada
const [categorias, setCategorias] = useState<Categoria[]>([]); // Variable de estado para almacenar las categorías
//Este hook se va a ejecutar cada vez que se renderice el componente
  //O refreshData cambie el estado 





  useEffect(() =>{
    //Llamamos a la funcion para obtener todos los muebles declarados en el Servicio
    const fetchCategoria= async() => {
      const categorias = await CategoriaService.getAllCategoria();
      setCategorias(categorias);
      setIsLoading(false);
    };
    fetchCategoria();
  }, [refreshData]);

// Función para filtrar los muebles por categoría
const filtrarMueblesPorCategoria = (categoria: string | null) => {
  if (categoria) {
    const mueblesFiltrados = muebles.filter(mueble => mueble.categoria?.nombreCategoria === categoria);
    setMueblesFiltrados(mueblesFiltrados); // Actualizamos el estado de los muebles filtrados
     //Transforma el JSon en un formato mas legible
    console.log(JSON.stringify(muebles, null, 2));
  } else {
    setMueblesFiltrados([]); // Si la categoría es null, establecemos la lista de muebles filtrados como vacía
  }
}
// Llamada a la función de filtrado cada vez que se selecciona una categoría
useEffect(() => {
  filtrarMueblesPorCategoria(categoriaSeleccionada);
   //Transforma el JSon en un formato mas legible
 console.log(JSON.stringify(categorias, null, 2));
}, [categoriaSeleccionada]);

//Logica de Modal categoria 
const handleClickCategoria = (categoria : string)=>{
  setCategoriaSeleccionada(categoria);
  setEditCategory(false);
 

  
}

//Se inicializa una categoria vacio cuando vayamos a crear uno nuevo, para evitar "undefined"
const initializeNewCategoria = (): Categoria => {
  return {
      id: 0,
      nombreCategoria:'',
      fechaAltaCategoria: '',
      fechaModificacionCategoria: '',
  };
};

  
//Es el mueble seleccionado para pasar como prop al modal
const [categoria, setCategoria] = useState<Categoria>(initializeNewCategoria);

const [nombreCategoria, setNombreCategoria] = useState("");

//Logica de Modal de caregoria 
const handleClickCategoriaButton = (newNombreCategoria: string, cat: Categoria, modal: ModalType) => {
  setNombreCategoria(newNombreCategoria);
  setModalType(modal);
  setCategoria(cat);
  setShowEditCategory(true);
  setRefreshData(!refreshData);
};




//-----------------------Mueble--------------------
//Variable que va a conetener los datos recibidos por la API
const [muebles, setMuebles] = useState<Mueble[]>([]);
const [mueblesFiltrados, setMueblesFiltrados] = useState<Mueble[]>([]);
//Este hook se va a ejecutar cada vez que se renderice el componente
  //O refreshData cambie el estado 
  
  useEffect(() =>{
    //Llamamos a la funcion para obtener todos los muebles declarados en el Servicio
    const fetchMueble = async() => {
      const muebles = await MuebleService.getAllMuebles();
      setMuebles(muebles);
      setIsLoading(false);  
    };
    fetchMueble();
  }, [refreshData]);
/*
useEffect(() =>{
  if (categoriaSeleccionada) {
    const fetchMueble = async () => {
      const muebles = await MuebleService.getAllMuebles(categoriaSeleccionada);
      setMueblesFiltrados(muebles);
      setIsLoading(false);
    };
    fetchMueble();
  }
}, [categoriaSeleccionada]);*/

  

//Se inicializa un mueble vacio cuando vayamos a crear uno nuevo, para evitar "undefined"
const initializeNewMueble= (): Mueble => {
  return {
      id: 0,
      nombreMueble:'',
      fechaAltaMueble: '',
      fechaModificacionMueble:'',
      fechaBajaMueble:'',
      colorMueble: '',
      dimension: '',
      tipoMadera:'',
      precio: 0,
      descripcion: '',
      imagenes: [],
      categoria: null,
      
     
  };
};



//Es el mueble seleccionado para pasar como prop al modal
const [mueble, setMueble] = useState<Mueble>(initializeNewMueble);

const [nombreMueble, setNombreMueble] = useState("");


//Logica de Modal
const handleClick = (newNombreMueble: string, mue: Mueble, modal: ModalType) => {
  setNombreMueble(newNombreMueble);
  setModalType(modal);
  setMueble(mue);
 setCategoriaSeleccionada(categoriaSeleccionada); //Le paso tambien la categoria al modal
 filtrarMueblesPorCategoria(categoriaSeleccionada);
  setShowModal(true);
  setRefreshData(!refreshData);
  
};


const handleClickMueblesInhabilitados = () => {

  
};
const handleClickMueblesEditarPrecios = () => {

  
};
//-------------------------------------------









 

 


const [showEditCategory, setShowEditCategory] = useState(false)
const [editCategory, setEditCategory] = useState(false)


const handleClickEditCategory = ()=>{
  setEditCategory(true);
  setCategoriaSeleccionada("");
}



return( 
<>
<div className='category-container bg-black'>
  
         {/*Itera sobre las categorías para generar los botones */}
        {categorias.map((categoria) => (

          <Button  key={categoria.id} className='category-text bg-black' onClick={() => handleClickCategoria(categoria.nombreCategoria)}>{categoria.nombreCategoria}</Button>
          

        ))}
          
        <Button className='category-text bg-dark' onClick={() => handleClickEditCategory()}> Editar Categorías </Button>

      </div >
      {
        editCategory && (
          <>
          
          <Button className='category-text bg-black' onClick={() => handleClickCategoriaButton("Editar Categoría",
        initializeNewCategoria(), ModalType.CREATE)}>
        NUEVA CATEGORÍA
      </Button>
      <div style={{ overflowX: 'auto' }}> 
        <Table hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>NOMBRE</th>
              <th>FECHA CREACIÓN</th>
              <th>FECHA MODIFICACIÓN</th>
              <th>EDITAR</th>
              <th>BORRAR</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.id}</td>
                <td>{categoria.nombreCategoria}</td>
                <td>{categoria.fechaAltaCategoria}</td>
                <td>{categoria.fechaModificacionCategoria}</td>
                <td><EditButton onClick={() => handleClickCategoriaButton("Editar categoria", categoria, ModalType.UPDATE)}/></td>
                <td><DeleteButton onClick={() => handleClickCategoriaButton("Borrar categoria", categoria, ModalType.DELETE)}/></td>
                
              </tr>
            ))}
          </tbody>
        </Table>
        </div>
        {showEditCategory && (
  <ModalABMCategoria
  show = {showEditCategory}
  onHide={() => setShowEditCategory(false)}
  nombreCategoria={nombreCategoria}
  modalType={modalType}
  cat= {categoria}
  refreshData= {setRefreshData}

  />
  )}
  
      </>
      
        )
      }
          {/* Renderiza la tabla solo si se ha seleccionado una categoría */}
      {categoriaSeleccionada && (
       
       <>

       {/* Botón para que cuando el usuario haga click llame a la función que declaramos*/} 
<Button className='category-text bg-black' onClick={() => handleClick("Nuevo mueble",
        initializeNewMueble(), ModalType.CREATE)}>
        Nuevo Mueble
</Button>

<Button className='category-text bg-black' onClick={() => handleClickMueblesInhabilitados()}>
        Muebles Inhabilitados
</Button>
      
<Button className='category-text bg-black' onClick={() => handleClickMueblesEditarPrecios()}>
        Editar precios
</Button>
{isLoading ? <Loader/>: (
   <div style={{ overflowX: 'auto' }}> 
<Table hover>
    <thead>
        <tr>
            <th> ID </th>
            <th> NOMBRE </th>
            <th> FECHA CREACIÓN</th>
            <th> FECHA MODIFICACION</th>
            <th> COLOR </th>
            <th> TAMAÑO </th>
            <th> TIPO DE MADERA </th>
            <th> PRECIO </th>
            <th> DESCRIPCIÓN </th>
            <th> IMAGEN </th>
            <th> EDITAR </th>
            <th> INHABILITAR</th>
            <th> BORRAR </th>
        </tr>
    </thead>

    <tbody>
    {mueblesFiltrados.map((mueble) => ( //cambie por mueble
      <tr key={mueble.id}>
        <td>{mueble.id}</td>
        <td>{mueble.nombreMueble}</td>
        <td>{mueble.fechaAltaMueble}</td>
        <td>{mueble.fechaModificacionMueble}</td>
        <td>{mueble.colorMueble}</td>
        <td>{mueble.dimension}</td>
        <td>{mueble.tipoMadera}</td>
        <td>{mueble.precio}</td>
        <td style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
  {mueble.descripcion}
</td>


        <td>{mueble.imagenes.filter(imagen => imagen.esPortada).map((imagen, index) => (
                <img 
                    key={index}
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                    className='card simg-fluid card-img-top'
                    src={`data:image/png;base64, ${imagen.imagenes}`}
                    alt={mueble.nombreMueble}
                />
                ))}</td>
        <td><EditButton onClick={()=>handleClick("Editar producto", mueble,ModalType.UPDATE)}/></td>
        <td><InhabilitarButton onClick={()=>handleClick("Inhabilitar mueble", mueble,ModalType.UPDATE)}/></td>
        <td><DeleteButton onClick={()=>handleClick("Eliminar producto", mueble,ModalType.DELETE)}/></td>

        </tr>
        ))}
    </tbody>
</Table>
</div>

)}

{showModal && ( 
  <CatalogoModalMueble
  show = {showModal}
  onHide={() => setShowModal(false)}
  nombreMueble={nombreMueble}
  modalType={modalType}
  mue= {mueble}
  refreshData= {setRefreshData}
  categoria={categoriaSeleccionada} // Pasa la categoría al modal
  categorias={categorias}
  
 

  
  />
  )}
  

  
 
</>
)}

</>
);
};
export default CatalogoTabla;

