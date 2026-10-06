/* Validación de formularios en el cliente.
   HTML5 ya avisa algunas cosas; esto completa el resto y muestra
   el error al lado del campo, no en un alert. */

function esCorreoValido(correo) {
  var texto = correo.trim();
  var arroba = texto.indexOf("@");
  var punto = texto.lastIndexOf(".");
  return arroba > 0 && punto > arroba + 1 && punto < texto.length - 1;
}

function esCelularColombia(telefono) {
  var digitos = soloDigitos(telefono);
  return digitos.length === 10 && digitos.charAt(0) === "3";
}

function esNombreValido(nombre) {
  var limpio = nombre.trim();
  if (limpio.length < 3) {
    return false;
  }
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$/.test(limpio);
}

function mostrarError(input, mensaje) {
  input.setAttribute("aria-invalid", "true");
  var caja = input.closest(".campo").querySelector(".error");
  if (caja) {
    caja.textContent = mensaje;
  }
}

function limpiarError(input) {
  input.removeAttribute("aria-invalid");
  var caja = input.closest(".campo").querySelector(".error");
  if (caja) {
    caja.textContent = "";
  }
}

function validarCampo(input) {
  var valor = input.value.trim();
  var tipo = input.getAttribute("data-regla");

  if (input.hasAttribute("required") && valor === "") {
    mostrarError(input, "Este campo es obligatorio.");
    return false;
  }

  if (valor === "" && !input.hasAttribute("required")) {
    limpiarError(input);
    return true;
  }

  if (tipo === "nombre" && !esNombreValido(valor)) {
    mostrarError(input, "Escriba un nombre (solo letras, mínimo 3).");
    return false;
  }

  if (input.type === "email" && !esCorreoValido(valor)) {
    mostrarError(input, "El correo no tiene un formato válido.");
    return false;
  }

  if (tipo === "celular" && !esCelularColombia(valor)) {
    mostrarError(input, "Ingrese un celular de 10 dígitos que empiece por 3.");
    return false;
  }

  if (tipo === "largo" && valor.length < 15) {
    mostrarError(input, "Cuente un poco más la necesidad (mínimo 15 caracteres).");
    return false;
  }

  if (input.type === "date" && valor !== "") {
    if (valor < fechaHoy()) {
      mostrarError(input, "La fecha no puede ser anterior a hoy.");
      return false;
    }
  }

  if (input.type === "checkbox" && input.required && !input.checked) {
    mostrarError(input, "Hay que aceptar el tratamiento de datos para continuar.");
    return false;
  }

  limpiarError(input);
  return true;
}

function validarFormulario(formulario) {
  var controles = formulario.querySelectorAll("input, select, textarea");
  var ok = true;
  for (var i = 0; i < controles.length; i++) {
    if (!validarCampo(controles[i])) {
      ok = false;
    }
  }
  return ok;
}

document.addEventListener("DOMContentLoaded", function () {
  var formSolicitud = document.getElementById("form-solicitud");
  var formContacto = document.getElementById("form-contacto");
  var formConsulta = document.getElementById("form-consulta");
  var formTaller = document.getElementById("form-taller");

  var formularios = [formSolicitud, formContacto, formConsulta, formTaller];
  for (var f = 0; f < formularios.length; f++) {
    if (!formularios[f]) {
      continue;
    }
    var campos = formularios[f].querySelectorAll("input, select, textarea");
    for (var c = 0; c < campos.length; c++) {
      campos[c].addEventListener("blur", function (evento) {
        validarCampo(evento.target);
      });
    }
  }

  if (formSolicitud) {
    formSolicitud.addEventListener("submit", function (evento) {
      evento.preventDefault();
      if (!validarFormulario(formSolicitud)) {
        var primero = formSolicitud.querySelector("[aria-invalid='true']");
        if (primero) {
          primero.focus();
        }
        return;
      }

      var orden = crearOrden({
        nombre: document.getElementById("nombre").value.trim() + " " + document.getElementById("apellido").value.trim(),
        telefono: soloDigitos(document.getElementById("telefono").value),
        correo: document.getElementById("correo").value.trim(),
        equipo: document.getElementById("equipo").value,
        marca: document.getElementById("marca").value.trim(),
        problema: document.getElementById("problema").value.trim(),
        urgencia: document.getElementById("urgencia").value,
        fecha: document.getElementById("fecha").value
      });

      formSolicitud.classList.add("oculto");
      var caja = document.getElementById("resultado-solicitud");
      caja.classList.remove("oculto");
      document.getElementById("codigo-generado").textContent = orden.codigo;
    });
  }

  if (formContacto) {
    formContacto.addEventListener("submit", function (evento) {
      evento.preventDefault();
      if (!validarFormulario(formContacto)) {
        return;
      }
      formContacto.classList.add("oculto");
      document.getElementById("resultado-contacto").classList.remove("oculto");
    });
  }

  if (formConsulta) {
    formConsulta.addEventListener("submit", function (evento) {
      evento.preventDefault();
      if (!validarFormulario(formConsulta)) {
        return;
      }
      var orden = buscarOrden(
        document.getElementById("codigo").value,
        document.getElementById("tel-consulta").value
      );
      mostrarConsulta(orden);
    });
  }

  if (formTaller) {
    formTaller.addEventListener("submit", function (evento) {
      evento.preventDefault();
      var clave = document.getElementById("clave-taller").value.trim();
      var errorClave = document.getElementById("error-clave");
      if (iniciarSesionTaller(clave)) {
        errorClave.textContent = "";
        mostrarTablero();
      } else {
        errorClave.textContent = "Clave incorrecta.";
      }
    });
  }

  var btnCerrar = document.getElementById("cerrar-taller");
  if (btnCerrar) {
    btnCerrar.addEventListener("click", function () {
      cerrarSesionTaller();
      document.getElementById("panel-taller").classList.add("oculto");
      document.getElementById("acceso-taller").classList.remove("oculto");
    });
  }

  if (document.getElementById("tablero") && sesionTallerActiva()) {
    mostrarTablero();
  }
});

function mostrarConsulta(orden) {
  var caja = document.getElementById("resultado-consulta");
  if (!orden) {
    caja.innerHTML = "<p class='aviso-caja'>No encontramos ese caso. Revise el código (CF-xxxx) y el celular con el que lo pidió.</p>";
    caja.classList.remove("oculto");
    return;
  }

  var html = "";
  html += "<article class='tarjeta'>";
  html += "<p><span class='estado " + claseEstado(orden.estado) + "'>" + orden.estado + "</span></p>";
  html += "<h3>Caso " + orden.codigo + "</h3>";
  html += "<p><strong>Contacto:</strong> " + orden.nombre + "</p>";
  html += "<p><strong>Área:</strong> " + orden.equipo + " · " + (orden.marca || "sin empresa") + "</p>";
  html += "<p><strong>Ingreso:</strong> " + orden.fecha + "</p>";
  html += "<p><strong>Nota del equipo:</strong> " + orden.notas + "</p>";
  html += "<h4>Cómo va el proceso</h4>";
  html += armarLineaTiempo(orden.estado);
  html += "</article>";

  caja.innerHTML = html;
  caja.classList.remove("oculto");
}

function armarLineaTiempo(estadoActual) {
  var pasos = ["Recibida", "En análisis", "En ejecución", "Lista para cierre", "Cerrada"];
  if (estadoActual === "Cancelada") {
    return "<p>Este caso fue cancelado.</p>";
  }
  if (estadoActual === "Esperando cliente") {
    pasos = ["Recibida", "En análisis", "En ejecución", "Esperando cliente", "Lista para cierre", "Cerrada"];
  }

  var indice = pasos.indexOf(estadoActual);
  var html = "<ol class='linea-tiempo'>";
  for (var i = 0; i < pasos.length; i++) {
    var clase = "";
    if (i < indice) {
      clase = "hecho";
    } else if (i === indice) {
      clase = "actual";
    }
    html += "<li class='" + clase + "'>" + pasos[i] + "</li>";
  }
  html += "</ol>";
  return html;
}

function mostrarTablero() {
  document.getElementById("acceso-taller").classList.add("oculto");
  document.getElementById("panel-taller").classList.remove("oculto");
  pintarTablero("todas");
}

function pintarTablero(filtro) {
  var lista = obtenerOrdenes();
  var caja = document.getElementById("tablero");
  var html = "";

  for (var i = lista.length - 1; i >= 0; i--) {
    var orden = lista[i];
    if (filtro && filtro !== "todas" && orden.estado !== filtro) {
      continue;
    }

    html += "<article class='tarjeta' data-codigo='" + orden.codigo + "'>";
    html += "<p><span class='codigo-orden'>" + orden.codigo + "</span> ";
    html += "<span class='estado " + claseEstado(orden.estado) + "'>" + orden.estado + "</span></p>";
    html += "<p><strong>" + orden.nombre + "</strong> · " + orden.equipo + "</p>";
    html += "<p>" + orden.problema + "</p>";
    html += "<div class='campo'><label for='estado-" + orden.codigo + "'>Cambiar estado</label>";
    html += "<select id='estado-" + orden.codigo + "'>";
    for (var e = 0; e < ESTADOS.length; e++) {
      var sel = ESTADOS[e] === orden.estado ? " selected" : "";
      html += "<option" + sel + ">" + ESTADOS[e] + "</option>";
    }
    html += "</select></div>";
    html += "<div class='campo'><label for='nota-" + orden.codigo + "'>Nota interna</label>";
    html += "<textarea id='nota-" + orden.codigo + "'>" + orden.notas + "</textarea></div>";
    html += "<button type='button' class='boton oscuro btn-guardar'>Guardar cambios</button>";
    html += "</article>";
  }

  if (html === "") {
    html = "<p>No hay casos en ese estado.</p>";
  }
  caja.innerHTML = html;
}

document.addEventListener("click", function (evento) {
  if (evento.target.classList.contains("btn-guardar")) {
    var tarjeta = evento.target.closest(".tarjeta");
    var codigo = tarjeta.getAttribute("data-codigo");
    var estado = tarjeta.querySelector("select").value;
    var notas = tarjeta.querySelector("textarea").value.trim();
    actualizarOrden(codigo, estado, notas);
    var filtroActivo = document.querySelector(".filtros button.activo");
    pintarTablero(filtroActivo ? filtroActivo.getAttribute("data-filtro") : "todas");
  }

  if (evento.target.closest(".filtros button")) {
    var boton = evento.target.closest(".filtros button");
    var hermanos = boton.parentNode.querySelectorAll("button");
    for (var i = 0; i < hermanos.length; i++) {
      hermanos[i].classList.remove("activo");
    }
    boton.classList.add("activo");
    pintarTablero(boton.getAttribute("data-filtro"));
  }
});
