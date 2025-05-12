//Logica para agregar una nueva habitación
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("nuevaHabitaciónForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita que el formulario recargue la página

        // Obtener los valores de los campos del formulario
        const data = {
            numero: document.getElementById("nombre").value,
            tipo: document.getElementById("apellidos").value,
            precio: document.getElementById("precio").value
        };

        console.log("Datos enviados al backend:", data); // Depuración

        try {
            // Enviar los datos al backend
            const response = await fetch('http://localhost:8000/api/habitaciones', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error del servidor:", errorData);
                throw new Error(errorData.message || "Error al agregar la habitación");
            }

            const result = await response.json();
            console.log("Resultado:", result); // Depuración
            alert(result.mensaje || "Habitación agregada exitosamente");
            form.reset(); // Limpiar el formulario después de enviarlo
        } catch (error) {
            console.error("Error:", error); // Depuración
            alert("Hubo un problema al agregar la habitación. Inténtalo de nuevo.");
        }
    });
});