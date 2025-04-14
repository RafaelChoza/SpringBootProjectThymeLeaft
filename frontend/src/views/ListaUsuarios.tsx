import { useEffect, useState } from "react";

// Definimos la interfaz del usuario
interface Usuario {
  idUsuario: number;
  nombre: string;
  edad: number;
}

interface Telefono {
  tipoTelefono: string; // Opcional, porque al crear un nuevo usuario aún no tiene ID
  lada: string;
  numTelefono: string;
}

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [telefonos, setTelefonos] = useState<Telefono[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/usuarios")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsuarios(data.responseEntity.body);
        }
      })
      .catch((err) => console.error("Error al obtener usuarios:", err));
  }, []);

  // Función para actualizar usuario en el backend
  const actualizarUsuario = (usuarioActualizado: Usuario) => {
    fetch(`http://localhost:8080/usuarios/${usuarioActualizado.idUsuario}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuarioActualizado),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Usuario actualizado correctamente");
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((usuario) =>
            usuario.idUsuario === usuarioActualizado.idUsuario ? usuarioActualizado : usuario
          )
        );
        setUsuarioEditando(null);
      })
      .catch((err) => console.error("Error al actualizar usuario:", err));
  };

  const eliminarUsuario = (usuarioEliminado: Usuario) => {
    fetch(`http://localhost:8080/usuarios/${usuarioEliminado.idUsuario}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al eliminar usuario");
        }
        return res.json();
      })
      .then(() => {
        alert("Usuario eliminado correctamente");
        setUsuarios((prevUsuarios) =>
          prevUsuarios.filter((usuario) => usuario.idUsuario !== usuarioEliminado.idUsuario)
        );
        setUsuarioEditando(null);
      })
      .catch((err) => console.error("Error al eliminar usuario:", err));
  };
  

  useEffect(() => {
    fetch("http://localhost:8080/telefonos")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsuarios(data.responseEntity.body);
        }
      })
      .catch((err) => console.error("Error al obtener los telefonos:", err));
  }, []);
  

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.idUsuario}>
            {usuario.nombre} - {usuario.edad} años
            <button 
              onClick={() => setUsuarioEditando(usuario)}
              className="border-2 m-5 p-2 rounded-2xl"
            >Editar</button>
            <button 
              onClick={() => eliminarUsuario(usuario)}
              className="border-2 m-5 p-2 rounded-2xl"
            >Eliminar</button>
          </li>
        ))}
      </ul>

      {usuarioEditando && (
        <div>
          <h3>Editar Usuario</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              actualizarUsuario(usuarioEditando);
            }}
          >
            <input
              type="text"
              value={usuarioEditando.nombre}
              onChange={(e) =>
                setUsuarioEditando({ ...usuarioEditando, nombre: e.target.value })
              }
              required
            />
            <input
              type="number"
              value={usuarioEditando.edad}
              onChange={(e) =>
                setUsuarioEditando({ ...usuarioEditando, edad: parseInt(e.target.value, 10) })
              }
              required
            />
            <button type="submit">Guardar Cambios</button>
            <button onClick={() => setUsuarioEditando(null)}>Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ListaUsuarios;
