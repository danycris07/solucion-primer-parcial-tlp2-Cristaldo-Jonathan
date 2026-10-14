// * ARCHIVO A COMPLETAR
import { UserModel, ProfileModel } from "../models/index.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { signToken } from "../helpers/jwt.helper.js";
import { matchedData } from "express-validator";

export const register = async (req, res) => {
  try {
    const dataLimpia = matchedData(req);

    // TODO: 1. Hashear la password antes de guardarla (hashPassword).
    const hashedPassword = await hashPassword(dataLimpia.password);

    // TODO: 2. Crear el user y su profile asociado.
    const usuario = await UserModel.create({
      username: dataLimpia.username,
      email: dataLimpia.email,
      password: hashedPassword,
      role: dataLimpia.role,
    });

    await ProfileModel.create({
      user_id: usuario.id,
      employee_number: dataLimpia.employee_number,
      first_name: dataLimpia.first_name,
      last_name: dataLimpia.last_name,
      phone: dataLimpia.phone,
    });

    // TODO: 3. Responder con código 201, un mensaje de éxito y devolver el usuario sin la password.
    const usuarioRespuesta = usuario.toJSON();
    delete usuarioRespuesta.password;

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      data: usuarioRespuesta,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = matchedData(req);

    // TODO: 1. Buscar el user por email y comparar la password (comparePassword).
    // ? Considerar qué mensaje devolver ante credenciales inválidas.
    const userExist = await UserModel.findOne({ where: { email } });
    if (!userExist) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const validPassword = await comparePassword(password, userExist.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // TODO: 2. Firmar un JWT con el id y el role del user (signToken).
    const token = signToken({ id: userExist.id, role: userExist.role });

    // TODO: 3. Guardar el token en una cookie httpOnly llamada "token", responder con código 200 y un mensaje de éxito.
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });

    return res.status(200).json({ message: "Usuario logueado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const logout = async (_req, res) => {
  try {
    // TODO: 1. Eliminar la cookie "token" y responder con código 204 sin devolver ningun mensaje.
    res.clearCookie("token");
    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};
