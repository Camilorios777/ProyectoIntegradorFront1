function iniciarSesion() {

    const usuarioCorrecto = "admincesde";
    const contraseñaCorrecta = "12345";

    let intentos = 0;
    const maxIntentos = 3;

    while (intentos < maxIntentos) {

        let usuario = prompt("Ingrese su usuario:");
        let contraseña = prompt("Ingrese su contraseña:");

        console.log("Usuario ingresado:", usuario);
        console.log("Contraseña ingresada:", contraseña);

        if (usuario === usuarioCorrecto && contraseña === contraseñaCorrecta) {

            console.log("Acceso permitido");
            alert("Bienvenido al sistema");
            return;

        } else {

            intentos++;
            alert("Datos incorrectos. Intento #" + intentos);

        }
    }

    alert("Cuenta bloqueada. Superó los 3 intentos.");
}

iniciarSesion();