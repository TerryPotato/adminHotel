document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("eliminarHabitaciónForm");
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
    const confirmDeleteButton = document.getElementById("confirmDeleteButton");

    let numeroHabitacion = null;

    // Manejar el envío del formulario
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Evita que el formulario recargue la página

        // Obtener el número de la habitación
        numeroHabitacion = document.getElementById("nombre").value;

        // Mostrar el modal de confirmación
        confirmDeleteModal.show();
    });

    // Confirmar la eliminación
    confirmDeleteButton.addEventListener("click", async () => {
        try {
            const response = await fetch('http://localhost:8000/api/habitaciones', {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ numero: numeroHabitacion })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error del servidor:", errorData);
                throw new Error(errorData.message || "Error al eliminar la habitación");
            }

            const result = await response.json();
            console.log("Resultado:", result); // Depuración
            alert(result.mensaje || "Habitación eliminada exitosamente");
            form.reset(); // Limpiar el formulario después de eliminar
        } catch (error) {
            console.error("Error:", error); // Depuración
            alert("Hubo un problema al eliminar la habitación. Inténtalo de nuevo.");
        } finally {
            confirmDeleteModal.hide(); // Ocultar el modal
        }
    });
});