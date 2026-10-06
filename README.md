# Computer Fix

Sitio de presencia digital para una startup de consultoría TI. Proyecto del primer ciclo de Desarrollo Web: HTML semántico, CSS responsive, navegación y validaciones con JavaScript.

No usa React ni servidor propio. Se puede abrir con Live Server de VS Code o subir a Vercel.

## Cómo verlo

En VS Code: clic derecho en `index.html` → Open with Live Server.

O en la terminal, desde esta carpeta:

```bash
python3 -m http.server 5500
```

## Páginas

| Archivo | Para qué |
| --- | --- |
| `index.html` | Inicio |
| `servicios.html` | Consultoría, infraestructura, seguridad, soporte |
| `solicitar.html` | Abre un caso y entrega un código |
| `seguimiento.html` | El cliente consulta el estado; el equipo cambia estados |
| `contacto.html` | Dirección, correo, teléfono y formulario |

## Datos de prueba

- Caso: `CF-1042` / celular `3006321901`
- También `CF-1043` (3002198844) y `CF-1044` (3157701208)
- Tablero interno: clave `fix26`

Contacto real del sitio: `computerfix.med@gmail.com` · 300 632 1934 · Cra. 15 # 78-40, local 2.

## Desarrollo Web II

La interactividad nueva está en `js/app.js`:

- Menú hamburguesa con `classList.toggle()`.
- Modo claro / oscuro (clase `tema-oscuro` en el `body`).
- Carrito de paquetes en `servicios.html`: atributos `data-id`, `data-nombre` y `data-precio`, lista con `createElement` / `appendChild`, total, eliminar y vaciar.

El carrito y el tema se guardan en `localStorage` para que no se pierdan al cambiar de página.
