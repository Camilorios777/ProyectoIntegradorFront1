// Conexión con datos.json
let usuarios = [];
let calificaciones = [];
let usuarioLogueado = null;

// Manejo del DOM
const authContainer = document.getElementById('authContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const loginBox = document.getElementById('loginBox');
const registerBox = document.getElementById('registerBox');

// Formularios
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const formCrearNota = document.getElementById('formCrearNota');
const regRol = document.getElementById('regRol');
const regMateria = document.getElementById('regMateria');
const welcomeTitle = document.getElementById('welcomeTitle');
const userBadge = document.getElementById('userBadge');
const materiaBadge = document.getElementById('materiaBadge');

// Manejo de filtro para el administrado
const filterUsuarioEstado = document.getElementById('filterUsuarioEstado');
const searchEstudianteNota = document.getElementById('searchEstudianteNota');

// Carga con Promesas (FETCH/THEN/CATCH) de acuerdo a lo visto en clase
function cargarDatosIniciales() {
    fetch('datos.json')
        .then(response => {
            if (!response.ok) throw new Error("Fallo en la comunicación con el archivo JSON.");
            return response.json();
        })
        .then(data => {
            console.log("Datos del JSON leídos mediante Promesas con éxito.");
            usuarios = JSON.parse(localStorage.getItem('sys_usuarios')) || data.usuariosIniciales;
            calificaciones = JSON.parse(localStorage.getItem('sys_notas')) || data.notasIniciales;
            sincronizarAlmacenamiento();
            verificarSesionActiva();
        })
        .catch(error => {
            console.warn("Ejecutando Catch de respaldo local (CORS o ausencia de JSON):", error);
            usuarios = JSON.parse(localStorage.getItem('sys_usuarios')) || [
                { id: 1, nombre: "Admin General", user: "admin@cesde.com", pass: "admin123", rol: "admin", activo: true }
            ];
            calificaciones = JSON.parse(localStorage.getItem('sys_notas')) || [];
            sincronizarAlmacenamiento();
            verificarSesionActiva();
        });
}

function sincronizarAlmacenamiento() {
    localStorage.setItem('sys_usuarios', JSON.stringify(usuarios));
    localStorage.setItem('sys_notas', JSON.stringify(calificaciones));
}

// Proceso para el Login y si no esta creado el registro (lo que evita que la página se recargue)
document.getElementById('btnIrARegistro').addEventListener('click', () => {
    loginBox.classList.add('oculto'); registerBox.classList.remove('oculto');
});
document.getElementById('btnIrALogin').addEventListener('click', () => {
    registerBox.classList.add('oculto'); loginBox.classList.remove('oculto');
});
regRol.addEventListener('change', (e) => {
    if (e.target.value === 'profesor') {
        regMateria.classList.remove('oculto'); regMateria.required = true;
    } else {
        regMateria.classList.add('oculto'); regMateria.required = false;
    }
});

// Autenticación en el ingreso
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const correo = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    const txtError = document.getElementById('mensajeLogin');

    const cuenta = usuarios.find(u => u.user === correo && u.pass === pass);

    if (!cuenta) {
        txtError.textContent = "Error: Credenciales inválidas.";
        return;
    }
    if (!cuenta.activo) {
        txtError.textContent = "Acceso denegado: Tu usuario no ha sido activado por el Administrador.";
        return;
    }

    usuarioLogueado = cuenta;
    sessionStorage.setItem('sys_sesion_activa', JSON.stringify(usuarioLogueado));
    txtError.textContent = "";
    loginForm.reset();
    dibujarEntornoDashboard();
});

document.getElementById('btnCerrarSesion').addEventListener('click', () => {
    sessionStorage.removeItem('sys_sesion_activa');
    usuarioLogueado = null;
    dashboardContainer.classList.add('oculto');
    authContainer.classList.remove('oculto');
});

// Registro para nuevos usuarios
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('regNombre').value.trim();
    const user = document.getElementById('regUser').value.trim();
    const pass = document.getElementById('regPass').value;
    const rol = regRol.value;
    const materia = regMateria.value.trim();
    const txtSuccess = document.getElementById('mensajeRegistro');

    if (usuarios.some(u => u.user === user)) {
        txtSuccess.style.color = "var(--danger)";
        txtSuccess.textContent = "Este correo electrónico ya está registrado.";
        return;
    }

    usuarios.push({
        id: Date.now(),
        nombre, user, pass, rol,
        materia: rol === 'profesor' ? materia : null,
        activo: false // Se deja False ya que el administrar debe dar la aprobacipn
    });
    sincronizarAlmacenamiento();

    txtSuccess.style.color = "var(--secondary)";
    txtSuccess.textContent = "¡Solicitud enviada! Espera a que el Admin apruebe tu acceso.";
    registerForm.reset();
    regMateria.classList.add('oculto');
});

// Manejo del control del entorno de los usuarios
function dibujarEntornoDashboard() {
    authContainer.classList.add('oculto');
    dashboardContainer.classList.remove('oculto');
    welcomeTitle.textContent = `¡Hola, ${usuarioLogueado.nombre}!`;
    userBadge.textContent = usuarioLogueado.rol;

    document.getElementById('vistaEstudiante').classList.add('oculto');
    document.getElementById('vistaProfesor').classList.add('oculto');
    document.getElementById('vistaAdmin').classList.add('oculto');
    materiaBadge.classList.add('oculto');

    if (usuarioLogueado.rol === 'estudiante') {
        document.getElementById('vistaEstudiante').classList.remove('oculto');
        construirVistaEstudiante();
    } else if (usuarioLogueado.rol === 'profesor') {
        document.getElementById('vistaProfesor').classList.remove('oculto');
        materiaBadge.classList.remove('oculto');
        materiaBadge.textContent = `Materia: ${usuarioLogueado.materia}`;
        construirVistaProfesor();
    } else if (usuarioLogueado.rol === 'admin') {
        document.getElementById('vistaAdmin').classList.remove('oculto');
        construirVistaAdmin();
    }
}

// Visual del dashboard para el estudiante
function construirVistaEstudiante() {
    const tabla = document.getElementById('tablaEstudianteNotas');
    tabla.innerHTML = "";
    const misNotas = calificaciones.filter(n => n.estudianteId === usuarioLogueado.id);

    if(misNotas.length === 0) {
        tabla.innerHTML = `<tr><td colspan="4" style="text-align:center;">No posees calificaciones registradas.</td></tr>`;
        return;
    }
    misNotas.forEach(n => {
        const estado = n.calificacion >= 3.0 ? 'Aprobado' : 'Reprobado';
        tabla.innerHTML += `
            <tr>
                <td><strong>${n.materia}</strong></td>
                <td>${n.actividad}</td>
                <td>${n.calificacion.toFixed(1)}</td>
                <td><span class="status-badge ${n.calificacion >= 3.0 ? 'activo' : 'pendiente'}">${estado}</span></td>
            </tr>`;
    });
}

// visual del dashboard para el profesor
function construirVistaProfesor() {
    const select = document.getElementById('selectEstudianteNota');
    select.innerHTML = `<option value="" disabled selected>Selecciona un Estudiante...</option>`;
    usuarios.filter(u => u.rol === 'estudiante' && u.activo).forEach(a => {
        select.innerHTML += `<option value="${a.id}">${a.nombre}</option>`;
    });

    const tabla = document.getElementById('tablaProfesorCRUD');
    tabla.innerHTML = "";
    calificaciones.filter(n => n.materia === usuarioLogueado.materia).forEach(n => {
        tabla.innerHTML += `
            <tr>
                <td>${n.estudianteNombre}</td>
                <td>${n.actividad}</td>
                <td><strong>${n.calificacion.toFixed(1)}</strong></td>
                <td>
                    <button class="btn-action btn-warning" onclick="desplegarEditorNota(${n.id})">Editar</button>
                    <button class="btn-action btn-danger" onclick="eliminarNotaPorProfesor(${n.id})">Eliminar</button>
                </td>
            </tr>`;
    });
}

formCrearNota.addEventListener('submit', (e) => {
    e.preventDefault();
    const estId = parseInt(document.getElementById('selectEstudianteNota').value);
    const actividad = document.getElementById('txtActividad').value.trim();
    const nota = parseFloat(document.getElementById('numCalificacion').value);
    const est = usuarios.find(u => u.id === estId);

    calificaciones.push({
        id: Date.now(), estudianteId: estId, estudianteNombre: est.nombre,
        materia: usuarioLogueado.materia, actividad, calificacion: nota
    });
    sincronizarAlmacenamiento();
    formCrearNota.reset();
    construirVistaProfesor();
});

window.eliminarNotaPorProfesor = function(id) {
    if (confirm("¿Deseas eliminar esta nota permanentemente?")) {
        calificaciones = calificaciones.filter(n => n.id !== id);
        sincronizarAlmacenamiento();
        construirVistaProfesor();
    }
};

// Visual del Administrar, creando los filtros y modificando datos de acuerdo al CRUD
function construirVistaAdmin() {
    // Se crea la opción de filtrar la tabla de usuarios
    const tablaUser = document.getElementById('tablaAdminUsuarios');
    tablaUser.innerHTML = "";
    const filtroEstado = filterUsuarioEstado.value; // todos, activos, pendientes

    usuarios.forEach(u => {
        if(u.rol === 'admin') return; // Ignorar la propia cuenta del administrador
        
        // Filtro de acuerdo al estado sea activo o pendiente
        if(filtroEstado === 'activos' && !u.activo) return;
        if(filtroEstado === 'pendientes' && u.activo) return;

        const estadoHtml = u.activo ? `<span class="status-badge activo">Activo</span>` : `<span class="status-badge pendiente">Pendiente</span>`;
        const btnEstado = u.activo 
            ? `<button class="btn-action btn-danger" onclick="cambiarEstadoUsuario(${u.id}, false)">Bloquear</button>`
            : `<button class="btn-action btn-save" onclick="cambiarEstadoUsuario(${u.id}, true)">Aprobar</button>`;

        tablaUser.innerHTML += `
            <tr>
                <td>${u.nombre}</td>
                <td>${u.user}</td>
                <td><span class="badge">${u.rol} ${u.materia ? `(${u.materia})` : ''}</span></td>
                <td>${estadoHtml}</td>
            <td>
                <div class="acciones-container">
                ${btnEstado}
                <button class="btn-action btn-warning" onclick="desplegarEditorUsuario(${u.id})">Editar Datos</button>
                <button class="btn-action btn-danger" onclick="eliminarUsuarioPorAdmin(${u.id})">Eliminar</button>
              </div>
            </td>

            </tr>`;
    });

    // Se organiza y se filtra la tabla por las notas de estudiantes
    const tablaNotas = document.getElementById('tablaAdminNotas');
    tablaNotas.innerHTML = "";
    const busquedaEstudiante = searchEstudianteNota.value.toLowerCase().trim();

    const notasFiltradas = calificaciones.filter(n => {
        return n.estudianteNombre.toLowerCase().includes(busquedaEstudiante);
    });

    if(notasFiltradas.length === 0) {
        tablaNotas.innerHTML = `<tr><td colspan="5" style="text-align:center;">No se encontraron registros que coincidan.</td></tr>`;
        return;
    }

    notasFiltradas.forEach(n => {
        tablaNotas.innerHTML += `
            <tr>
                <td>${n.estudianteNombre}</td>
                <td><strong>${n.materia}</strong></td>
                <td>${n.actividad}</td>
                <td>${n.calificacion.toFixed(1)}</td>
                <td>
                    <button class="btn-action btn-warning" onclick="desplegarEditorNota(${n.id})">Corregir Nota</button>
                </td>
            </tr>`;
    });
}

// Eventos para Filtros del Administrador
filterUsuarioEstado.addEventListener('change', construirVistaAdmin);
searchEstudianteNota.addEventListener('input', construirVistaAdmin);

// Acciones Administrativas directas para cambiar los estados
window.cambiarEstadoUsuario = function(id, estado) {
    const idx = usuarios.findIndex(u => u.id === id);
    if(idx !== -1) {
        usuarios[idx].activo = estado;
        sincronizarAlmacenamiento();
        construirVistaAdmin();
    }
};

window.eliminarUsuarioPorAdmin = function(id) {
    if(confirm("¿Eliminar por completo este usuario de la institución?")) {
        usuarios = usuarios.filter(u => u.id !== id);
        calificaciones = calificaciones.filter(n => n.estudianteId !== id);
        sincronizarAlmacenamiento();
        construirVistaAdmin();
    }
};

// Edición de notas (compartido con el profesor)
window.desplegarEditorNota = function(id) {
    const nota = calificaciones.find(n => n.id === id);
    if (nota) {
        document.getElementById('modalEditarNota').classList.remove('oculto');
        document.getElementById('editNotaId').value = nota.id;
        document.getElementById('lblEstudianteEditar').textContent = `Estudiante: ${nota.estudianteNombre} | Actividad: ${nota.actividad}`;
        document.getElementById('numEditarCalificacion').value = nota.calificacion;
    }
};

document.getElementById('btnConfirmarEdicion').addEventListener('click', () => {
    const id = parseInt(document.getElementById('editNotaId').value);
    const val = parseFloat(document.getElementById('numEditarCalificacion').value);

    if (isNaN(val) || val < 0 || val > 5) {
        alert("Introduce una nota entre 0.0 y 5.0"); return;
    }
    const idx = calificaciones.findIndex(n => n.id === id);
    if(idx !== -1) {
        calificaciones[idx].calificacion = val;
        sincronizarAlmacenamiento();
        document.getElementById('modalEditarNota').classList.add('oculto');
        if (usuarioLogueado.rol === 'profesor') construirVistaProfesor();
        if (usuarioLogueado.rol === 'admin') construirVistaAdmin();
    }
});
document.getElementById('btnCancelarEdicion').addEventListener('click', () => {
    document.getElementById('modalEditarNota').classList.add('oculto');
});

// Nuevo módulo de edición de usuarios por el Administrador
const modalEditarUsuario = document.getElementById('modalEditarUsuario');
const selectEditUserRol = document.getElementById('selectEditUserRol');
const wrapperEditMateria = document.getElementById('wrapperEditMateria');

selectEditUserRol.addEventListener('change', (e) => {
    if(e.target.value === 'profesor') wrapperEditMateria.classList.remove('oculto');
    else wrapperEditMateria.classList.add('oculto');
});

window.desplegarEditorUsuario = function(id) {
    const userObj = usuarios.find(u => u.id === id);
    if(userObj) {
        modalEditarUsuario.classList.remove('oculto');
        document.getElementById('editUsuarioId').value = userObj.id;
        document.getElementById('txtEditUserNombre').value = userObj.nombre;
        document.getElementById('txtEditUserCorreo').value = userObj.user;
        selectEditUserRol.value = userObj.rol;
        
        if(userObj.rol === 'profesor') {
            wrapperEditMateria.classList.remove('oculto');
            document.getElementById('txtEditUserMateria').value = userObj.materia || '';
        } else {
            wrapperEditMateria.classList.add('oculto');
            document.getElementById('txtEditUserMateria').value = '';
        }
    }
};

document.getElementById('btnConfirmarEdicionUsuario').addEventListener('click', () => {
    const id = parseInt(document.getElementById('editUsuarioId').value);
    const nombre = document.getElementById('txtEditUserNombre').value.trim();
    const correo = document.getElementById('txtEditUserCorreo').value.trim();
    const rol = selectEditUserRol.value;
    const materia = document.getElementById('txtEditUserMateria').value.trim();

    if(!nombre || !correo) {
        alert("El nombre y el correo no pueden estar vacíos."); return;
    }

    const idx = usuarios.findIndex(u => u.id === id);
    if(idx !== -1) {
        // En este código guardamos los cambios realizado
        usuarios[idx].nombre = nombre;
        usuarios[idx].user = correo;
        usuarios[idx].rol = rol;
        usuarios[idx].materia = rol === 'profesor' ? materia : null;

        // Actualizar nombres duplicados históricos en la tabla de notas asociadas
        calificaciones.forEach((n, i) => {
            if(n.estudianteId === id) calificaciones[i].estudianteNombre = nombre;
            if(rol === 'profesor' && n.materia === usuarios[idx].materia) {
                 // Si se cambia de materia al docente, se puede ajustar la lógica aquí si es necesario
            }
        });

        sincronizarAlmacenamiento();
        modalEditarUsuario.classList.add('oculto');
        construirVistaAdmin();
    }
});

document.getElementById('btnCancelarEdicionUsuario').addEventListener('click', () => {
    modalEditarUsuario.classList.add('oculto');
});

// Validación por si hay re-ingreso de usuario, es decir cuenta con la sesión abierta
function verificarSesionActiva() {
    const sesion = sessionStorage.getItem('sys_sesion_activa');
    if (sesion) {
        usuarioLogueado = JSON.parse(sesion);
        dibujarEntornoDashboard();
    }
}

window.addEventListener('DOMContentLoaded', cargarDatosIniciales);