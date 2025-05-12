document.addEventListener("DOMContentLoaded", () => {
    // Obtener el parámetro 'id' de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (id) {
        // Pre-rellenar el campo de ID
        const idField = document.getElementById("id");
        if (idField) {
            idField.value = id; // Asigna el valor del ID al campo
            console.log(`ID asignado al campo: ${id}`); // Depuración
        } else {
            console.error("El campo de ID no existe en el formulario.");
        }
    } else {
        console.error("No se encontró el parámetro 'id' en la URL.");
    }

    const form = document.getElementById("editarReservacionForm");
    const modalForm = document.getElementById("editarReservacionModalForm");
    const modal = new bootstrap.Modal(document.getElementById("editarReservacionModal"));

    // Manejar el envío del formulario principal
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita que el formulario recargue la página

        try {
            // Obtener los datos de la reservación desde el backend
            const response = await fetch(`http://localhost:8000/api/reservaciones/${id}`);
            if (!response.ok) {
                throw new Error("No se pudo obtener la información de la reservación");
            }

            const reservacion = await response.json();

            // Llenar el formulario del modal con los datos actuales
            document.getElementById("modalNombre").value = reservacion.nombre;
            document.getElementById("modalApellidos").value = reservacion.apellidos;
            document.getElementById("modalTelefono").value = reservacion.telefono;
            document.getElementById("modalCorreo").value = reservacion.correo || "";
            document.getElementById("modalNoHabitacion").value = reservacion.noHabitacion;
            document.getElementById("modalFechaEntrada").value = reservacion.diaEntrada;
            document.getElementById("modalFechaSalida").value = reservacion.diaSalida;
            document.getElementById("modalHoraEntrada").value = reservacion.horaEntrada;
            document.getElementById("modalHoraSalida").value = reservacion.horaSalida;
            document.getElementById("modalCostoTotal").value = reservacion.costoTotal || "";
            document.getElementById("modalFacturacion").checked = reservacion.facturacion;

            // Cargar habitaciones disponibles
            await cargarHabitacionesDisponibles();

            // Mostrar el modal
            modal.show();
        } catch (error) {
            console.error("Error al obtener la reservación:", error);
            alert("Hubo un problema al obtener la información de la reservación.");
        }
    });

    // Función para cargar habitaciones disponibles
    const cargarHabitacionesDisponibles = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/habitaciones/disponibles");
            if (!response.ok) {
                throw new Error("Error al obtener las habitaciones disponibles");
            }

            const habitaciones = await response.json();
            const selectHabitaciones = document.getElementById("modalNoHabitacion");

            // Limpiar opciones existentes
            selectHabitaciones.innerHTML = '<option value="" selected>Seleccione una habitación</option>';

            // Llenar el select con las habitaciones disponibles
            habitaciones.forEach(habitacion => {
                const option = document.createElement("option");
                option.value = habitacion.numero;
                option.dataset.precio = habitacion.precio; // Guardar el precio como atributo de datos
                option.textContent = `Habitación ${habitacion.numero}`;
                selectHabitaciones.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar habitaciones disponibles:", error);
            alert("Hubo un problema al cargar las habitaciones disponibles.");
        }
    };
});