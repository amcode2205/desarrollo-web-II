/* Casos de Computer Fix.
   Sitio estático: los datos se guardan en localStorage para la demo. */

var STORAGE_ORDENES = "computerFixCasos";
var CLAVE_TALLER = "fix26";
var SESION_TALLER = "computerFixSesion";

var ESTADOS = [
  "Recibida",
  "En análisis",
  "En ejecución",
  "Esperando cliente",
  "Lista para cierre",
  "Cerrada",
  "Cancelada"
];

function claseEstado(estado) {
  var mapa = {
    "Recibida": "recibida",
    "En análisis": "diagnostico",
    "En ejecución": "reparacion",
    "Esperando cliente": "repuesto",
    "Lista para cierre": "lista",
    "Cerrada": "entregada",
    "Cancelada": "cancelada"
  };
  return mapa[estado] || "";
}

function ordenesDeEjemplo() {
  return [
    {
      codigo: "CF-1042",
      nombre: "María Gómez",
      telefono: "3006321901",
      correo: "maria.gomez@bancoandino.com",
      equipo: "Infraestructura",
      marca: "Banco Andino",
      problema: "Quieren mover el core de reportes a la nube sin cortar el cierre de mes.",
      urgencia: "Normal",
      estado: "En ejecución",
      notas: "Arquitectura propuesta. Pendiente ventana del sábado.",
      fecha: "2026-09-16"
    },
    {
      codigo: "CF-1043",
      nombre: "Carlos Ríos",
      telefono: "3002198844",
      correo: "c.rios@clinicanorte.co",
      equipo: "Ciberseguridad",
      marca: "Clínica Norte",
      problema: "Revisión de accesos y copias. Hubo un intento de phishing la semana pasada.",
      urgencia: "Urgente",
      estado: "En análisis",
      notas: "Inventario de cuentas privilegiadas en curso.",
      fecha: "2026-09-17"
    },
    {
      codigo: "CF-1044",
      nombre: "Diana Pérez",
      telefono: "3157701208",
      correo: "diana.perez@rutalinea.co",
      equipo: "Sistemas financieros",
      marca: "Ruta Línea",
      problema: "Conciliación de pagos se está haciendo a mano y se está quedando corta.",
      urgencia: "Puede esperar",
      estado: "Lista para cierre",
      notas: "Informe entregado. Esperan firma de gerencia.",
      fecha: "2026-09-12"
    }
  ];
}

function obtenerOrdenes() {
  var texto = localStorage.getItem(STORAGE_ORDENES);
  if (!texto) {
    var iniciales = ordenesDeEjemplo();
    localStorage.setItem(STORAGE_ORDENES, JSON.stringify(iniciales));
    return iniciales;
  }
  try {
    return JSON.parse(texto);
  } catch (error) {
    return ordenesDeEjemplo();
  }
}

function guardarOrdenes(lista) {
  localStorage.setItem(STORAGE_ORDENES, JSON.stringify(lista));
}

function siguienteCodigo(lista) {
  var mayor = 1041;
  for (var i = 0; i < lista.length; i++) {
    var partes = lista[i].codigo.split("-");
    var numero = parseInt(partes[1], 10);
    if (numero > mayor) {
      mayor = numero;
    }
  }
  return "CF-" + (mayor + 1);
}

function crearOrden(datos) {
  var lista = obtenerOrdenes();
  var orden = {
    codigo: siguienteCodigo(lista),
    nombre: datos.nombre,
    telefono: datos.telefono,
    correo: datos.correo,
    equipo: datos.equipo,
    marca: datos.marca,
    problema: datos.problema,
    urgencia: datos.urgencia,
    estado: "Recibida",
    notas: "Ingresó por el formulario web.",
    fecha: datos.fecha || fechaHoy()
  };
  lista.push(orden);
  guardarOrdenes(lista);
  return orden;
}

function buscarOrden(codigo, telefono) {
  var limpioCodigo = codigo.trim().toUpperCase();
  var limpioTel = soloDigitos(telefono);
  var lista = obtenerOrdenes();

  for (var i = 0; i < lista.length; i++) {
    if (lista[i].codigo.toUpperCase() === limpioCodigo &&
        soloDigitos(lista[i].telefono) === limpioTel) {
      return lista[i];
    }
  }
  return null;
}

function actualizarOrden(codigo, estado, notas) {
  var lista = obtenerOrdenes();
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].codigo === codigo) {
      lista[i].estado = estado;
      if (notas) {
        lista[i].notas = notas;
      }
      guardarOrdenes(lista);
      return lista[i];
    }
  }
  return null;
}

function dosDigitos(numero) {
  return numero < 10 ? "0" + numero : String(numero);
}

function fechaHoy() {
  var hoy = new Date();
  var mes = dosDigitos(hoy.getMonth() + 1);
  var dia = dosDigitos(hoy.getDate());
  return hoy.getFullYear() + "-" + mes + "-" + dia;
}

function soloDigitos(valor) {
  return String(valor).replace(/\D/g, "");
}

function sesionTallerActiva() {
  return sessionStorage.getItem(SESION_TALLER) === "ok";
}

function iniciarSesionTaller(clave) {
  if (clave === CLAVE_TALLER) {
    sessionStorage.setItem(SESION_TALLER, "ok");
    return true;
  }
  return false;
}

function cerrarSesionTaller() {
  sessionStorage.removeItem(SESION_TALLER);
}
