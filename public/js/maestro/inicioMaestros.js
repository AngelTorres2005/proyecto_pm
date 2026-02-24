document.addEventListener('DOMContentLoaded', () => {
    sweetAlert();
    tablaAlumno();
    selectPapa();
});

function abrirModalAlumno() {
    const modalPago = new bootstrap.Modal(document.getElementById('modalAgregarAlumno'));
    modalPago.show();
}
function abrirModalUsuario() {
    const modalPago = new bootstrap.Modal(document.getElementById('modalAgregarUsuario'));
    modalPago.show();
}
function sweetAlert() {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const mensaje = urlParams.get('msg');

    if (status === 'error') {
        Swal.fire({
            icon: 'error',
            title: 'Error al insertar',
            text: 'Hubo un error inesperado al agregar.',
            confirmButtonColor: '#C9B59C'
        });
    } else if (status === 'alumnoAgregado') {
        Swal.fire({
            icon: 'success',
            title: 'Alumno agregado con exito',
            text: 'Alumno agregado correctamente.',
            confirmButtonColor: '#C9B59C'
        });
    } else if (status === 'usuarioAgregado') {
        Swal.fire({
            icon: 'success',
            title: 'Usuario agregado con exito',
            text: 'Usuario agregado correctamente.',
            confirmButtonColor: '#C9B59C'
        })
    } else if (status === 'alumnoActualizado') {
        Swal.fire({
            icon: 'success',
            title: 'Alumno actualizado con exito',
            text: 'Se le asigno su tarea correctamente y se mandara una notificacion',
            confirmButtonColor: '#C9B59C'
        })
    } else if (status === 'alumnoEliminado') {
        Swal.fire({
            icon: 'success',
            title: 'Alumno eliminado con exito',
            confirmButtonColor: '#C9B59C'
        })
    } else if (status === 'alumnoNoEliminado') {
        Swal.fire({
            icon: 'error',
            title: 'Hubo un error al eliminar al alumno',
            confirmButtonColor: '#C9B59C'
        })
    } else if (status === 'usuarioExistente') {
        Swal.fire({
            icon: 'error',
            title: 'El usuario ya existe',
            confirmButtonColor: '#C9B59C'
        })
    }
}
async function tablaAlumno() {
    try {
        const respuesta = await fetch('/tablaAlumno');
        const alumnos = await respuesta.json();
        const cuerpoTabla = document.getElementById('tablaAlumno');

        cuerpoTabla.innerHTML = "";

        alumnos.forEach(alumno => {
            const fechaLimpia = alumno.alumnos_fecha ? alumno.alumnos_fecha.split('T')[0] : '';
            const tr = document.createElement('tr');
            console.log(alumno.idPapa);
            const nombrePapa = alumno.nombre_papa || 'Sin asignar';
            const apellidosPapa = alumno.apellidos_papa || '';

            tr.innerHTML = `
                    <td class="ps-4 text-start fw-bold text-dark">${alumno.alumnos_nombre} ${alumno.alumnos_app} ${alumno.alumnos_apm}</td>
                    <td class="ps-4 text-start fw-bold text-dark">${nombrePapa} ${apellidosPapa}</td>
                    <td class="ps-4 text-start fw-bold text-dark">${alumno.alumnos_tarea || 'Sin tarea'}</td>
                    <td class="ps-4 text-start fw-bold text-dark">${fechaLimpia || 'S/F'}</td>
                    <td class="ps-4 pe-4 d-flex justify-content-center gap-2">
                        <button class="btn btn-sm" onclick="abrirModalEditar('${alumno.idAlumno}','${alumno.alumnos_nombre}','${alumno.alumnos_app}','${alumno.alumnos_apm}','${alumno.alumnos_tarea || ""}','${fechaLimpia}','${alumno.idPapa}')" style="color:#A68F78; border:1px solid #C9B59C;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="confirmarEliminar('${alumno.idAlumno}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                        </button>
                    </td>`;
            cuerpoTabla.appendChild(tr);
        });
    } catch (error) {
        console.error("Error al llenar la tabla:", error);
    }
}
function abrirModalEditar(idAlumno, nombre, appAlumno, apmAlumno, tarea, fecha, idPapa) {
    document.getElementById('edit_idAlumno').value = idAlumno;
    document.getElementById('edit_nombre').value = nombre;
    document.getElementById('edit_app').value = appAlumno;
    document.getElementById('edit_apm').value = apmAlumno;
    document.getElementById('edit_tarea').value = tarea;
    document.getElementById('edit_fecha').value = fecha;

    const selectPapa = document.getElementById('edit_idPapa');

    if (idPapa) {
        selectPapa.value = idPapa;
    } else {
        selectPapa.value = "";
    }
    const modalPago = new bootstrap.Modal(document.getElementById('modalEditarAlumno'));
    modalPago.show();
}
async function selectPapa() {
    try {
        const respuesta = await fetch('/selectPapa');
        const papas = await respuesta.json();

        const selectElement = document.getElementById('edit_idPapa');

        selectElement.innerHTML = '<option value="" disabled selected>Selecciona al tutor...</option>';

        papas.forEach(papa => {
            const nombreCompleto = `${papa.nombre} ${papa.apellidos || ''}`;
            selectElement.innerHTML += `<option value="${papa.idUsuario}">${nombreCompleto}</option>`;
        });
    } catch (error) {
        console.error("Error al cargar el select de papás:", error);
    }
}
function confirmarEliminar(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#C9B59C',
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = `/eliminarAlumno/${id}`;
        }
    });
}

function filtrarMaestros() {
    const texto = document.getElementById('inputBusqueda').value.toLowerCase();
    const filas = document.querySelectorAll('#tablaAlumno tr');

    filas.forEach(fila => {
        const contenido = fila.textContent.toLowerCase();
        fila.style.display = contenido.includes(texto) ? '' : 'none';
    });
}