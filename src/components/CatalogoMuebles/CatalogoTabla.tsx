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




const CatalogoTabla = () => {
  

//Varibale que muestra el componente Loeader Hasta que se reciban los datos de la API
const[isLoading, setIsLoading] = useState(true); 
//Variable que va actualizar los datos de la tabla luego de cada operacion exitosa
const [refreshData, setRefreshData] = useState(false);

//Categoria
//const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(""); // Nueva variable de estado para la categoría seleccionada
//const [categorias, setCategorias] = useState<Categoria[]>([]); // Variable de estado para almacenar las categorías
//Este hook se va a ejecutar cada vez que se renderice el componente
  //O refreshData cambie el estado 
//  useEffect(() =>{
    //Llamamos a la funcion para obtener todos los muebles declarados en el Servicio
//    const fetchCategoria= async() => {
//      const categorias = await CategoriaService.getAllCategoria();
//      setCategorias(categorias);
//      setIsLoading(false);
//    };
//    fetchCategoria();
//  }, []);




//Mueble
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


//-------------------------------------------
// Función para filtrar los muebles por categoría
//const filtrarMueblesPorCategoria = (categoria: string) => {
  // Filtra los muebles basados en la categoría seleccionada
//  const mueblesFiltrados = muebles.filter(mueble => mueble.categoria);
//  setMueblesFiltrados(mueblesFiltrados);
//};
// Llama a la función de filtrado cuando se selecciona una categoría
//useEffect(() => {
//  if (categoriaSeleccionada) {
//    filtrarMueblesPorCategoria(categoriaSeleccionada);
//  }
//}, [categoriaSeleccionada, muebles]); // Escucha cambios en la categoría seleccionada y en los muebles

// Llama a la función de filtrado al inicio para asegurarse de que los muebles se muestren correctamente
//  useEffect(() => {
//    if (categoriaSeleccionada) {
//      filtrarMueblesPorCategoria(categoriaSeleccionada);
//    }
//  }, [muebles]);

 






  //Transforma el JSon en un formato mas legible
  //console.log(JSON.stringify(categorias, null, 2));


//Logica de Modal categoria 
//const handleClickCategoria = (categoria : string)=>{
//  setCategoriaSeleccionada(categoria);
//}



  

  //Transforma el JSon en un formato mas legible
  console.log(JSON.stringify(muebles, null, 2));

//Se inicializa un mueble vacio cuando vayamos a crear uno nuevo, para evitar "undefined"
const initializeNewMueble= (): Mueble => {
  return {
      id: 0,
      nombreMueble:'',
      colorMueble: '',
      dimension: '',
      tipoMadera:'',
      precio: 0,
      descripcion: '',
      imagen: '',
  };
};



//Es el mueble seleccionado para pasar como prop al modal
const [mueble, setMueble] = useState<Mueble>(initializeNewMueble);

//const para manejar el estado del Modal
const [showModal, setShowModal] = useState(false);        //No se muestra en pantalla
const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
const [nombreMueble, setNombreMueble] = useState("");

//Logica de Modal
const handleClick = (newNombreMueble: string, mue: Mueble, modal: ModalType) => {
  setNombreMueble(newNombreMueble);
  setModalType(modal);
  setMueble(mue);
  setShowModal(true);
};

return( 
<>
{/*<div>
         Itera sobre las categorías para generar los botones 
        {categorias.map((categoria) => (
          <Button key={categoria.id} onClick={() => handleClickCategoria(categoria.nombreCategoria)}>{categoria.nombreCategoria}</Button>
        ))}
      </div>
*/}
      {/* Renderiza la tabla solo si se ha seleccionado una categoría 
      {categoriaSeleccionada && (
       
       <>*/}
      
{isLoading ? <Loader/>: (
   
<Table hover>
    <thead>
        <tr>
            <th> ID </th>
            <th> NOMBRE </th>
            <th> COLOR </th>
            <th> TAMAÑO </th>
            <th> TIPO DE MADERA </th>
            <th> PRECIO </th>
            <th> DESCRIPCIÓN </th>
            <th> IMAGEN </th>
            <th> EDITAR </th>
            <th> BORRAR </th>
        </tr>
    </thead>

    <tbody>
    {muebles.map((mueble) => (
      <tr key={mueble.id}>
        <td>{mueble.id}</td>
        <td>{mueble.nombreMueble}</td>
        <td>{mueble.colorMueble}</td>
        <td>{mueble.dimension}</td>
        <td>{mueble.tipoMadera}</td>
        <td>{mueble.precio}</td>
        <td>{mueble.descripcion}</td>
        <td><img src={mueble.imagen} alt={mueble.nombreMueble} style={{width: '100px' }}/></td>
        <td><EditButton onClick={()=>handleClick("Editar producto", mueble,ModalType.UPDATE)}/></td>
        <td><DeleteButton onClick={()=>handleClick("Eliminar producto", mueble,ModalType.DELETE)}/></td>
        </tr>
        ))}
    </tbody>
</Table>
)}

{showModal && (
  <CatalogoModalMueble
  show = {showModal}
  onHide={() => setShowModal(false)}
  nombreMueble={nombreMueble}
  modalType={modalType}
  mue= {mueble}
  refreshData= {setRefreshData}
  />
)}
  

  </>

)
}

export default CatalogoTabla;

