import { registrar } from "../../services/UsuarioLinkedServices";
import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/editarUsuario.css';
import NotiToast from "../../components/NotiToast";

export const RegistroPage = () => {
  const [Nombre, setNombre] = useState('');
  const [Usuario, setUsuario] = useState('');
  const [Password, setPassword] = useState('');
  const [datosBack, setDatosBack] = useState(null);
  const [errores, setErrores] = useState({
    nombre: [],
    usuario: [],
    password: []
  });
  const [verclave, setVerClave] = useState(false);
  const token = sessionStorage.getItem('Token');

  const navigate = useNavigate();
  useEffect (() => {
    if(token){
      navigate("/login");
    }
  }, [token,navigate]);

  const validarNombre = (nombre) => {
    const errores = [];
    if (nombre.trim().length === 0) {
      errores.push("El nombre no puede estar vacío.");
    } else if (nombre.length > 30) {
      errores.push("El nombre no puede tener más de 30 caracteres.");
    }
    return errores;
  };

  const validarUsuario = (usuario) => {
    const errores = [];
    if (usuario.length < 6 || usuario.length > 20) {
      errores.push("El usuario debe tener entre 6 y 20 caracteres.");
    }
    if (!/^[a-zA-Z0-9]+$/.test(usuario)) {
      errores.push("El usuario debe contener solo caracteres alfanuméricos.");
    }
    return errores;
  };

  const validarPassword = (password) => {
    const errores = [];
    if (password.length < 8) {
      errores.push("La contraseña debe tener al menos 8 caracteres.");
    }
    if (!/[A-Z]/.test(password)) {
      errores.push("Debe tener al menos una mayúscula.");
    }
    if (!/[a-z]/.test(password)) {
      errores.push("Debe tener al menos una minúscula.");
    }
    if (!/[0-9]/.test(password)) {
      errores.push("Debe tener al menos un número.");
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errores.push("Debe tener al menos un caracter especial.");
    }
    return errores;
  };

  const handleChangeNombre = (e) => {
    const valor = e.target.value;
    setNombre(valor);
    setErrores(prev => ({ ...prev, nombre: validarNombre(valor) }));
  };

  const handleChangeUsuario = (e) => {
    const valor = e.target.value;
    setUsuario(valor);
    setErrores(prev => ({ ...prev, usuario: validarUsuario(valor) }));
  };

  const handleChangePassword = (e) => {
    const valor = e.target.value;
    setPassword(valor);
    setErrores(prev => ({ ...prev, password: validarPassword(valor) }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {
      nombre: validarNombre(Nombre),
      usuario: validarUsuario(Usuario),
      password: validarPassword(Password)
    };
    setErrores(nuevosErrores);
    return (
      nuevosErrores.nombre.length === 0 &&
      nuevosErrores.usuario.length === 0 &&
      nuevosErrores.password.length === 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const nuevosDatos = { usuario: Usuario, nombre: Nombre, password: Password };
    
    try {
      const response = await registrar(nuevosDatos);
      setDatosBack(response.data);
      if(response.status){
        setNombre("");
        setUsuario("");
        setPassword("");
      }
      setTimeout(() => setDatosBack(null), 3000); 
    } catch (err) {
      if (err.response && err.response.data) {
        setDatosBack(err.response.data);
      } else {
        setDatosBack({ error: 'Error desconocido' });
      }
      setTimeout(() => setDatosBack(null), 3000); 
    }
  };

  return (
    <div className="totalForms">
      <form onSubmit={handleSubmit} className="forma">
        <div className="barra">
          <p>Nombre: </p>
          <input type="text" value={Nombre} onChange={handleChangeNombre} maxLength={30} required />
          <div className="msj-condiciones">
            {errores.nombre.map((e, index) => (
              <p key={index} className="mensaje-error">{e}</p>
            ))}
          </div>
        </div>

        <div className="barra">
          <p>Usuario:</p>
          <input type="text" value={Usuario} onChange={handleChangeUsuario} maxLength={20} required />
          <div className="msj-condiciones">
            {errores.usuario.map((e, index) => (
              <p key={index} className="mensaje-error">{e}</p>
            ))}
          </div>
        </div>

        <div className="barraBoton">
          <div className="barra">
            <p>Password:</p>
            <input type={verclave? "text":"password"} value={Password} onChange={handleChangePassword} required />
            <button type= "button" onClick={()=>setVerClave(!verclave)}>👀</button>
            <div className="msj-condiciones">
              {errores.password.map((e, index) => (
                <p key={index} className="mensaje-error">{e}</p>
              ))}
            </div>
          </div>
          <button type="submit" className="botonEnviarForm">Registrar</button>
        </div>
      </form>      
      {datosBack?.status &&         
        <NotiToast mensaje= {datosBack.status} tipo="exito"/>                   
      }              
      {datosBack?.error && 
        <NotiToast mensaje={datosBack.error}tipo="error"/>
      }      
    </div>
  );
};
