
import { Spinner } from 'react-bootstrap'

const Loader = () => {
  return (
    <div className='loader '>
      <Spinner animation="border" role="status" className="loader-spinner">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
    </div>
  )
}

export default Loader
