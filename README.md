PROYECTO INTEGRADOR FRONTEND

Sistema de Gestión Académica – Notas y Usuarios
Programa: Técnica en Desarrollo de Software
Asignatura: Frontend
Tipo de proyecto: Integrador

Descripción del Proyecto
Este proyecto consiste en el desarrollo de una aplicación web interactiva que simula un sistema académico para la gestión de usuarios y calificaciones, implementando un flujo completo de autenticación, control de acceso por roles y administración de datos. La aplicación está construida utilizando tecnologías base del desarrollo frontend como HTML, CSS y JavaScript, haciendo énfasis en la manipulación del DOM, el uso de eventos y la persistencia de información mediante LocalStorage y SessionStorage.

El sistema permite el registro de nuevos usuarios con distintos roles (estudiante, profesor y administrador), donde inicialmente cada cuenta queda en estado pendiente de aprobación. Posteriormente, un administrador del sistema puede activar o bloquear accesos, permitiendo así un control centralizado de quién puede interactuar con la aplicación. Una vez autenticado, el sistema reconoce el rol del usuario y muestra dinámicamente una interfaz adaptada a sus funciones específicas.

El rol de estudiante se enfoca en la consulta de calificaciones, mostrando un listado de sus notas organizadas por materia y actividad, incluyendo un estado automático que determina si el estudiante aprueba o reprueba en función de la calificación obtenida. El rol de profesor permite gestionar notas asociadas a una materia específica, incluyendo la creación, edición y eliminación de registros, así como la asignación de calificaciones a estudiantes activos dentro del sistema. Por su parte, el rol de administrador tiene acceso completo a la gestión de usuarios y a la supervisión de las calificaciones registradas, contando con herramientas de filtrado por estado de usuario, búsqueda de estudiantes y edición tanto de datos personales como académicos.

El sistema implementa la carga inicial de datos a través de un archivo externo en formato JSON utilizando el método fetch con promesas (then/catch), lo que permite simular una fuente de datos externa. En caso de fallo en la carga del archivo, el sistema cuenta con un mecanismo de respaldo que garantiza la continuidad de la aplicación utilizando datos locales predefinidos. Toda la información manipulada durante la ejecución se sincroniza con el almacenamiento local del navegador, asegurando persistencia incluso después de cerrar o recargar la página.
Asimismo, se implementa el manejo de sesiones mediante SessionStorage, lo cual permite mantener la sesión activa del usuario mientras la pestaña esté abierta, mejorando la experiencia de uso al evitar inicios de sesión repetitivos. El sistema también incorpora validaciones en procesos críticos como el inicio de sesión, el registro de usuarios, y la edición de notas, garantizando la integridad de los datos ingresados.
Desde el punto de vista técnico, el proyecto evidencia la aplicación práctica de conceptos fundamentales del desarrollo frontend, incluyendo el uso de variables, estructuras condicionales, funciones, arreglos, métodos de iteración (como filter, find y forEach), manipulación dinámica del DOM, gestión de eventos, así como el uso de almacenamiento local para simular persistencia de datos sin un backend real. Además, se incluyen funcionalidades tipo CRUD (Crear, Leer, Actualizar y Eliminar) tanto para usuarios como para calificaciones, lo que representa un modelo básico pero completo de aplicación de gestión.

Objetivo del Proyecto
El objetivo principal de este proyecto es aplicar los conceptos fundamentales del desarrollo frontend mediante la construcción de una aplicación web funcional que permita gestionar información de usuarios y notas académicas, evidenciando el uso de lógica en JavaScript, interacción dinámica con el usuario, manipulación eficiente del DOM y la implementación de persistencia de datos en el navegador.

Conceptos Aplicados
En el desarrollo de este sistema se aplican múltiples conceptos clave como variables, condicionales, funciones, manejo de eventos, manipulación del DOM, estructuras de datos, programación orientada a eventos, uso de APIs como fetch, almacenamiento local con LocalStorage, manejo de sesiones con SessionStorage, y lógica de control de roles y permisos.

Instrucciones de Ejecución
Para ejecutar el proyecto, es necesario abrir el archivo index.html en cualquier navegador web moderno. Al iniciar, el sistema cargará los datos iniciales y mostrará la interfaz de autenticación. El usuario podrá registrarse o iniciar sesión si ya cuenta con credenciales válidas. Dependiendo del rol asignado y su estado (activo o pendiente), el sistema permitirá o restringirá el acceso al entorno principal.
Credenciales de Prueba

Administrador:
Usuario: admin@cesde.com
Contraseña: admin123
