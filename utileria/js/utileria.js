//Funciones para validar inputs en formularios

//Validar que el texto ingresado tenga el formato de un correo electronico
function validarCorreo(correo){
    let regrexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //comprobar que no este vacio
    if(correo === "" || typeof correo !== "string"){
        return false;
    }
    return regrexCorreo.test(correo);
}

//validar que la cadena de texto ingresada solo tenga letras mayusculas/minusculas, se aceptar vocales acentuadas.
function soloLetras(texto){
    let regrexSoloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if(texto === "" || typeof texto !== "string") return false;
    return regrexSoloLetras.test(texto);
}

/*
Funcion que valida si un numero tiene una longitud valida
Por ejemplo: 
validarLongitud (412, 4) => true
validarLongitud (412, 3) => true
validarLongitud (412, 2) => false
validarLongitud (412, 1) => false
*/
function validarLongitud(numero, maxLongitud){
    if (numero === null || numero === undefined) return false;
    const str = numero.toString();
    if (typeof maxLongitud !== "number" || maxLongitud < 0) return false;
    return str.length <= maxLongitud;
}

//calcular la edad apartir la fecha de nacimiento, retorna un entero
function calcularEdad(fechaNacimiento){
    if(!fechaNacimiento) return NaN;
    let nacimiento;
    if (fechaNacimiento instanceof Date) {
        nacimiento = new Date(fechaNacimiento.getFullYear(), fechaNacimiento.getMonth(), fechaNacimiento.getDate());
    } else {
        nacimiento = new Date(fechaNacimiento);
    }
    if (isNaN(nacimiento.getTime())) return NaN;
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesDiff = hoy.getMonth() - nacimiento.getMonth();
    if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

//validar si es mayor de edad
function esMayorDeEdad(fechaNacimiento){
    return calcularEdad(fechaNacimiento) >= 18;
}

/**
 * Validar formato de contraseña, requisitos:
 * - una mayuscula
 * - una minusculas
 * - un numero
 * - un caracter especial
 * - tiene una longitud minima de 8 caracter
 */
function validarPassword(password){
    if (typeof password !== "string") return false;
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regexPassword.test(password);
}

//VALIDACIONES PROPIAS
//Validar que se ingreso un numero de telefono valido
function validarTelefono(tel){
    //validar longitud exacta de 10 digitos y que sean solo numeros
    if (tel === null || tel === undefined) return false;
    const str = tel.toString().replace(/\s+/g, "");
    const regexTel = /^\d{10}$/;
    return regexTel.test(str);
}

//Validar que dos entradas de texto sean iguales, util para comprobar datos criticos como numeros telefonicos o contraseñas
function validarCoincidencia(val1, val2){
    if(val1 === "" || val2 === "") return false;
    return val1 === val2;
}
