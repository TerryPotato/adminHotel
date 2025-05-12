//Logica para el manejo de datos en front y pasarlos a la base de datos

// Lógica para enviar los datos del formulario a la base de datos
const form = document.getElementById("reservationForm");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Obtener los valores de los campos del formulario
    const data = {
        nombre: document.getElementById("nombre").value,
        apellidos: document.getElementById("apellidos").value,
        telefono: document.getElementById("telefono").value,
        correo: document.getElementById("correo").value,
        noHabitacion: document.getElementById("noHabitacion").value,
        diaEntrada: document.getElementById("fecha_entrada").value,
        diaSalida: document.getElementById("fecha_salida").value,
        horaEntrada: document.getElementById("hora_entrada").value,
        horaSalida: document.getElementById("hora_salida").value,
        facturacion: document.getElementById("facturacion").checked
    };

    //console.log("Datos enviados al backend:", data); // Depuración

    try {
        const response = await fetch('http://localhost:8000/api/reservaciones', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        console.log("Respuesta del servidor:", response);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error del servidor:", errorData);
            throw new Error(errorData.message || "Error al enviar la reservación");
        }

        const result = await response.json();
        console.log("Resultado:", result); // Depuración
        alert(result.mensaje || "Reservación creada exitosamente");
        form.reset();
    } catch (error) {
        console.error("Error:", error); // Depuración
        alert("Hubo un problema al crear la reservación. Inténtalo de nuevo.");
    }
});

//Obtener lista de habitaciones disponible y mandarlas al select
const selectHabitaciones = document.getElementById("noHabitacion");
const costoTotalInput = document.getElementById("costo_total");

const obtenerHabitacionesDisponibles = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/habitaciones/disponibles');
        if (!response.ok) {
            throw new Error("Error al obtener las habitaciones disponibles");
        }

        const habitaciones = await response.json();
        console.log("Habitaciones disponibles:", habitaciones); // Depuración

        // Limpiar el select antes de llenarlo
        selectHabitaciones.innerHTML = '<option value="" selected>Seleccione una habitación</option>';

        // Llenar el select con las habitaciones disponibles
        habitaciones.forEach(habitacion => {
            const option = document.createElement("option");
            option.value = habitacion.numero; // El número de la habitación
            option.dataset.precio = habitacion.precio; // Guardar el precio como atributo de datos
            option.textContent = `Habitación ${habitacion.numero}`;
            selectHabitaciones.appendChild(option);
        });
    } catch (error) {
        console.error("Error al obtener habitaciones disponibles:", error);
        alert("Hubo un problema al cargar las habitaciones disponibles. Inténtalo de nuevo.");
    }
};

// Actualizar el costo total al seleccionar una habitación
selectHabitaciones.addEventListener("change", () => {
    const selectedOption = selectHabitaciones.options[selectHabitaciones.selectedIndex];
    const precio = selectedOption.dataset.precio; // Obtener el precio del atributo de datos
    costoTotalInput.value = precio ? `$${precio}` : ''; // Mostrar el precio en el campo
});

// Llamar a la función para obtener las habitaciones disponibles al cargar la página
document.addEventListener("DOMContentLoaded", obtenerHabitacionesDisponibles);

const fechaEntrada = document.getElementById("fecha_entrada");
const fechaSalida = document.getElementById("fecha_salida");

// Actualizar la fecha de salida automáticamente al seleccionar la fecha de entrada
fechaEntrada.addEventListener("change", () => {
    const entrada = new Date(fechaEntrada.value);
    if (entrada) {
        // Sumar un día a la fecha de entrada
        const salida = new Date(entrada);
        salida.setDate(salida.getDate() + 1);

        // Formatear la fecha a YYYY-MM-DD
        const salidaFormateada = salida.toISOString().split("T")[0];
        fechaSalida.value = salidaFormateada;
    }
});


