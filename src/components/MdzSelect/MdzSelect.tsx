import React, { useEffect, useRef, useState } from 'react';
import '../../styles/mdz-theme.css';
import '../../styles/mdz-site.css';

export type MdzSelectOption = { value: string; label: string };

type MdzSelectProps = {
  value: string;
  options: MdzSelectOption[];
  onChange: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
};

// Desplegable propio (vidrio + animación): el <select> nativo no permite estilizar la lista de opciones.
const MdzSelect = ({ value, options, onChange, className = '', style, ariaLabel }: MdzSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const actual = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const cerrarAfuera = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const cerrarConEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', cerrarAfuera);
    document.addEventListener('touchstart', cerrarAfuera);
    document.addEventListener('keydown', cerrarConEsc);
    return () => {
      document.removeEventListener('mousedown', cerrarAfuera);
      document.removeEventListener('touchstart', cerrarAfuera);
      document.removeEventListener('keydown', cerrarConEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className={`mdz-dropdown ${open ? 'is-open' : ''} ${className}`} style={style}>
      <button
        type="button"
        className="mdz-dropdown-toggle"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{actual?.label}</span>
        <i className="fas fa-chevron-down"></i>
      </button>
      <ul className="mdz-dropdown-menu" role="listbox">
        {options.map((o, i) => (
          <li
            key={o.value}
            role="option"
            aria-selected={o.value === value}
            className={o.value === value ? 'is-selected' : ''}
            style={{ '--i': i } as React.CSSProperties}
            onClick={() => {
              onChange(o.value);
              setOpen(false);
            }}
          >
            {o.label}
            {o.value === value && <i className="fas fa-check"></i>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MdzSelect;
