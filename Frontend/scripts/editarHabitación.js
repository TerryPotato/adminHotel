document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("editarHabitaciónForm");
    const modalForm = document.getElementById("editarHabitaciónModalForm");
    const modal = new bootstrap.Modal(document.getElementById("editarHabitaciónModal"));

    // Manejar el envío del formulario principal
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita que el formulario recargue la página

        const numero = document.getElementById("numero").value;

        try {
            // Obtener los datos actuales de la habitación desde el backend
            const response = await fetch(`http://localhost:8000/api/habitaciones/${numero}`);
            if (!response.ok) {
                throw new Error("No se pudo obtener la información de la habitación");
            }

            const habitacion = await response.json();

            // Llenar el formulario del modal con los datos actuales
            document.getElementById("modalNumero").value = habitacion.numero;
            document.getElementById("modalTipo").value = habitacion.tipo;
            document.getElementById("modalPrecio").value = habitacion.precio;

            // Mostrar el modal
            modal.show();
        } catch (error) {
            console.error("Error al obtener la habitación:", error);
            alert("Hubo un problema al obtener la información de la habitación.");
        }
    });

    // Manejar el envío del formulario del modal
    modalForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita que el formulario recargue la página

        // Obtener los valores del formulario del modal
        const data = {
            numero: document.getElementById("modalNumero").value,
            tipo: document.getElementById("modalTipo").value,
            precio: document.getElementById("modalPrecio").value
        };

        try {
            // Enviar los datos actualizados al backend
            const response = await fetch('http://localhost:8000/api/habitaciones', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al editar la habitación");
            }

            const result = await response.json();
            console.log("Resultado:", result); // Depuración
            alert(result.mensaje || "Habitación actualizada exitosamente");
            modal.hide(); // Ocultar el modal
        } catch (error) {
            console.error("Error al editar la habitación:", error);
            alert("Hubo un problema al editar la habitación. Inténtalo de nuevo.");
        }
    });
});