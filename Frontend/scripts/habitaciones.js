// Función para obtener las habitaciones disponibles y llenar el select
const obtenerHabitacionesDisponibles = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/habitaciones');
        if (!response.ok) {
            throw new Error("Error al obtener las habitaciones disponibles");
        }

        const data = await response.json();  // Aquí cambiamos el nombre de la respuesta a 'data'
        const habitaciones = data.habitaciones;  // Accedemos a la propiedad 'habitaciones' del objeto

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

// Función para mostrar habitaciones disponibles en cards
const mostrarHabitacionesDisponibles = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/habitaciones');
        if (!response.ok) {
            throw new Error("Error al obtener las habitaciones disponibles");
        }

        const data = await response.json();
        const habitaciones = data.habitaciones;

        const contenedorHabitaciones = document.getElementById("habitacionesContenedor"); // Contenedor donde se mostrarán las cards

        // Limpiar el contenedor antes de agregar nuevas cards
        contenedorHabitaciones.innerHTML = '';

        habitaciones.forEach(habitacion => {
            // Crear card para cada habitación
            const card = document.createElement('div');
            card.classList.add('card');
            card.classList.add('habitacion-card');

            // Agregar la clase 'disponible' o 'ocupada' según la disponibilidad
            card.classList.add(habitacion.disponibilidad ? 'disponible' : 'ocupada');

            // Crear el contenido de la card
            card.innerHTML = `
                <h3>Habitación ${habitacion.numero}</h3>
                <p>Tipo: ${habitacion.tipo}</p>
                <p>Precio: $${habitacion.precio}</p>
                <p>${habitacion.disponibilidad ? 'Disponible' : 'Ocupada'}</p>
            `;

            // Añadir la card al contenedor
            contenedorHabitaciones.appendChild(card);
        });
    } catch (error) {
        console.error("Error al cargar habitaciones:", error);
        alert("No se pudieron cargar las habitaciones disponibles.");
    }
};

// Llamar a la función para mostrar las habitaciones cuando se carga la página
document.addEventListener("DOMContentLoaded", mostrarHabitacionesDisponibles);
