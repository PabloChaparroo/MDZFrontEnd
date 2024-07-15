import { CheckCircleFill } from "react-bootstrap-icons";

interface HabilitarButtonProps {
    onClick: () => void;
}

export const HabilitarButton = ({ onClick }: HabilitarButtonProps) => {
    return (
        <CheckCircleFill
            color="#00FF00" // Color verde
            size={24}
            onClick={onClick}
            onMouseEnter={() => { document.body.style.cursor = 'pointer' }}
            onMouseLeave={() => { document.body.style.cursor = 'default' }}
        />
    );
}

export default HabilitarButton;
