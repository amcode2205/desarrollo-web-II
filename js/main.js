/* Menú hamburguesa, página activa y año del pie. */

document.addEventListener("DOMContentLoaded", function () {
  var archivo = window.location.pathname.split("/").pop();
  if (!archivo) {
    archivo = "index.html";
  }

  var enlaces = document.querySelectorAll("#menu-principal a");
  for (var i = 0; i < enlaces.length; i++) {
    var href = enlaces[i].getAttribute("href");
    if (href === archivo || (archivo === "" && href === "index.html")) {
      enlaces[i].setAttribute("aria-current", "page");
    }
  }

  var anio = document.getElementById("anio");
  if (anio) {
    anio.textContent = new Date().getFullYear();
  }
});
