import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DestinatarioNotificacion, NotificacionService } from "../../services/NotificacionService";

/**
 * Sección de Mi Perfil (solo admin): casillas que reciben el aviso de cada consulta nueva.
 * El admin agrega, quita y prueba sus propios mails sin tocar la configuración del servidor.
 */
const NotificacionesPerfil: React.FC = () => {
  const [destinatarios, setDestinatarios] = useState<DestinatarioNotificacion[]>([]);
  const [usaRespaldo, setUsaRespaldo] = useState(false);
  const [nuevoMail, setNuevoMail] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [ocupadoId, setOcupadoId] = useState<number | null>(null);
  const [aQuitar, setAQuitar] = useState<DestinatarioNotificacion | null>(null);

  const cargar = async () => {
    try {
      setError(null);
      const data = await NotificacionService.listar();
      setDestinatarios(data.destinatarios);
      setUsaRespaldo(data.usaRespaldo);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar las casillas");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const agregar = async (e: React.FormEvent) => {
    e.preventDefault();
    const mail = nuevoMail.trim();
    if (!mail) return;
    setGuardando(true);
    try {
      await NotificacionService.agregar(mail);
      setNuevoMail("");
      toast.success(`Agregado: ${mail.toLowerCase()}`);
      await cargar();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo agregar el mail");
    } finally {
      setGuardando(false);
    }
  };

  const probar = async (d: DestinatarioNotificacion) => {
    setOcupadoId(d.id);
    try {
      const mensaje = await NotificacionService.enviarPrueba(d.id);
      toast.success(`${mensaje}. Revisá la bandeja de entrada (y el spam).`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo enviar el mail de prueba");
    } finally {
      setOcupadoId(null);
    }
  };

  const confirmarQuitar = async () => {
    if (!aQuitar) return;
    const d = aQuitar;
    setAQuitar(null);
    setOcupadoId(d.id);
    try {
      await NotificacionService.quitar(d.id);
      toast.success(`Quitado: ${d.mail}`);
      await cargar();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo quitar el mail");
    } finally {
      setOcupadoId(null);
    }
  };

  return (
    <div className="mdz-profile-body mdz-notif" data-testid="notificaciones">
      <h3 className="mdz-profile-section-title"><i className="fas fa-bell"></i> Avisos de consultas nuevas</h3>
      <p className="mdz-notif-help">
        Cada vez que un cliente manda una consulta desde la web, llega un aviso a estas casillas.
        Podés agregar varias y cambiarlas cuando quieras.
      </p>

      {cargando ? (
        <p className="mdz-notif-help">Cargando…</p>
      ) : error ? (
        <div className="mdz-notif-alert mdz-notif-alert-error">
          <i className="fas fa-exclamation-triangle"></i> {error}
          <button type="button" className="mdz-btn mdz-btn-filter" onClick={cargar}>Reintentar</button>
        </div>
      ) : (
        <>
          {usaRespaldo && (
            <div className="mdz-notif-alert">
              <i className="fas fa-info-circle"></i>
              Todavía no cargaste ninguna casilla: los avisos van a la casilla configurada por defecto en el servidor.
              Agregá la tuya para recibirlos.
            </div>
          )}

          {destinatarios.length > 0 && (
            <ul className="mdz-notif-list">
              {destinatarios.map((d) => (
                <li key={d.id} className="mdz-notif-item">
                  <span className="mdz-notif-mail"><i className="fas fa-envelope"></i> {d.mail}</span>
                  <span className="mdz-notif-actions">
                    <button type="button" className="mdz-btn mdz-btn-filter" disabled={ocupadoId === d.id}
                      onClick={() => probar(d)} title="Enviar un mail de prueba a esta casilla">
                      <i className="fas fa-paper-plane"></i> {ocupadoId === d.id ? "Enviando…" : "Probar"}
                    </button>
                    <button type="button" className="mdz-icon-btn mdz-notif-quitar" disabled={ocupadoId === d.id}
                      onClick={() => setAQuitar(d)} aria-label={`Quitar ${d.mail}`} title="Quitar">
                      <i className="fas fa-trash"></i>
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}

          <form className="mdz-notif-form" onSubmit={agregar}>
            <input
              type="email"
              className="mdz-notif-input"
              placeholder="nuevo@mail.com"
              value={nuevoMail}
              onChange={(e) => setNuevoMail(e.target.value)}
              aria-label="Nuevo mail para recibir avisos"
              required
            />
            <button type="submit" className="mdz-btn mdz-btn-brand" disabled={guardando || !nuevoMail.trim()}>
              <i className="fas fa-plus"></i> {guardando ? "Agregando…" : "Agregar"}
            </button>
          </form>
        </>
      )}

      {aQuitar && (
        <div className="mdz-confirm-overlay" onClick={() => setAQuitar(null)}>
          <div className="mdz-modal-content mdz-confirm-card" onClick={(e) => e.stopPropagation()}>
            <h3><i className="fas fa-trash"></i> Quitar casilla</h3>
            <p>¿Dejar de enviar avisos a <strong>{aQuitar.mail}</strong>?</p>
            {destinatarios.length === 1 && (
              <p className="mdz-notif-help">Es la única: los avisos van a volver a la casilla por defecto del servidor.</p>
            )}
            <div className="mdz-confirm-actions">
              <button className="mdz-btn mdz-btn-filter" onClick={() => setAQuitar(null)}>Cancelar</button>
              <button className="mdz-btn mdz-btn-brand" onClick={confirmarQuitar}>Quitar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificacionesPerfil;
