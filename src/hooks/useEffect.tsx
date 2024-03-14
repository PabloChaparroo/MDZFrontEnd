import { useEffect, useState } from "react";

function Counter(){
    const [count, setCount] = useState(0)
    useEffect(() =>{
        console.log('contador se ha actualizado')

    }, [count])

return (
    <>
    <p>Contador{count}</p>
    <button onClick={()=> setCount(count + 1 )}> Aumentar </button>
    </>
)
}