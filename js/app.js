/* Computer Fix — Desarrollo Web II
   Menú, tema claro/oscuro y carrito de paquetes. */

var CLAVE_TEMA = "computerFixTema";
var CLAVE_CARRITO = "computerFixCarrito";
var carrito = [];
var totalCarrito = 0;

document.addEventListener("DOMContentLoaded", function () {
  iniciarMenu();
  iniciarTema();
  iniciarCarrito();
});

function iniciarMenu() {
  var boton = document.querySelector(".btn-menu");
  var nav = document.getElementById("menu-principal");
  if (!boton || !nav) {
    return;
  }

  boton.addEventListener("click", function () {
    nav.classList.toggle("abierto");
    boton.classList.toggle("abierto");
    var abierto = nav.classList.contains("abierto");
    boton.setAttribute("aria-expanded", abierto ? "true" : "false");
    boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  });
}

function iniciarTema() {
  var boton = document.querySelector(".btn-tema");
  if (!boton) {
    return;
  }

  if (localStorage.getItem(CLAVE_TEMA) === "oscuro") {
    document.body.classList.add("tema-oscuro");
  }
  actualizarBotonTema(boton);

  boton.addEventListener("click", function () {
    document.body.classList.toggle("tema-oscuro");
    var oscuro = document.body.classList.contains("tema-oscuro");
    localStorage.setItem(CLAVE_TEMA, oscuro ? "oscuro" : "claro");
    actualizarBotonTema(boton);
  });
}

function actualizarBotonTema(boton) {
  var oscuro = document.body.classList.contains("tema-oscuro");
  boton.setAttribute("aria-pressed", oscuro ? "true" : "false");
  boton.textContent = oscuro ? "Modo claro" : "Modo oscuro";
}

function iniciarCarrito() {
  var guardado = localStorage.getItem(CLAVE_CARRITO);
  if (guardado) {
    try {
      carrito = JSON.parse(guardado);
    } catch (error) {
      carrito = [];
    }
  }

  var botones = document.querySelectorAll(".btn-agregar");
  for (var i = 0; i < botones.length; i++) {
    botones[i].addEventListener("click", function (evento) {
      agregarAlCarrito(evento.currentTarget);
    });
  }

  var btnVaciar = document.getElementById("vaciar-carrito");
  if (btnVaciar) {
    btnVaciar.addEventListener("click", vaciarCarrito);
  }

  var btnPanel = document.querySelector(".btn-carrito");
  var panel = document.getElementById("carrito");
  if (btnPanel && panel) {
    btnPanel.addEventListener("click", function () {
      panel.classList.toggle("oculto");
      var visible = !panel.classList.contains("oculto");
      btnPanel.setAttribute("aria-expanded", visible ? "true" : "false");
    });
  }

  pintarCarrito();
}

function agregarAlCarrito(boton) {
  var id = boton.getAttribute("data-id");
  var nombre = boton.getAttribute("data-nombre");
  var precio = Number(boton.getAttribute("data-precio"));
  var existe = null;

  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].id === id) {
      existe = carrito[i];
      break;
    }
  }

  if (existe) {
    existe.cantidad = existe.cantidad + 1;
  } else {
    carrito.push({
      id: id,
      nombre: nombre,
      precio: precio,
      cantidad: 1
    });
  }

  guardarCarrito();
  pintarCarrito();

  var panel = document.getElementById("carrito");
  var btnPanel = document.querySelector(".btn-carrito");
  if (panel && btnPanel) {
    panel.classList.remove("oculto");
    btnPanel.setAttribute("aria-expanded", "true");
  }
}

function quitarDelCarrito(id) {
  var nuevo = [];
  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].id !== id) {
      nuevo.push(carrito[i]);
    }
  }
  carrito = nuevo;
  guardarCarrito();
  pintarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  pintarCarrito();
}

function guardarCarrito() {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function calcularTotal() {
  totalCarrito = 0;
  for (var i = 0; i < carrito.length; i++) {
    totalCarrito = totalCarrito + carrito[i].precio * carrito[i].cantidad;
  }
  return totalCarrito;
}

function formatoPeso(valor) {
  return "$" + valor.toLocaleString("es-CO");
}

function pintarCarrito() {
  var lista = document.getElementById("lista-carrito");
  var totalNodo = document.getElementById("total-carrito");
  var cuenta = document.querySelector(".carrito-cuenta");
  if (!lista || !totalNodo) {
    return;
  }

  lista.innerHTML = "";
  var unidades = 0;

  if (carrito.length === 0) {
    var vacio = document.createElement("li");
    vacio.textContent = "No hay paquetes en el carrito.";
    lista.appendChild(vacio);
  } else {
    for (var i = 0; i < carrito.length; i++) {
      var item = carrito[i];
      unidades = unidades + item.cantidad;

      var li = document.createElement("li");
      var texto = document.createElement("span");
      texto.textContent = item.nombre + " x" + item.cantidad + " · " + formatoPeso(item.precio * item.cantidad);
      li.appendChild(texto);

      var btnEliminar = document.createElement("button");
      btnEliminar.type = "button";
      btnEliminar.className = "btn-eliminar";
      btnEliminar.textContent = "Eliminar";
      btnEliminar.setAttribute("data-id", item.id);
      btnEliminar.addEventListener("click", function (evento) {
        quitarDelCarrito(evento.currentTarget.getAttribute("data-id"));
      });
      li.appendChild(btnEliminar);
      lista.appendChild(li);
    }
  }

  totalNodo.textContent = formatoPeso(calcularTotal());
  if (cuenta) {
    cuenta.textContent = unidades;
  }
}
