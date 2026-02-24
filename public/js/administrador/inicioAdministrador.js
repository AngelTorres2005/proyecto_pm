const tablaAlumno = async () => {
    try {
        const respuesta = await fetch('/tablaAlumno-administrador');
        const alumnos = await respuesta.json();
        const cuerpoTabla = document.getElementById('tablaAlumno');
        cuerpoTabla.innerHTML = "";

        alumnos.forEach(alumno => {
            const tr = document.createElement('tr');
            const fechaFormateada = alumno.alumnos_fecha 
                ? new Date(alumno.alumnos_fecha).toLocaleDateString('es-MX', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }) 
                : 'Sin fecha';
            tr.innerHTML = `
                <td data-label="Alumno" class="fw-bold">
                    ${alumno.alumnos_nombre ?? ''} ${alumno.alumnos_app ?? ''} ${alumno.alumnos_apm ?? ''}
                </td>
                <td data-label="Tutor (Papá)">
                    ${alumno.nombre_papa ?? 'No asignado'} ${alumno.apellidos_papa ?? ''}
                </td>
                <td data-label="Maestro">
                    <span class="badge bg-light text-dark border">
                        ${alumno.nombre_maestro_asignado ?? 'N/A'} ${alumno.apellidos_maestro_asignado ?? ''}
                    </span>
                </td>
                <td data-label="Tarea">
                    ${alumno.alumnos_tarea || 'Sin tarea pendiente'}
                </td>
                <td data-label="Fecha">
                    ${fechaFormateada}
                </td>
            `;
            cuerpoTabla.appendChild(tr);
        });
    } catch (error) {
        console.error("Error al cargar la tabla de administrador:", error);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    tablaAlumno();
});