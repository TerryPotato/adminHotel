document.addEventListener("DOMContentLoaded", () => {
    const selectHabitaciones = document.getElementById("noHabitacion");

    // Función para cargar habitaciones ocupadas
    const cargarHabitacionesOcupadas = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/habitaciones/ocupadas");
            if (!response.ok) {
                throw new Error("Error al obtener las habitaciones ocupadas");
            }

            const habitaciones = await response.json();

            // Limpiar el select antes de llenarlo
            const selectHabitaciones = document.getElementById("noHabitacion");
            selectHabitaciones.innerHTML = '<option value="" selected>Seleccione una habitación</option>';

            // Llenar el select con las habitaciones ocupadas
            habitaciones.forEach(habitacion => {
                const option = document.createElement("option");
                option.value = habitacion.numero;
                option.textContent = `Habitación ${habitacion.numero}`;
                selectHabitaciones.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar habitaciones ocupadas:", error);
            alert("Hubo un problema al cargar las habitaciones ocupadas.");
        }
    };

    // Llamar a la función para cargar habitaciones ocupadas al cargar la página
    cargarHabitacionesOcupadas();

    // Manejar el envío del formulario para hacer check-out
    const form = document.getElementById("checkoutHabitaciónForm");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const numeroHabitacion = selectHabitaciones.value;

        if (!numeroHabitacion) {
            alert("Por favor, seleccione una habitación.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/habitaciones/${numeroHabitacion}/checkout`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Error al realizar el check-out");
            }

            const result = await response.json();
            alert(result.mensaje || "Check-out realizado exitosamente");

            // Recargar las habitaciones ocupadas
            cargarHabitacionesOcupadas();
        } catch (error) {
            console.error("Error al realizar el check-out:", error);
            alert("Hubo un problema al realizar el check-out. Inténtalo de nuevo.");
        }
    });
});