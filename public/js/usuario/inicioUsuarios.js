async function tablaAlumno() {
    try {
        const respuesta = await fetch('/llenarTabla');
        const alumnos = await respuesta.json();
        console.table(alumnos);
        const cuerpoTabla = document.getElementById('tablaAlumno');

        cuerpoTabla.innerHTML = "";
        
        alumnos.forEach(alumno => {
            const tr = document.createElement('tr');
            const fechaLimpia = alumno.fecha ? alumno.fecha.split('T')[0] : '';
            tr.innerHTML = `
                <td data-label="Nombre del alumno" class="ps-4 text-start text-muted">${alumno.nombre} ${alumno.app} ${alumno.apm}</td>
                <td data-label="Tarea" class="ps-4 text-start text-muted">${alumno.tarea || 'Sin tarea'}</td>
                <td data-label="Fecha limite" class="ps-4 pe-4  text-muted">${fechaLimpia}</td>
            `;
            cuerpoTabla.appendChild(tr);
        });
    } catch (error) {
        console.error("Error al llenar la tabla:", error);
    }
}



const PUBLIC_VAPID_KEY = typeof window !== 'undefined' && window.PUBLIC_VAPID_KEY ? window.PUBLIC_VAPID_KEY : '';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const output = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) output[i] = rawData.charCodeAt(i);
    return output;
}

async function ensureServiceWorkerRegistered() {
    if (!('serviceWorker' in navigator)) return null;
    try {
        const reg = await navigator.serviceWorker.register('/worker.js');
        await navigator.serviceWorker.ready;
        return reg;
    } catch (e) {
        console.error('No se pudo registrar el Service Worker:', e);
        return null;
    }
}

async function activarNotificaciones() {
    const banner = document.getElementById('notificacionesBanner');
    const texto = document.getElementById('notificacionesTexto');
    const btn = document.getElementById('btnActivarNotificaciones');

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        texto.textContent = 'Tu navegador no soporta notificaciones push.';
        if (btn) btn.remove();
        return;
    }

    // Push requiere "secure context": HTTPS o localhost. En LAN/IP casi siempre falla.
    if (!window.isSecureContext) {
        texto.textContent = 'Las notificaciones push requieren HTTPS (o abrirlo como localhost).';
        if (btn) { btn.disabled = false; btn.textContent = 'Entendido'; }
        return;
    }

    if (Notification.permission === 'denied') {
        texto.textContent = 'Bloqueaste las notificaciones. Actívalas en la configuración del sitio.';
        if (btn) btn.remove();
        return;
    }

    if (Notification.permission === 'granted') {
        await guardarSuscripcionSiExiste();
        texto.textContent = 'Notificaciones activadas. Recibirás avisos de nuevas tareas.';
        if (btn) btn.remove();
        return;
    }

    try {
        if (btn) btn.disabled = true;
        texto.textContent = 'Permitiendo notificaciones…';

        const permiso = await Notification.requestPermission();
        if (permiso !== 'granted') {
            texto.textContent = 'Se necesitan notificaciones permitidas para recibir avisos.';
            if (btn) { btn.disabled = false; btn.textContent = 'Reintentar'; }
            return;
        }

        texto.textContent = 'Conectando con el servicio de notificaciones…';
        const register = await ensureServiceWorkerRegistered();
        if (!register) {
            texto.textContent = 'No se pudo iniciar el Service Worker. Revisa que estés en HTTPS/localhost.';
            if (btn) { btn.disabled = false; btn.textContent = 'Reintentar'; }
            return;
        }

        const keyBytes = urlBase64ToUint8Array(PUBLIC_VAPID_KEY);
        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: keyBytes
        });

        const res = await fetch('/guardar-suscripcion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription),
            credentials: 'same-origin'
        });

        if (res.ok) {
            texto.textContent = 'Notificaciones activadas. Recibirás avisos de nuevas tareas.';
            if (btn) btn.remove();
        } else {
            const data = await res.json().catch(() => ({}));
            texto.textContent = data.error || 'No se pudo activar. Vuelve a intentar.';
            if (btn) { btn.disabled = false; btn.textContent = 'Reintentar'; }
        }
    } catch (err) {
        console.error('Error al activar notificaciones:', err);
        const esPushService = err.name === 'AbortError' || (err.message && err.message.includes('push service'));
        if (esPushService) {
            texto.textContent = 'El navegador no pudo conectar con las notificaciones. Prueba en otro navegador compatible.';
        } else {
            texto.textContent = 'Error al activar. Entra por http://localhost:3000 o con HTTPS.';
        }
        if (btn) { btn.disabled = false; btn.textContent = 'Reintentar'; }
    }
}

async function guardarSuscripcionSiExiste() {
    try {
        const register = await ensureServiceWorkerRegistered();
        if (!register) return;
        const sub = await register.pushManager.getSubscription();
        if (sub) {
            await fetch('/guardar-suscripcion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sub),
                credentials: 'same-origin'
            });
        }
    } catch (e) { /* ignorar */ }
}

function initNotificaciones() {
    const banner = document.getElementById('notificacionesBanner');
    const texto = document.getElementById('notificacionesTexto');
    const btn = document.getElementById('btnActivarNotificaciones');

    if (!banner) return;

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        banner.style.display = 'none';
        return;
    }

    if (!PUBLIC_VAPID_KEY) {
        banner.style.display = 'none';
        return;
    }

    if (Notification.permission === 'granted') {
        banner.style.display = 'flex';
        texto.textContent = 'Notificaciones activadas.';
        if (btn) btn.remove();
        return;
    }

    if (Notification.permission === 'denied') {
        banner.style.display = 'flex';
        texto.textContent = 'Tienes las notificaciones bloqueadas. Actívalas en la configuración del sitio para recibir avisos.';
        if (btn) btn.remove();
        return;
    }

    banner.style.display = 'flex';
    if (btn) btn.addEventListener('click', () => activarNotificaciones());
}

document.addEventListener('DOMContentLoaded', () => {
    tablaAlumno();
    initNotificaciones();
});

