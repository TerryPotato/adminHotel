document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const tooltip = document.getElementById('tooltip'); // Referencia al tooltip

    const calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        },
        initialView: 'dayGridMonth',
        navLinks: true,
        editable: false,
        events: async function (fetchInfo, successCallback, failureCallback) {
            try {
                const response = await fetch('http://localhost:8000/api/reservaciones');
                if (!response.ok) {
                    throw new Error('Error al obtener las reservaciones');
                }

                const data = await response.json();
                console.log("Reservaciones API Response:", data); // Verifica la respuesta de la API en la consola

                const events = data.reservaciones.map(reservacion => ({
                    id: reservacion._id,
                    title: `${reservacion.nombre} ${reservacion.apellidos}`,
                    start: reservacion.diaEntrada,
                    end: reservacion.diaSalida,
                    horaEntrada: reservacion.horaEntrada,  // Asegúrate de que estos campos estén presentes
                    horaSalida: reservacion.horaSalida,
                    noHabitacion: reservacion.noHabitacion,
                    correo: reservacion.correo,
                    costoTotal: reservacion.costoTotal,
                    facturacion: reservacion.facturacion
                }));

                successCallback(events);
            } catch (error) {
                console.error('Error al cargar las reservaciones:', error);
                failureCallback(error);
            }
        },
        eventClick: function(info) {
            const event = info.event;
            const modalTitle = document.getElementById('modalTitle');
            const modalBody = document.getElementById('modalBody');
            
            // Asegurarnos de que los campos se extraen correctamente
            console.log("Evento clickeado:", event);

            // Llenar los campos del modal con los datos del evento
            modalTitle.innerText = event.title;
            modalBody.innerHTML = `
                <p><strong>Fecha de Entrada:</strong> ${event.start.toISOString().split('T')[0]}</p>
                <p><strong>Fecha de Salida:</strong> ${event.end.toISOString().split('T')[0]}</p>
                <p><strong>Hora de Entrada:</strong> ${event.extendedProps.horaEntrada || 'No disponible'}</p>
                <p><strong>Hora de Salida:</strong> ${event.extendedProps.horaSalida || 'No disponible'}</p>
                <p><strong>Número de Habitación:</strong> ${event.extendedProps.noHabitacion || 'No disponible'}</p>
                <p><strong>Email:</strong> ${event.extendedProps.correo || 'No disponible'}</p>
                <p><strong>Costo Total:</strong> $${event.extendedProps.costoTotal || 'No disponible'}</p>
                <p><strong>Facturación:</strong> ${event.extendedProps.facturacion ? 'Sí' : 'No'}</p>
            `;

            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById('eventModal'));
            modal.show();
        }
    });

    calendar.render();
});
