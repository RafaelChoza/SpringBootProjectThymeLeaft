import { HashRouter, Routes, Route } from "react-router-dom";
import Principal from "./views/Principal";
import ListaUsuarios from "./views/ListaUsuarios";
import FormularioUsuario from "./views/FormularioUsuario";



export default function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/usuarios" element={<ListaUsuarios />}/>
        <Route path="/crear-usuario" element={<FormularioUsuario />} />
      </Routes>
    </HashRouter>
  );
}
