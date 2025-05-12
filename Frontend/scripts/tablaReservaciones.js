document.addEventListener("DOMContentLoaded", async () => {
    const tabla = document.getElementById("reservaciones");

    try {
        // Obtener las reservaciones desde el backend
        const response = await fetch('http://localhost:8000/api/reservaciones');
        if (!response.ok) {
            throw new Error("Error al obtener las reservaciones");
        }

        const data = await response.json();
        const reservaciones = data.reservaciones;

        // Llenar la tabla con las reservaciones
        const tbody = document.createElement("tbody");
        reservaciones.forEach((reservacion) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${reservacion._id}</td>
                <td>${reservacion.nombre}</td>
                <td>${reservacion.apellidos}</td>
                <td>${reservacion.telefono}</td>
                <td>${reservacion.correo || "N/A"}</td>
                <td>${reservacion.noHabitacion}</td>
                <td>${reservacion.diaEntrada}</td>
                <td>${reservacion.diaSalida}</td>
                <td>${reservacion.horaEntrada}</td>
                <td>${reservacion.horaSalida}</td>
                <td>${reservacion.costoTotal || "N/A"}</td>
                <td>${reservacion.facturacion ? "Sí" : "No"}</td>
                <td>
                    <button class="btn btn-warning btn-sm editar" data-id="${reservacion._id}">Editar</button>
                    <button class="btn btn-danger btn-sm eliminar" data-id="${reservacion._id}">Eliminar</button>
                </td>
            `;

            tbody.appendChild(row);
        });

        tabla.appendChild(tbody);

        // Agregar eventos a los botones de editar
        document.querySelectorAll(".editar").forEach((button) => {
            button.addEventListener("click", (event) => {
                const id = event.target.getAttribute("data-id");
                window.location.href = `/Frontend/reservaciones/reservaciones_editar.html?id=${id}`;
            });
        });

        // Agregar eventos a los botones de eliminar
        document.querySelectorAll(".eliminar").forEach((button) => {
            button.addEventListener("click", (event) => {
                const id = event.target.getAttribute("data-id");
                window.location.href = `/Frontend/reservaciones/reservaciones_eliminar.html?id=${id}`;
            });
        });
    } catch (error) {
        console.error("Error al cargar las reservaciones:", error);
        alert("Hubo un problema al cargar las reservaciones. Inténtalo de nuevo.");
    }
});