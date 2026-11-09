import '../styles/mdz-theme.css';
import '../styles/mdz-site.css';

const CONTACTO = 'mdzmuebles.web@gmail.com';

/**
 * Política de privacidad. La pide Google para la app OAuth que manda los mails
 * y corresponde porque el sitio guarda datos personales de quienes hacen consultas.
 */
const Privacidad = () => {
  return (
    <>
      <div className="mdz-page-header mdz-diagonal-detail">
        <div className="mdz-container">
          <p className="mdz-eyebrow">Legal</p>
          <h1>Política de privacidad.</h1>
          <p className="mdz-section-copy">Qué datos guardamos cuando nos escribís y para qué los usamos.</p>
        </div>
      </div>

      <div className="mdz-container mdz-section mdz-legal">
        <p className="mdz-legal-fecha">Última actualización: noviembre de 2026</p>

        <h2>Quiénes somos</h2>
        <p>
          MDZ Muebles es un taller de carpintería y diseño de muebles a medida de Mendoza, Argentina.
          Este sitio muestra nuestro catálogo y permite hacernos consultas.
        </p>

        <h2>Qué datos guardamos</h2>
        <p>Cuando completás un formulario de consulta guardamos:</p>
        <ul>
          <li>Nombre y apellido.</li>
          <li>Correo electrónico y teléfono (si lo indicás).</li>
          <li>El mensaje de la consulta y, si corresponde, el mueble por el que preguntás.</li>
          <li>La fecha de la consulta y nuestra respuesta.</li>
        </ul>
        <p>
          No pedimos datos de pago ni documentos, y no usamos cookies de publicidad ni de seguimiento.
          El navegador guarda, solo para quien inicia sesión en el panel de administración, los datos
          necesarios para mantener la sesión abierta.
        </p>

        <h2>Para qué los usamos</h2>
        <ul>
          <li>Para responder tu consulta por correo electrónico.</li>
          <li>Para avisarnos internamente que llegó una consulta nueva.</li>
        </ul>
        <p>
          No vendemos, alquilamos ni compartimos tus datos con terceros para fines comerciales,
          y no los usamos para enviarte publicidad.
        </p>

        <h2>Envío de correos</h2>
        <p>
          Los correos (respuestas a consultas y avisos internos) se envían desde la cuenta {CONTACTO} a través
          de la API de Gmail de Google. El sitio solo tiene permiso para <strong>enviar</strong> correos desde
          esa cuenta: no lee, no guarda ni modifica ningún otro correo. El uso de la información recibida de las
          APIs de Google se ajusta a la Política de datos de usuario de los servicios de API de Google, incluidos
          los requisitos de uso limitado.
        </p>

        <h2>Dónde se guardan</h2>
        <p>
          Los datos se almacenan en una base de datos alojada en proveedores de infraestructura en la nube
          (servidores ubicados en Estados Unidos), con conexión cifrada. Solo el administrador del sitio
          puede verlos, desde un panel protegido con usuario y contraseña.
        </p>

        <h2>Cuánto tiempo</h2>
        <p>
          Guardamos las consultas mientras sean útiles para atenderte o para hacer un seguimiento de un pedido.
          Podés pedirnos que las borremos en cualquier momento.
        </p>

        <h2>Tus derechos</h2>
        <p>
          Podés pedir acceder a tus datos, corregirlos o eliminarlos escribiéndonos a{' '}
          <a href={`mailto:${CONTACTO}`}>{CONTACTO}</a>. Te respondemos en un plazo máximo de 10 días hábiles.
        </p>
        <p>
          Según la Ley 25.326 de Protección de Datos Personales de Argentina, la Agencia de Acceso a la
          Información Pública, en su carácter de órgano de control, tiene la atribución de atender las denuncias
          y reclamos que se interpongan con relación al incumplimiento de las normas sobre protección de datos personales.
        </p>

        <h2>Contacto</h2>
        <p>
          Por cualquier duda sobre esta política: <a href={`mailto:${CONTACTO}`}>{CONTACTO}</a>.
        </p>
      </div>
    </>
  );
};

export default Privacidad;
