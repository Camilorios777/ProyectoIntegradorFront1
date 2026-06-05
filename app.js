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
 
 