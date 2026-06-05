// Ejecutamos el DOM lo aprendido en clase
document.addEventListener("DOMContentLoaded", function () {
    const objetoCredenciales = {
        nombreUsuario: "admincesde",
        claveUsuario: "12345"
    };

    const cantidadMaximaIntentos = 3;
    let cantidadIntentosFallidos = 0;
    let usuariosGuardados = [];

    // Colocamos los elementos del DOM
    const contenedorLogin = document.getElementById("login");
    const contenedorAplicacion = document.getElementById("app");
    const botonIniciarSesion = document.getElementById("botonLogin");
    const mensajeErrorLogin = document.getElementById("mensajeLogin");
    const botonAgregarUsuario = document.getElementById("botonAgregar");
    const listaDeUsuarios = document.getElementById("listaUsuarios");
    const botonCerrarSesion = document.getElementById("botonSalir");

    //En este paso creamos el LocalStorage para que los datos queden almacenados
    if (localStorage.getItem("usuariosGuardados")) {
        let datos = localStorage.getItem("usuariosGuardados").split(";");
        for (let i = 0; i < datos.length; i++) {
            let partes = datos[i].split(",");
            usuariosGuardados.push({
                nombreUsuario: partes[0],
                rolUsuario: partes[1]
            });
        }
    }

     // Creamos el constructor this, para la clase nombre y rol
    function Usuario(nombreUsuario, rolUsuario) {
        this.nombreUsuario = nombreUsuario;
        this.rolUsuario = rolUsuario;
    }

    // Proceso de ingreso a la página
    botonIniciarSesion.addEventListener("click", function (event) {
        event.preventDefault(); 
        let valorUsuario = document.getElementById("usuario").value;
        let valorClave = document.getElementById("password").value;
        if (
            valorUsuario === objetoCredenciales.nombreUsuario &&
            valorClave === objetoCredenciales.claveUsuario
        ) {
            contenedorLogin.classList.add("oculto");
            contenedorAplicacion.classList.remove("oculto");
            mensajeErrorLogin.textContent = "";
            cantidadIntentosFallidos = 0;
            mostrarListaUsuarios();
        } else {
            cantidadIntentosFallidos++;
            mensajeErrorLogin.textContent = "Datos incorrectos. Intento " + 
            cantidadIntentosFallidos + " de " + cantidadMaximaIntentos;
            if (cantidadIntentosFallidos >= cantidadMaximaIntentos) {
                alert("Cuenta bloqueada");
                botonIniciarSesion.disabled = true;
            }
        }
    });
    // En este modulo insertamos el nuevo usuario con el Rol
    botonAgregarUsuario.addEventListener("click", function () {
        let valorNombreUsuario = document.getElementById("nombre").value;
        let valorRolUsuario = document.getElementById("rol").value;
        if (valorNombreUsuario === "" || valorRolUsuario === "") {
            alert("Complete todos los campos");
            return;
        }
        let nuevoUsuario = new Usuario(valorNombreUsuario, valorRolUsuario);
        usuariosGuardados.push(nuevoUsuario);
        guardarEnLocalStorage();
        mostrarListaUsuarios();
        document.getElementById("nombre").value = "";
        document.getElementById("rol").value = "";
    });
 
    // Cuando demos clic en agregar usuario, esta función toma el LocalStorage
    function guardarEnLocalStorage() {
        let texto = "";
        for (let i = 0; i < usuariosGuardados.length; i++) {
            texto += usuariosGuardados[i].nombreUsuario + "," + usuariosGuardados[i].rolUsuario;
            if (i < usuariosGuardados.length - 1) {
                texto += ";";
            }
        }
        localStorage.setItem("usuariosGuardados", texto);
    }
 
    // Se implementa la función del modulo mostrar la lista de usuarios registrados
    function mostrarListaUsuarios() {
        listaDeUsuarios.innerHTML = "";
        for (let i = 0; i < usuariosGuardados.length; i++) {
            let usuario = usuariosGuardados[i];
            let li = document.createElement("li");
            li.innerHTML =
                usuario.nombreUsuario + " - " + usuario.rolUsuario +
                "<div>" +
                "<button onclick='editarUsuario(" + i + ")'>Editar</button>" +
                "<button onclick='eliminarUsuario(" + i + ")'>Eliminar</button>" +
                "</div>";
            listaDeUsuarios.appendChild(li);
        }
    }
 
    // Funciones creadas para editar los nombres y roles por si se debe corregir algo
    window.editarUsuario = function (indice) {
        let usuario = usuariosGuardados[indice];
        let nuevoNombreUsuario = prompt("Nuevo nombre:", usuario.nombreUsuario);
        let nuevoRolUsuario = prompt("Nuevo rol:", usuario.rolUsuario);
        if (nuevoNombreUsuario && nuevoRolUsuario) {
            usuariosGuardados[indice].nombreUsuario = nuevoNombreUsuario;
            usuariosGuardados[indice].rolUsuario = nuevoRolUsuario;
            guardarEnLocalStorage();
            mostrarListaUsuarios();
        }
    };
 
    // Creamos el boton para eliminar el usuario por si ya no se necesita
    window.eliminarUsuario = function (indice) {
        if (confirm("¿Eliminar usuario?")) {
            usuariosGuardados.splice(indice, 1);
            guardarEnLocalStorage();
            mostrarListaUsuarios();
        }
    };
 
    // último proceso con el boton para cerrar la sesión del Admin
    botonCerrarSesion.addEventListener("click", function () {
        contenedorAplicacion.classList.add("oculto");
        contenedorLogin.classList.remove("oculto");
        botonIniciarSesion.disabled = false;
        cantidadIntentosFallidos = 0;
        mensajeErrorLogin.textContent = "";
    });
 
});