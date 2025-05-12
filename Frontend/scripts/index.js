//Logica para el manejo de datos en front y pasarlos a la base de datos

// Lógica para enviar los datos del formulario a la base de datos
const form = document.getElementById("reservationForm");
const selectHabitaciones = document.getElementById("noHabitacion");
const costoTotalInput = document.getElementById("costo_total");
const fechaEntrada = document.getElementById("fecha_entrada");
const fechaSalida = document.getElementById("fecha_salida");

// Función para obtener las habitaciones disponibles y llenar el select
const obtenerHabitacionesDisponibles = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/habitaciones/disponibles');
        if (!response.ok) {
            throw new Error("Error al obtener las habitaciones disponibles");
        }

        const habitaciones = await response.json();

        // Limpiar las opciones previas (excepto la primera)
        selectHabitaciones.innerHTML = '<option value="" selected>Seleccione una habitación</option>';

        habitaciones.forEach(habitacion => {
            const option = document.createElement('option');
            option.value = habitacion.numero; // Número de la habitación
            option.dataset.precio = habitacion.precio; // Guardar el precio como atributo de datos
            option.textContent = `Habitación ${habitacion.numero}`;
            selectHabitaciones.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar habitaciones:", error);
        alert("No se pudieron cargar las habitaciones disponibles.");
    }
};

// Función para calcular el costo total dinámicamente
const calcularCostoTotal = () => {
    const selectedOption = selectHabitaciones.options[selectHabitaciones.selectedIndex];
    const precio = parseFloat(selectedOption?.dataset.precio); // Obtener el precio del atributo de datos
    const entrada = new Date(fechaEntrada.value);
    const salida = new Date(fechaSalida.value);

    if (precio && entrada && salida && salida > entrada) {
        const noches = Math.ceil((salida - entrada) / (1000 * 60 * 60 * 24)); // Diferencia en días
        const costoTotal = noches * precio;
        costoTotalInput.value = `$${costoTotal.toFixed(2)}`; // Mostrar el costo total en el campo
    } else {
        costoTotalInput.value = ''; // Limpiar el campo si no se puede calcular
    }
};

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
    calcularCostoTotal(); // Recalcular el costo total
});

// Escuchar cambios en el select de habitaciones y fechas para recalcular el costo total
selectHabitaciones.addEventListener("change", calcularCostoTotal);
fechaEntrada.addEventListener("change", calcularCostoTotal);
fechaSalida.addEventListener("change", calcularCostoTotal);

// Enviar los datos del formulario al backend
// Enviar los datos del formulario al backend
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const entrada = new Date(fechaEntrada.value);
    const salida = new Date(fechaSalida.value);
    if (salida <= entrada) {
        alert("La fecha de salida debe ser posterior a la de entrada.");
        return;
    }

    // Obtener los valores de los campos del formulario
    const data = {
        nombre: document.getElementById("nombre").value,
        apellidos: document.getElementById("apellidos").value,
        telefono: document.getElementById("telefono").value,
        correo: document.getElementById("correo").value,
        noHabitacion: selectHabitaciones.value,
        diaEntrada: fechaEntrada.value,
        diaSalida: fechaSalida.value,
        horaEntrada: document.getElementById("hora_entrada").value,
        horaSalida: document.getElementById("hora_salida").value,
        facturacion: document.getElementById("facturacion").checked
    };

    try {
        const response = await fetch('http://localhost:8000/api/reservaciones', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error del servidor:", errorData);
            throw new Error(errorData.message || "Error al enviar la reservación");
        }

        const result = await response.json();
        alert(result.mensaje || "Reservación creada exitosamente");
        form.reset();
        costoTotalInput.value = ''; // Limpiar el costo total

        // Actualizar la lista de habitaciones disponibles después de hacer una nueva reservación
        obtenerHabitacionesDisponibles();

    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al crear la reservación. Inténtalo de nuevo.");
    }
});


// Llamar a la función para obtener las habitaciones disponibles al cargar la página
document.addEventListener("DOMContentLoaded", obtenerHabitacionesDisponibles);


