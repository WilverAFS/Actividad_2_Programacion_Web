// index.js - control del formulario y modal (versión corregida para evitar el warning de aria-hidden)

// --- Focus trap utilities (simple) ---
let _focusTrapHandler = null;
function activarFocusTrap(container) {
  const focusables = Array.from(container.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'))
    .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
  if (focusables.length === 0) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  _focusTrapHandler = function(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) { // shift + tab
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else { // tab
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  document.addEventListener('keydown', _focusTrapHandler);
}

function desactivarFocusTrap() {
  if (_focusTrapHandler) {
    document.removeEventListener('keydown', _focusTrapHandler);
    _focusTrapHandler = null;
  }
}

// --- Modal control with safe aria-hidden handling ---
let elementoQueAbrióModal = null;

function abrirModalConEdad(edad, openerElement = null) {
  const overlay = document.getElementById('modalOverlay');
  const mensaje = document.getElementById('modalMensaje');
  const main = document.getElementById('mainContent');
  if (!overlay || !mensaje) return;

  mensaje.textContent = `Tu edad es: ${edad} años.`;

  // Mostrar overlay primero (aria-hidden false)
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  // Marcar el contenido principal como inert si existe (mejora accesibilidad)
  if (main) {
    try {
      main.setAttribute('inert', '');
    } catch (err) {
      // algunos navegadores sin soporte pueden lanzar, ignorar
    }
  }

  // Guardar opener para devolver foco al cerrar
  elementoQueAbrióModal = openerElement || document.activeElement;

  // Poner foco en el botón aceptar dentro del modal
  const aceptar = document.getElementById('modalAceptar');
  if (aceptar) aceptar.focus();

  activarFocusTrap(overlay);
}

function cerrarModal() {
  const overlay = document.getElementById('modalOverlay');
  const main = document.getElementById('mainContent');
  if (!overlay) return;

  desactivarFocusTrap();

  // Si el foco actual está dentro del overlay, moverlo al opener (si existe)
  const active = document.activeElement;
  if (overlay.contains(active)) {
    if (elementoQueAbrióModal && typeof elementoQueAbrióModal.focus === 'function') {
      elementoQueAbrióModal.focus();
    } else {
      // fallback: mover foco al main para que no quede foco dentro del overlay
      const main = document.getElementById('mainContent');
      if (main && typeof main.focus === 'function') {
        main.focus();
      } else {
        // crear temporalmente un elemento focusable para recibir foco
        const temp = document.createElement('button');
        temp.style.position = 'absolute';
        temp.style.left = '-9999px';
        temp.style.top = 'auto';
        temp.setAttribute('aria-hidden', 'true');
        document.body.appendChild(temp);
        temp.focus();
        document.body.removeChild(temp);
      }
    }
  }

  // Quitar inert del main (si se aplicó)
  if (main) {
    try {
      main.removeAttribute('inert');
    } catch (err) {
      // ignorar si no soporta inert
    }
  }

  // Esperar un ciclo de evento para asegurarnos que el foco ya cambió antes de ocultar el overlay
  setTimeout(() => {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    elementoQueAbrióModal = null;
  }, 0);
}

// Muestra un mensaje de error y enfoca el campo
function mostrarErrorYFocus(campo, mensaje) {
  alert(mensaje);
  if (campo && typeof campo.focus === 'function') campo.focus();
}

document.addEventListener('DOMContentLoaded', function () {
  const formulario = document.getElementById('formularioDemo');
  const overlay = document.getElementById('modalOverlay');
  const btnCerrar = document.getElementById('modalCerrar');
  const btnAceptar = document.getElementById('modalAceptar');

  // Eventos del modal
  if (btnCerrar) btnCerrar.addEventListener('click', cerrarModal);
  if (btnAceptar) btnAceptar.addEventListener('click', cerrarModal);

  // Cerrar al hacer clic fuera de la caja del modal
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) cerrarModal();
    });
  }

  // Cerrar con Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      cerrarModal();
    }
  });

  // Manejo del submit
  if (formulario) {
    formulario.addEventListener('submit', function (e) {
      e.preventDefault();

      const nombre = document.getElementById('nombre');
      const correo = document.getElementById('correo');
      const telefono = document.getElementById('telefono');
      const telefonoConfirmar = document.getElementById('telefonoConfirmar');
      const fechaNacimiento = document.getElementById('fechaNacimiento');
      const password = document.getElementById('password');
      const passwordConfirmar = document.getElementById('passwordConfirmar');

      // Lectura de valores
      const nombreVal = nombre.value.trim();
      const correoVal = correo.value.trim();
      const telefonoVal = telefono.value.trim();
      const telefonoConfirmarVal = telefonoConfirmar.value.trim();
      const fechaVal = fechaNacimiento.value;
      const passwordVal = password.value;
      const passwordConfirmarVal = passwordConfirmar.value;

      console.group('Validación formularioDemo');
      console.log('Valores recibidos:', {
        nombre: nombreVal,
        correo: correoVal,
        telefono: telefonoVal,
        telefonoConfirmar: telefonoConfirmarVal,
        fechaNacimiento: fechaVal,
        password: passwordVal ? '***' : '(vacía)',
        passwordConfirmar: passwordConfirmarVal ? '***' : '(vacía)'
      });

      // 1. soloLetras
      if (!soloLetras(nombreVal)) {
        console.warn('Fallo: soloLetras(nombre)');
        mostrarErrorYFocus(nombre, 'El nombre solo debe contener letras y espacios.');
        console.groupEnd();
        return;
      } else {
        console.log('OK: soloLetras(nombre)');
      }

      // 2. validarCorreo
      if (!validarCorreo(correoVal)) {
        console.warn('Fallo: validarCorreo(correo)');
        mostrarErrorYFocus(correo, 'Correo inválido. Usa el formato ejemplo@correo.com');
        console.groupEnd();
        return;
      } else {
        console.log('OK: validarCorreo(correo)');
      }

      // 3. validarTelefono
      if (!validarTelefono(telefonoVal)) {
        console.warn('Fallo: validarTelefono(telefono)');
        mostrarErrorYFocus(telefono, 'Teléfono inválido. Debe tener exactamente 10 dígitos numéricos.');
        console.groupEnd();
        return;
      } else {
        console.log('OK: validarTelefono(telefono)');
      }

      // 4. validarCoincidencia (teléfono)
      if (!validarCoincidencia(telefonoVal, telefonoConfirmarVal)) {
        console.warn('Fallo: validarCoincidencia(telefono, telefonoConfirmar)');
        mostrarErrorYFocus(telefonoConfirmar, 'Los teléfonos no coinciden.');
        console.groupEnd();
        return;
      } else {
        console.log('OK: validarCoincidencia(telefono, telefonoConfirmar)');
      }

      // 5. fecha presente
      if (!fechaVal) {
        console.warn('Fallo: fechaNacimiento vacía');
        mostrarErrorYFocus(fechaNacimiento, 'Debes ingresar tu fecha de nacimiento.');
        console.groupEnd();
        return;
      } else {
        console.log('OK: fechaNacimiento presente');
      }

      // 6. calcularEdad
      const edad = calcularEdad(fechaVal);
      if (isNaN(edad)) {
        console.warn('Fallo: calcularEdad(fechaNacimiento) -> NaN');
        mostrarErrorYFocus(fechaNacimiento, 'Fecha de nacimiento inválida.');
        console.groupEnd();
        return;
      } else {
        console.log('OK: calcularEdad ->', edad);
      }

      // 7. esMayorDeEdad
      if (!esMayorDeEdad(fechaVal)) {
        console.warn('Fallo: esMayorDeEdad(fechaNacimiento)');
        mostrarErrorYFocus(fechaNacimiento, 'Debes ser mayor de edad (18 años o más).');
        console.groupEnd();
        return;
      } else {
        console.log('OK: esMayorDeEdad -> true');
      }

      // 8. validarPassword
      if (!validarPassword(passwordVal)) {
        console.warn('Fallo: validarPassword(password)');
        mostrarErrorYFocus(password, 'La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y carácter especial.');
        console.groupEnd();
        return;
      } else {
        console.log('OK: validarPassword(password)');
      }

      // 9. validarCoincidencia (password)
      if (!validarCoincidencia(passwordVal, passwordConfirmarVal)) {
        console.warn('Fallo: validarCoincidencia(password, passwordConfirmar)');
        mostrarErrorYFocus(passwordConfirmar, 'Las contraseñas no coinciden.');
        console.groupEnd();
        return;
      } else {
        console.log('OK: validarCoincidencia(password, passwordConfirmar)');
      }

      console.log('Todas las validaciones pasaron.');
      console.groupEnd();

      // Determinar opener (botón que disparó el submit)
      const opener = e.submitter || document.querySelector('#formularioDemo button[type="submit"]');
      abrirModalConEdad(edad, opener);
    });
  }
});
