# Actividad 2. Librería utilería.js

## Programación Web
**Actividad:** Libreria utileria.js
**Estudainte:** Flores Santiago Wilver Alfredo
**Qué problema resuelve:** Provee un conjunto pequeño y reutilizable de funciones JavaScript para validar entradas comunes en formularios (correo, texto, teléfono, contraseñas, fechas) y utilidades adicionales (coincidencia de campos, validación de teléfono). Facilita validar datos en cualquier formulario sin depender de frameworks.

---

## Instalación
Incluye la librería en tu HTML con la etiqueta `<script>` (coloca el archivo `utileria.js` en `js/`):

```html
<script src="js/utileria.js"></script>
```

Luego carga el script de la página (por ejemplo `index.js` o `login.js`) **después** de `utileria.js`:

```html
<script src="js/utileria.js"></script>
<script src="js/index.js"></script>
```

---

## Uso

A continuación se muestran ejemplos de uso de cada función incluida en **utileria.js**. Pega los fragmentos en la consola o en tus scripts para probarlos.

### validarCorreo(correo) → boolean
Valida formato básico de correo electrónico.

```javascript
console.log(validarCorreo("usuario@dominio.com")); // true
console.log(validarCorreo("usuario@dominio"));     // false
```

### soloLetras(texto) → boolean
Acepta letras (mayúsculas/minúsculas), vocales acentuadas y espacios.

```javascript
console.log(soloLetras("María López")); // true
console.log(soloLetras("Juan123"));     // false
```

### validarLongitud(numero, maxLongitud) → boolean
Valida que la representación en texto del número tenga longitud menor o igual a `maxLongitud`.

```javascript
console.log(validarLongitud(412, 4)); // true
console.log(validarLongitud(412, 2)); // false
```

### calcularEdad(fechaNacimiento) → number
Calcula la edad en años a partir de una fecha (acepta `YYYY-MM-DD` o `Date`).

```javascript
console.log(calcularEdad("2000-07-04")); // ejemplo: 26 (según fecha actual)
```

### esMayorDeEdad(fechaNacimiento) → boolean
Devuelve `true` si la edad calculada es >= 18.

```javascript
console.log(esMayorDeEdad("2008-01-01")); // false
```

### validarPassword(password) → boolean
Requiere: al menos una mayúscula, una minúscula, un número, un carácter especial y mínimo 8 caracteres.

```javascript
console.log(validarPassword("Abc123$%")); // true
console.log(validarPassword("abc12345")); // false
```

### validarTelefono(tel) → boolean
Valida que el teléfono tenga exactamente 10 dígitos numéricos.

```javascript
console.log(validarTelefono("9511234567")); // true
console.log(validarTelefono("951-123-4567")); // false
```

### validarCoincidencia(val1, val2) → boolean
Valida que dos entradas sean exactamente iguales (útil para confirmar teléfono o contraseña).

```javascript
console.log(validarCoincidencia("abc", "abc")); // true
console.log(validarCoincidencia("123", "321")); // false
```

---

## Integración con ejemplos (index.html y login.html)

### Ejemplo: uso en `index.html` (fragmento)
```html
<form id="formularioDemo">
  <input id="correo" type="email" />
  <input id="fechaNacimiento" type="date" />
  <button type="submit">Enviar</button>
</form>

<script src="js/utileria.js"></script>
<script>
document.getElementById('formularioDemo').addEventListener('submit', function(e){
  e.preventDefault();
  const correo = document.getElementById('correo').value;
  const fecha = document.getElementById('fechaNacimiento').value;

  if (!validarCorreo(correo)) {
    alert('Correo inválido');
    return;
  }
  const edad = calcularEdad(fecha);
  alert('Tu edad es: ' + edad);
});
</script>
```

### Ejemplo: uso en `login.html` (fragmento)
```html
<form id="loginForm">
  <input id="loginCorreo" type="email" />
  <input id="loginPassword" type="password" />
  <button type="submit">Entrar</button>
</form>

<script src="js/utileria.js"></script>
<script>
document.getElementById('loginForm').addEventListener('submit', function(e){
  e.preventDefault();
  const correo = document.getElementById('loginCorreo').value;
  const pass = document.getElementById('loginPassword').value;

  if (!validarCorreo(correo)) {
    alert('Correo inválido');
    return;
  }
  if (!validarPassword(pass)) {
    alert('Contraseña insegura');
    return;
  }
  alert('Login simulado: credenciales válidas');
});
</script>
```

---

## Estructura del repositorio
```
/utileria
├─ README.md
├─ index.html
├─ login.html
├─ css/
│  └─ styles.css
├─ js/
│  ├─ utileria.js
│  ├─ index.js
│  └─ login.js
└─ img/
   ├─ datos_index.png
   ├─ datos_login.png
   ├─ preview_index.png
   ├─ preview_login.png
   ├─ test_index.png
   └─ test_login.png
   
```

---

## Capturas de pantalla
**Capturas:** se incluyen en la carpeta `/img` imágenes que muestren:
- Consola con `console.log` de las funciones.
- Formulario en `index.html` con modal abierto mostrando la edad.
- `login.html` mostrando mensajes de éxito.

### Vista previa
**Index preview**  
![Vista previa Index](utileria/img/preview_index.png)

**Login preview**  
![Vista previa Login](utileria/img/preview_login.png)

### Datos de entrada (valores usados en los formularios)
**Index datos**  
![Datos Index](utileria/img/datos_index.png)

**Login datos**  
![Datos Login](utileria/img/datos_login.png)

### Pruebas en consola (validaciones de utileria.js)
**Index test (consola)**  
![Test Index](utileria/img/test_index.png)

**Login test (consola)**  
![Test Login](utileria/img/test_login.png)

---
## Video promocional
Accede a la presentacion en:
- `https://1drv.ms/v/c/e80e64ce78a0815e/IQAMVjM9cOG9SoAIQpuWj-GUAa3uh_vl_J7orbcLNuPztDs?e=IDjnpy`
- `https://1drv.ms/v/c/e80e64ce78a0815e/IQAFk3No9SLuRrhO0yvXNAXRAegPP-YqnbUkwYdmkU4DCaM?e=xTEFES`
---

## GitHub Pages y entrega
  - **Link al repositorio público** (`https://github.com/WilverAFS/Actividad_2_Programacion_Web`)
  - **Link a GitHub Pages** (`https://wilverafs.github.io/Actividad_2_Programacion_Web/`)
---
