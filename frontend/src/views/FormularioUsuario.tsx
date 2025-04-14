import { useState } from "react";

// Definimos la interfaz del usuario
interface Usuario {
  idUsuario?: number; // Opcional, porque al crear un nuevo usuario aún no tiene ID
  nombre: string;
  edad: number;
}
interface Telefono {
  tipoTelefono: string;
  lada: number;
  numTelefono: string;
  idUsuario?: number; // Asociado con el usuario
}


function FormularioUsuario() {
  // Estado para el nuevo usuario
  const [usuario, setUsuario] = useState<Usuario>({ nombre: "", edad: 0, });
  const [telefonos, setTelefonos] = useState<Telefono[]>([]);

  // Manejo de cambios en los inputs
  const handaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      [name]: name === "edad" ? parseInt(value, 10) : value, // Convertimos edad a número
    }));
  };

  const handleTelefonoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTelefonos((prevTelefonos) => {
      const updatedTelefonos = [...prevTelefonos];
      updatedTelefonos[index] = { ...updatedTelefonos[index], [name]: value };
      return updatedTelefonos;
    });
  };

  const agregarTelefono = () => {
    setTelefonos([...telefonos, { tipoTelefono: "", lada: 0, numTelefono: "", idUsuario: usuario.idUsuario }]);
  };


  const eliminarTelefono = (index: number) => {
    setTelefonos(telefonos.filter((_, i) => i !== index));
  };


  // Manejo de envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1️⃣ Crear usuario
      const usuarioResponse = await fetch("http://localhost:8080/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: usuario.nombre, edad: usuario.edad }),
      });

      if (!usuarioResponse.ok) throw new Error("Error al crear usuario");

      const usuarioCreado = await usuarioResponse.json();
      console.log("Usuario creado:", usuarioCreado);

      // 2️⃣ Verificar ID antes de enviar teléfonos
      if (!usuarioCreado.idUsuario) {
        throw new Error("El usuario no tiene ID asignado");
      }

      const telefonosConId = telefonos.map((telefono) => ({
        ...telefono,
        idUsuario: usuarioCreado.idUsuario,
      }));

      console.log("Teléfonos con ID asignado:", telefonosConId); // Verificar datos antes de enviarlos

      const telefonosResponse = await fetch("http://localhost:8080/telefonos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telefonosConId),
      });

      if (!telefonosResponse.ok) throw new Error("Error al guardar teléfonos");

      console.log("Teléfonos guardados:", await telefonosResponse.json());
      alert("Usuario y teléfonos agregados correctamente");

      setUsuario({ nombre: "", edad: 0 });
      setTelefonos([]);

    } catch (err: any) {
      console.error("Error en la operación:", err);
      alert(`Error: ${err.message}`);
    }
  };




  return (
    <div>
      <h2>Agregar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={usuario.nombre}
            onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Edad:</label>
          <input
            type="number"
            name="edad"
            value={usuario.edad}
            onChange={(e) => setUsuario({ ...usuario, edad: parseInt(e.target.value, 10) })}
            required
          />
        </div>

        {telefonos.map((telefono, index) => (
          <div key={index}>
            <label>Tipo Teléfono:</label>
            <input
              type="text"
              name="tipoTelefono"
              value={telefono.tipoTelefono}
              onChange={(e) => handleTelefonoChange(index, e)}
              required
            />

            <label>Lada:</label>
            <input
              type="number"
              name="lada"
              value={telefono.lada}
              onChange={(e) => handleTelefonoChange(index, e)}
              required
            />

            <label>Número de Teléfono:</label>
            <input
              type="text"
              name="numTelefono"
              value={telefono.numTelefono}
              onChange={(e) => handleTelefonoChange(index, e)}
              required
            />

            <button type="button" onClick={() => eliminarTelefono(index)}>
              Eliminar Teléfono
            </button>
          </div>
        ))}


        <button
          type="button"
          onClick={agregarTelefono}
          className="border-4"
        >Agregar Teléfono</button>
        <button
          type="submit"
          className="border-4"
        >Agregar Usuario</button>
      </form>

    </div>
  );
}

export default FormularioUsuario;
