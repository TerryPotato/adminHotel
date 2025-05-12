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

    // Manejar el envío del formulario del modal para editar la reservación
    modalForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita que el formulario recargue la página

        const reservacionEditada = {
            nombre: document.getElementById("modalNombre").value,
            apellidos: document.getElementById("modalApellidos").value,
            telefono: document.getElementById("modalTelefono").value,
            correo: document.getElementById("modalCorreo").value,
            noHabitacion: document.getElementById("modalNoHabitacion").value,
            diaEntrada: document.getElementById("modalFechaEntrada").value,
            diaSalida: document.getElementById("modalFechaSalida").value,
            horaEntrada: document.getElementById("modalHoraEntrada").value,
            horaSalida: document.getElementById("modalHoraSalida").value,
            costoTotal: document.getElementById("modalCostoTotal").value,
            facturacion: document.getElementById("modalFacturacion").checked
        };

        try {
            // Enviar los datos modificados al backend
            const response = await fetch(`http://localhost:8000/api/reservaciones/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reservacionEditada)
            });

            if (!response.ok) {
                throw new Error("No se pudo actualizar la reservación");
            }

            alert("Reservación actualizada correctamente");

            // Cerrar el modal
            modal.hide();
        } catch (error) {
            console.error("Error al actualizar la reservación:", error);
            alert("Hubo un problema al actualizar la reservación.");
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

            // Agregar un evento para actualizar el costo total cuando se seleccione una habitación
            selectHabitaciones.addEventListener("change", actualizarCostoTotal);
        } catch (error) {
            console.error("Error al cargar habitaciones disponibles:", error);
            alert("Hubo un problema al cargar las habitaciones disponibles.");
        }
    };

    // Función para actualizar el costo total cuando se selecciona una habitación
    const actualizarCostoTotal = () => {
        const selectHabitaciones = document.getElementById("modalNoHabitacion");
        const selectedOption = selectHabitaciones.options[selectHabitaciones.selectedIndex];
        const precio = parseFloat(selectedOption.dataset.precio); // Obtener el precio de la habitación seleccionada

        const fechaEntrada = new Date(document.getElementById("modalFechaEntrada").value);
        const fechaSalida = new Date(document.getElementById("modalFechaSalida").value);
        const noches = Math.ceil((fechaSalida - fechaEntrada) / (1000 * 60 * 60 * 24)); // Diferencia en días

        const costoTotal = precio * noches;
        document.getElementById("modalCostoTotal").value = costoTotal.toFixed(2); // Actualizar el costo total en el formulario
    };

    // Agregar eventos para recalcular el costo total cuando cambian las fechas
    document.getElementById("modalFechaEntrada").addEventListener("change", actualizarCostoTotal);
    document.getElementById("modalFechaSalida").addEventListener("change", actualizarCostoTotal);
});
