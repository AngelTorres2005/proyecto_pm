function sweetAlert() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');

    if (error === 'pass_incorrecta') {
        Swal.fire({
            toast: true,
            position: 'top-end',   // esquina superior derecha
            icon: 'error',
            title: 'Contraseña incorrecta',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
    } else if (error === 'usuario_no_existe') {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Usuario no existe',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    sweetAlert();
});