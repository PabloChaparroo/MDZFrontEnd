import { TrashFill } from "react-bootstrap-icons";


interface DeleteButtonProps{
    onClick:() => void;
}
export const DeleteButton = ({onClick}:DeleteButtonProps) => {
    return(
        <TrashFill
            color="#FF0000"
            size= {24}
            onClick= {onClick}
            onMouseEnter= {() => {document.body.style.cursor = 'pointer'}}
            onMouseLeave= {() => {document.body.style.cursor= 'default'}}
            />
    )
}
export default DeleteButton