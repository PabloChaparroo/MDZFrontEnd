import { XCircleFill } from "react-bootstrap-icons";

interface InabilitarButtonProps {
    onClick: () => void;
}

export const InhabilidatButton = ({ onClick }: InabilitarButtonProps) => {
    return (
        <XCircleFill
            color="#FF0000"
            size={24}
            onClick={onClick}
            onMouseEnter={() => { document.body.style.cursor = 'pointer' }}
            onMouseLeave={() => { document.body.style.cursor = 'default' }}
        />
    );
}

export default InhabilidatButton;
