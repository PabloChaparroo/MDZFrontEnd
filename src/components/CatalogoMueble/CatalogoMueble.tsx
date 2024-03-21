import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Navbar } from 'react-bootstrap';
import { CategoriaService } from '../../services/CategoriaService';
import { MuebleService } from '../../services/MuebleService';
import { Categoria } from '../../types/Categoria';
import { Mueble } from '../../types/Mueble';
import Loader from '../Loader/Loader';
import '../CatalogoMueble/CatalogoMueble.css'


const CatalogoMueble = () => {

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const[isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      const categorias = await CategoriaService.getAllCategoria();
      setCategorias(categorias);
      setIsLoading(false);
    };
    fetchCategorias();
  }, [refreshData]);

  const [muebles, setMuebles] = useState<Mueble[]>([]);
const [mueblesFiltrados, setMueblesFiltrados] = useState<Mueble[]>([]);



 // Función para filtrar los muebles por categoría
const filtrarMueblesPorCategoria = (categoria: string | null) => {
  if (categoria) {
    const mueblesFiltrados = muebles.filter(mueble => mueble.categoria?.nombreCategoria === categoria);
    setMueblesFiltrados(mueblesFiltrados); // Actualizamos el estado de los muebles filtrados
  } else {
    setMueblesFiltrados([]); // Si la categoría es null, establecemos la lista de muebles filtrados como vacía
  }
}
useEffect(() =>{
  //Llamamos a la funcion para obtener todos los muebles declarados en el Servicio
  const fetchMueble = async() => {
    const muebles = await MuebleService.getAllMuebles();
    setMuebles(muebles);
    setIsLoading(false);  
  };
  fetchMueble();
}, [refreshData]);




// Llamada a la función de filtrado cada vez que se selecciona una categoría
useEffect(() => {
  if (categoriaSeleccionada === 'Todos') {
    setMueblesFiltrados(muebles); // Si se selecciona "Todos", mostrar todos los muebles
  } else {
    const mueblesFiltrados = muebles.filter(mueble => mueble.categoria?.nombreCategoria === categoriaSeleccionada);
    setMueblesFiltrados(mueblesFiltrados);
  }
}, [categoriaSeleccionada, muebles]);



     //Transforma el JSon en un formato mas legible
  console.log(JSON.stringify(categorias, null, 2));
  //Transforma el JSon en un formato mas legible
   console.log(JSON.stringify(muebles, null, 2));

//Logica de Modal categoria 
const handleClickCategoria = (categoria : string)=>{
  setCategoriaSeleccionada(categoria);
}
const handleMostrarTodos = () => {
  setCategoriaSeleccionada('Todos');
}

  return (
    <>
    <div className='category-container bg-black animate__animated animate__slideInRight'>
      
        <Button onClick={handleMostrarTodos} className='category-text bg-black '>Todos</Button>
        {categorias.map((categoria) => (
        <Button  key={categoria.id} className='category-text bg-black ' onClick={() => handleClickCategoria(categoria.nombreCategoria)}>
        {categoria.nombreCategoria}</Button>
     
        ))}
      
      </div>
      {categoriaSeleccionada && (
        <Container className ='custom-container d-flex justify-content-center  '>
          <Row className="justify-content-start" >
              {isLoading ? (
                <Loader />
              ) : (
                
                mueblesFiltrados.map((mueble) => (
                  
                <div className='col-md-4'  key={mueble.id} >
                      <div className='card text-center bg-black animate__animated animate__backInUp'>
                        <div className='overflow'>
                          <img src={mueble.imagen} alt={mueble.nombreMueble} className='card-img-top ' />
                        </div>
                          <div className='card-body'>
                            <h3 className='card-title text-light'>
                              {mueble.nombreMueble}
                            </h3>
                            <a href='#!' className='btn btn-outline-secondary rounded-0'>
                              Leer más
                            </a>
                          </div> 
                        </div>
                      </div>
                    
                  
                
)))}</Row>
</Container> )
            }
          
        
      
    </>
  );
};
          

    

export default CatalogoMueble;
