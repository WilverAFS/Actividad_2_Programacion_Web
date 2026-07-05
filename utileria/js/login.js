// login.js - validación del formulario de login usando utileria.js
// Control accesible del modal (evita el warning de aria-hidden)

/* -------------------------
   Focus-trap utilities
   ------------------------- */
let _loginFocusTrapHandler = null;
function activarFocusTrapLogin(container) {
  const focusables = Array.from(
    container.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])')
  ).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

  if (focusables.length === 0) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  _loginFocusTrapHandler = function(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  document.addEventListener('keydown', _loginFocusTrapHandler);
}

function desactivarFocusTrapLogin() {
  if (_loginFocusTrapHandler) {
    document.removeEventListener('keydown', _loginFocusTrapHandler);
    _loginFocusTrapHandler = null;
  }
}

/* -------------------------
   Modal login control (accesible)
   ------------------------- */
let openerLoginElement = null;

function abrirModalLogin(titulo, mensaje, openerElement = null) {
  const overlay = document.getElementById('loginModalOverlay');
  const tituloEl = document.getElementById('loginModalTitulo');
  const mensajeEl = document.getElementById('loginModalMensaje');
  const main = document.getElementById('mainContent');

  if (!overlay || !tituloEl || !mensajeEl) return;

  tituloEl.textContent = titulo;
  mensajeEl.textContent = mensaje;

  // Mostrar overlay y marcar accesible
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  // Intentar aplicar inert al main (si está disponible)
  if (main) {
    try { main.setAttribute('inert', ''); } catch (err) { /* ignore */ }
  }

  // Guardar opener para devolver foco al cerrar
  openerLoginElement = openerElement || document.activeElement;

  // Poner foco en el botón aceptar dentro del modal
  const aceptar = document.getElementById('loginModalAceptar');
  if (aceptar) aceptar.focus();

  activarFocusTrapLogin(overlay);
}

function cerrarModalLogin() {
  const overlay = document.getElementById('loginModalOverlay');
  const main = document.getElementById('mainContent');
  if (!overlay) return;

  desactivarFocusTrapLogin();

  // Si el foco actual está dentro del overlay, moverlo al opener (si existe)
  const active = document.activeElement;
  if (overlay.contains(active)) {
    // Primero intentar devolver foco al opener de forma síncrona
    if (openerLoginElement && typeof openerLoginElement.focus === 'function') {
      try {
        openerLoginElement.focus();
      } catch (err) {
        // ignore
      }
    } else {
      // fallback: blur del elemento activo para que no quede foco dentro del overlay
      try { active.blur(); } catch (err) { /* ignore */ }
    }
  }

  // Quitar inert del main si se aplicó
  if (main) {
    try { main.removeAttribute('inert'); } catch (err) { /* ignore */ }
  }

  // Asegurarnos de que el foco ya no esté dentro del overlay antes de ocultarlo.
  // Hacemos una pequeña espera (unos ms) y luego ocultamos el overlay.
  // Esto evita que aria-hidden se aplique mientras un descendiente aún retiene foco.
  setTimeout(() => {
    // Si por alguna razón aún hay un elemento enfocado dentro del overlay, lo desenfocamos.
    const nowActive = document.activeElement;
    if (overlay.contains(nowActive)) {
      try { nowActive.blur(); } catch (err) { /* ignore */ }
    }

    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    openerLoginElement = null;
  }, 30); // 30ms es suficiente en la práctica; puedes ajustar a 0 si lo prefieres
}

/* -------------------------
   Modal initialization
   ------------------------- */
function inicializarModalLogin() {
  const overlay = document.getElementById('loginModalOverlay');
  const btnCerrar = document.getElementById('loginModalCerrar');
  const btnAceptar = document.getElementById('loginModalAceptar');

  if (btnCerrar) btnCerrar.addEventListener('click', cerrarModalLogin);
  if (btnAceptar) btnAceptar.addEventListener('click', cerrarModalLogin);

  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) cerrarModalLogin();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
      cerrarModalLogin();
    }
  });
}

/* -------------------------
   Helpers: mostrar/limpiar errores
   ------------------------- */
function mostrarError(campoEl, mensaje) {
  if (!campoEl) return;
  const id = campoEl.id === 'loginCorreo' ? 'errorCorreo' : 'errorPassword';
  const errorEl = document.getElementById(id);
  if (errorEl) {
    errorEl.textContent = mensaje;
    errorEl.style.display = 'block';
  }
  campoEl.focus();
}

function limpiarErrores() {
  const e1 = document.getElementById('errorCorreo');
  const e2 = document.getElementById('errorPassword');
  if (e1) { e1.textContent = ''; e1.style.display = 'none'; }
  if (e2) { e2.textContent = ''; e2.style.display = 'none'; }
}

/* -------------------------
   Main: eventos del formulario
   ------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  inicializarModalLogin();

  const form = document.getElementById('loginForm');
  const correo = document.getElementById('loginCorreo');
  const password = document.getElementById('loginPassword');

  // Reset limpiar errores
  form.addEventListener('reset', function () {
    limpiarErrores();
  });

  // Submit: validar con utileria.js
form.addEventListener('submit', function (e) {
  e.preventDefault();
  limpiarErrores();

  const correoVal = correo.value.trim();
  const passwordVal = password.value;

  console.group('Validación loginForm');
  console.log('Valores recibidos:', {
    correo: correoVal,
    password: passwordVal ? '***' : '(vacía)'
  });

  // Validar correo
  if (!validarCorreo(correoVal)) {
    console.warn('Fallo: validarCorreo(loginCorreo)', { correo: correoVal });
    mostrarError(correo, 'Correo inválido. Usa el formato ejemplo@correo.com');
    console.groupEnd();
    return;
  } else {
    console.log('OK: validarCorreo(loginCorreo)', { correo: correoVal });
  }

  // Validar contraseña
  if (!validarPassword(passwordVal)) {
    console.warn('Fallo: validarPassword(loginPassword)');
    mostrarError(password, 'Contraseña inválida. Debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y carácter especial.');
    console.groupEnd();
    return;
  } else {
    console.log('OK: validarPassword(loginPassword)');
  }

  // Determinar opener (botón que disparó el submit)
  const opener = e.submitter || document.querySelector('#loginForm button[type="submit"]');

  console.log('Todas las validaciones del login pasaron.');
  console.groupEnd();

  // Si pasa validación, mostrar modal de éxito y pasar opener para control de foco
  abrirModalLogin('Inicio de sesión', 'Credenciales válidas. Inicio de sesión simulado con éxito.', opener);

  // Aquí podrías realizar la llamada real al servidor (fetch / XHR).
  });
});
