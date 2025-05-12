document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (id) {
        document.getElementById("id").value = id; // Pre-rellenar el campo de ID
    }

    const form = document.getElementById("eliminarReservacionForm");
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
    const confirmDeleteButton = document.getElementById("confirmDeleteButton");

    let reservacionId = null;

    // Manejar el envío del formulario
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Evita que el formulario recargue la página

        // Obtener el ID de la reservación
        reservacionId = document.getElementById("id").value;

        // Mostrar el modal de confirmación
        confirmDeleteModal.show();
    });

    // Confirmar la eliminación
    confirmDeleteButton.addEventListener("click", async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/reservaciones/${reservacionId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Error al eliminar la reservación");
            }

            alert("Reservación eliminada exitosamente");
            window.location.href = "/Frontend/reservaciones/tabla_reservaciones.html"; // Redirigir a la tabla
        } catch (error) {
            console.error("Error al eliminar la reservación:", error);
            alert("Hubo un problema al eliminar la reservación. Inténtalo de nuevo.");
        } finally {
            confirmDeleteModal.hide(); // Ocultar el modal
        }
    });
});