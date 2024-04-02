import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Navbar } from 'react-bootstrap';
import { CategoriaService } from '../../services/CategoriaService';
import { MuebleService } from '../../services/MuebleService';
import { Categoria } from '../../types/Categoria';
import { Mueble } from '../../types/Mueble';
import Loader from '../Loader/Loader';
import '../CatalogoMueble/CatalogoMueble.css'
import { useLocation } from 'react-router-dom';
import { MuebleImagenes } from '../../types/MuebleImagenes';


const CatalogoMueble = () => {
  
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Desplaza la ventana hacia arriba al acceder a la página de inicio
  }, [location]); // Ejecuta el efecto cada vez que cambie la ubicación


 
  


  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const[isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [page, setPage] = useState(0);

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


/*
useEffect(() =>{
  //Llamamos a la funcion para obtener todos los muebles declarados en el Servicio
  const fetchMueble = async() => {
    const muebles = await MuebleService.getAllMuebles();
    setMuebles(muebles);
    setIsLoading(false);  
  };
  fetchMueble();
}, [refreshData]);*/

useEffect(() =>{
  //Llamamos a la funcion para obtener todos los muebles declarados en el Servicio
  const fetchMueble = async() => {
    const fetchedMuebles = await MuebleService.getMueblesByCategoria(categoriaSeleccionada);
    setMuebles(fetchedMuebles);
    setIsLoading(false);  
  };
  fetchMueble();
}, [categoriaSeleccionada]);


const handleLoadMore = () => {
  setPage(page + 1);
};

/*
// Llamada a la función de filtrado cada vez que se selecciona una categoría
useEffect(() => {
  if (categoriaSeleccionada === 'Todos') {
    setMueblesFiltrados(muebles); // Si se selecciona "Todos", mostrar todos los muebles
  } else {
    const mueblesFiltrados = muebles.filter(mueble => mueble.categoria?.nombreCategoria === categoriaSeleccionada);
    setMueblesFiltrados(mueblesFiltrados);
  }
}, [categoriaSeleccionada, muebles]);*/

// Llamada a la función de filtrado cada vez que se selecciona una categoría

// Llamada a la función de filtrado cada vez que se selecciona una categoría
useEffect(() => {
  if (categoriaSeleccionada === 'Todos') {
    const paginatedMuebles = muebles.slice(0, (page + 1) * 9);
    setMueblesFiltrados(paginatedMuebles); // Mostrar los primeros 9 muebles
  } else {
    const mueblesFiltrados = muebles.filter(mueble => mueble.categoria?.nombreCategoria === categoriaSeleccionada);
    setMueblesFiltrados(mueblesFiltrados);
  }
}, [categoriaSeleccionada, muebles, page]);




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

const [imageUrl, setImageUrl] = React.useState<string | null>(null);



  return (
    <>
    <div className='category-container bg-black animate__animated animate__slideInRight'>
      
        <Button onClick={handleMostrarTodos} className='category-text bg-black '>Todos</Button>
        {categorias.map((categoria) => (
        <Button  key={categoria.id} className='category-text bg-black ' onClick={() => handleClickCategoria(categoria.nombreCategoria)}>
        {categoria.nombreCategoria}</Button>
     
        ))}
      
      </div>
      <div className='content-wrapper'>
      {categoriaSeleccionada && (
        <Container className ='custom-container d-flex justify-content-center  '>
          <Row className="justify-content-start" >
              {isLoading ? (
                <Loader />
              ) : (
                
                mueblesFiltrados.map((mueble) => (
                  /*
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
                      </div>*/

                      <div className=' col-lg-4 col-md-6 mb-4' key={mueble.id}>
                <div className=' package-item bg-white mb-2 animate__animated animate__backInUp '>
                <img 
                className='card simg-fluid card-img-top'
                src={`data:image/png;base64, ${mueble.imagenes[0].imagenes}`}
                alt={mueble.nombreMueble}
                />


                  <div className='p-4'>
                    <div className='d-flex justify-content-between mb-3'>
                      <small className='m-0'><i className='fas fa-paint-brush text-primary mr-2'></i>{mueble.colorMueble}</small>
                      <small className='m-0'><i className='fas fa-couch text-primary mr-2'></i>{mueble.tipoMadera}</small>
                      <small className='m-0'><i className='fas fa-ruler text-primary mr-2'></i>{mueble.dimension}</small>
                    </div>
                    <a className='h5 text-decoration-none' href='#'> {mueble.nombreMueble}</a>
                    <div className='border-top mt-4 pt-4'>
                      <div className='d-flex justify-content-between'>
                        <h6 className='m-0'><i className='fa fa-star text-primary mr-2'></i>{mueble.precio}</h6>
                        <h5 className='m-0'><i className='fas fa-dollar-sign text-primary mr-2'></i>{mueble.precio}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                    
                  
                
)))}</Row>

</Container> )}
{muebles.length > (page + 1) * 9 && (
  <div className='text-center mt-4'>
    <Button onClick={handleLoadMore}>Ver más</Button>
  </div>
)}
</div>
</>
  );
};

          

    

export default CatalogoMueble;
