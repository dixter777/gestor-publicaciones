const API = 'https://jsonplaceholder.typicode.com';
const formBuscar   = document.querySelector('#form-buscar');
const formCrear    = document.querySelector('#form-crear');
const inputUsuario = document.querySelector('#input-usuario');
const inputTitulo  = document.querySelector('#input-titulo');
const inputCuerpo  = document.querySelector('#input-cuerpo');
const btnCrear     = document.querySelector('#btn-crear');
const estado       = document.querySelector('#estado');
const lista        = document.querySelector('#lista');

// 1. Petición genérica: sirve para GET y para POST
async function peticion(url, opciones = {}) {
    const res = await fetch(url, opciones);
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
    return { status: res.status, datos: await res.json() };
}

// Obtener los nuevos elementos del DOM
const inputFiltro = document.querySelector('#input-filtro');
const selectLimite = document.querySelector('#select-limite');

// Actualizar crearTarjeta para cargar comentarios al hacer clic
function crearTarjeta(post, esNuevo = false) {
    const art = document.createElement('article');
    art.className = esNuevo ? 'post nuevo' : 'post';
    art.style.cursor = 'pointer'; // Indicador visual de click
    const h3 = document.createElement('h3');
    h3.textContent = `#${post.id} ${post.title}`;
    const p = document.createElement('p');
    p.textContent = post.body;
    
    const divComentarios = document.createElement('div');
    art.append(h3, p, divComentarios);

    // Evento para obtener comentarios
    art.addEventListener('click', async () => {
        if (divComentarios.innerHTML !== '') return; // Evita peticiones repetidas
        divComentarios.innerHTML = '<hr><em>Cargando comentarios...</em>';
        try {
            const { datos } = await peticion(`${API}/posts/${post.id}/comments`);
            divComentarios.innerHTML = '<hr><h4>Comentarios:</h4>';
            datos.forEach(c => {
                const commentEl = document.createElement('p');
                commentEl.style.fontSize = '0.85em';
                commentEl.innerHTML = `<strong>${c.email}</strong>: ${c.body}`;
                divComentarios.append(commentEl);
            });
        } catch (error) {
            divComentarios.innerHTML = `<span class="error">Error: ${error.message}</span>`;
        }
    });

    return art;
}

function mostrarEstado(texto, esError = false) {
    estado.textContent = texto;
    estado.className = esError ? 'error' : '';
}

// Actualizar evento del formulario para aplicar _limit y .filter()
formBuscar.addEventListener('submit', async (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
        userId: inputUsuario.value,
        _limit: selectLimite.value // Se lee el límite del <select>
    });
    mostrarEstado('Cargando...');
    try {
        const { status, datos } = await peticion(`${API}/posts?${params}`);
        
        // Filtro por texto en el navegador
        const textoBusqueda = inputFiltro.value.trim().toLowerCase();
        const postsFiltrados = datos.filter(post => 
            post.title.toLowerCase().includes(textoBusqueda)
        );

        lista.replaceChildren(...postsFiltrados.map(p => crearTarjeta(p)));
        mostrarEstado(`GET ${status}: ${postsFiltrados.length} publicaciones mostradas`);
    } catch (error) {
        mostrarEstado(error.message, true);
    }
});

// Actualización del evento POST de publicaciones (validaciones)
formCrear.addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = inputTitulo.value.trim();
    const cuerpo = inputCuerpo.value.trim();

    // Validar título y contenido
    if (titulo.length < 5) {
        return mostrarEstado('Error: El título debe tener al menos 5 caracteres', true);
    }
    if (cuerpo === '') {
        return mostrarEstado('Error: El contenido no puede estar vacío', true);
    }

    const nuevo = { title: titulo, body: cuerpo, userId: Number(inputUsuario.value) };
    btnCrear.disabled = true;
    mostrarEstado('Enviando...');
    try {
        const { status, datos } = await peticion(`${API}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevo)
        });
        lista.prepend(crearTarjeta(datos, true));
        mostrarEstado(`POST ${status}: creada con id ${datos.id}`);
        formCrear.reset();
    } catch (error) {
        mostrarEstado(error.message, true);
    } finally {
        btnCrear.disabled = false;
    }
});

// Nuevo evento POST para enviar comentarios
const formComentar = document.querySelector('#form-comentar');
formComentar.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnComentar = formComentar.querySelector('button');
    
    // Construir cuerpo usando FormData y Object.fromEntries
    const datosForm = new FormData(formComentar);
    const cuerpoReq = Object.fromEntries(datosForm);
    cuerpoReq.postId = Number(cuerpoReq.postId); // Parseo a numero

    btnComentar.disabled = true;
    mostrarEstado('Enviando comentario...');
    
    try {
        const { status, datos } = await peticion(`${API}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cuerpoReq)
        });
        mostrarEstado(`POST ${status}: Comentario creado (ID devuelto: ${datos.id})`);
        formComentar.reset();
    } catch (error) {
        mostrarEstado(error.message, true);
    } finally {
        btnComentar.disabled = false;
    }
});


// leer los parametros de la url
const query = new URLSearchParams(location.search);
const nombre = query.get('nombre');
const curso = query.get('curso');

// Si existen los parametros  en la URL, los mostramos en pantalla
if (nombre && curso) {
    const resultadoGet = document.querySelector('#resultado-get');
    resultadoGet.textContent = `Valores leídos de la URL -> Nombre: ${nombre} | Curso: ${curso}`;
}
// 5. Carga inicial
formBuscar.requestSubmit();