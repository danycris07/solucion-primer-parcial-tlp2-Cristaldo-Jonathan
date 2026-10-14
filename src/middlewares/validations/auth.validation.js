// * ARCHIVO A COMPLETAR
import { body } from "express-validator";
import { UserModel, ProfileModel } from "../../models/index.js";

export const registerValidation = [
  // TODO: 1. Validar username: obligatorio, entre 3 y 20 caracteres y único (UserModel).
  body("username")
    .trim()
    .notEmpty()
    .withMessage("El username es obligatorio")
    .isLength({ min: 3, max: 20 })
    .withMessage("El username debe tener entre 3 y 20 caracteres")
    .custom(async (username) => {
      const usuario = await UserModel.findOne({ where: { username } });
      if (usuario) throw new Error("El username ya existe");
      return true;
    }),

  // TODO: 2. Validar email: obligatorio, con formato válido y único.
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no tiene un formato válido")
    .isLength({ max: 100 })
    .withMessage("El email no puede superar los 100 caracteres")
    .custom(async (email) => {
      const usuario = await UserModel.findOne({ where: { email } });
      if (usuario) throw new Error("El email ya existe");
      return true;
    }),

  // TODO: 3. Validar password: obligatoria, con mínimo de 8 caracteres.
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener mínimo 8 caracteres"),

  // TODO: 4. Validar role: opcional y limitado a los roles permitidos.
  body("role").optional().isIn(["developer", "administrator"]),

  // TODO: 5. Validar profile.employee_number: obligatorio y único (ProfileModel).
  body("employee_number")
    .notEmpty()
    .withMessage("El numero de empleado es obligatorio")
    .custom(async (employee_number) => {
      const profile = await ProfileModel.findOne({
        where: { employee_number },
      });
      if (profile) throw new Error("El numero ya existe");
      return true;
    }),

  // TODO: 6. Validar profile.first_name y profile.last_name como obligatorios, y profile.phone como opcional.
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),

  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres"),

  body("phone").optional().isString(),
];

export const loginValidation = [
  // TODO: 7. Validar email: obligatorio y con formato válido.
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Ingrese un email valido"),

  // TODO: 8. Validar password: obligatoria.
  body("password").trim().notEmpty(),
];
