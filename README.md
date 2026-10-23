**Gestor de Publicaciones** 📝

Aplicación web estática desarrollada para consumir la API REST de prueba **JSONPlaceholder** mediante peticiones HTTP (GET y POST) usando JavaScript y `fetch`. Este proyecto forma parte de las prácticas de laboratorio del curso de Desarrollo de Software I.

**🚀 Sitio Web Publicado**

Puedes probar la aplicación funcionando en tiempo real desde GitHub Pages aquí:
👉 [https://dixter777.github.io/gestor-publicaciones/](https://dixter777.github.io/gestor-publicaciones/)

**✨ Funcionalidades**

**Peticiones GET (Lectura y Consultas)**

* **Listado dinámico:** Obtiene las publicaciones de un usuario específico (del 1 al 10) ajustando la cantidad de resultados mostrados (5, 10 o 20 mediante `_limit`).


* **Filtrado en tiempo real:** Permite buscar y filtrar localmente las publicaciones mostradas usando coincidencias de texto en el título.
* **Carga de comentarios al clic:** Al presionar sobre cualquier tarjeta de publicación, se realiza una petición secundaria (`/posts/{id}/comments`) para desplegar sus comentarios en la misma interfaz.


* **Parámetros por URL:** Incluye un formulario de prueba que envía datos por la barra de direcciones y los lee utilizando `URLSearchParams`.



**Peticiones POST (Creación de Datos)**

* **Nueva publicación:** Formulario con validaciones (mínimo 5 caracteres en el título y contenido obligatorio) que envía una petición POST a la API y renderiza la respuesta simulada al inicio de la lista.


* **Nuevos comentarios:** Implementación de un formulario que empaqueta los datos usando `FormData` y `Object.fromEntries` para enviar comentarios vinculados al ID de un post.



**🛠️ Tecnologías y Herramientas**

* **Frontend:** HTML5, CSS3, JavaScript (ES6+, Promesas, Async/Await).


* **API:** [JSONPlaceholder](https://jsonplaceholder.typicode.com/).


* **Despliegue:** GitHub Pages.