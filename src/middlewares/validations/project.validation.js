// * ARCHIVO A COMPLETAR
import { body, param } from "express-validator";
import { Op } from "sequelize";
import {
  ProjectModel,
  TechnologyModel,
  UserModel,
} from "../../models/index.js";

export const createProjectValidation = [
  // TODO: 1. Validar code: obligatorio y único (ProjectModel).
  body("code")
    .notEmpty()
    .custom(async (code) => {
      const project = await ProjectModel.findOne({ where: { code } });
      if (project) throw new Error("El código del proyecto ya existe");
      return true;
    }),

  // TODO: 2. Validar name y description como obligatorios.
  body("name").trim().notEmpty(),
  body("description").trim().notEmpty(),

  // TODO: 3. Validar status: opcional y limitado a los estados permitidos.
  body("status")
    .optional()
    .isIn(["planning", "in_progress", "paused", "finished"]),

  // TODO: 4. Validar start_date como fecha válida y budget como número positivo, ambos obligatorios.
  body("start_date").isDate().notEmpty(),
  body("budget")
    .isNumeric()
    .custom((v) => v > 0),

  // TODO: 5. Validar leader_id: debe existir y pertenecer a un usuario activo (UserModel).
  // ? Un usuario eliminado lógicamente no puede ser líder: comprobar que la búsqueda lo deje afuera.
  body("leader_id").custom(async (leader_id) => {
    const usuario = await UserModel.findByPk(leader_id);
    if (!usuario) throw new Error("El usuario líder no existe o fue eliminado");
    return true;
  }),

  // TODO: 6. Validar technologies: lista de ids que existan (TechnologyModel).
  body("technologies")
    .optional()
    .isArray()
    .custom(async (techIds) => {
      if (techIds.length === 0) return true;
      const count = await TechnologyModel.count({ where: { id: techIds } });
      if (count !== techIds.length)
        throw new Error("Una o más tecnologías no existen");
      return true;
    }),
];

export const updateProjectValidation = [
  // ? Para saber qué proyecto se edita, el id se obtiene de los parámetros de la ruta (req.params).
  param("id")
    .isInt()
    .custom(async (id) => {
      const proyecto = await ProjectModel.findByPk(id);
      if (!proyecto) throw new Error("El proyecto no existe");
      return true;
    }),

  // TODO: 7. Validar code como opcional y único, excluyendo el propio proyecto que se edita.
  body("code")
    .optional()
    .custom(async (code, { req }) => {
      const project = await ProjectModel.findOne({
        where: { code, id: { [Op.ne]: req.params.id } },
      });
      if (project) throw new Error("El código ya lo usa otro proyecto");
      return true;
    }),

  // TODO: 8. Validar name y description como opcionales y no vacíos.
  body("name").trim().optional().notEmpty(),
  body("description").trim().optional().notEmpty(),

  // TODO: 9. Validar status, start_date y budget como opcionales, con las mismas reglas que al crear.
  body("status")
    .optional()
    .isIn(["planning", "in_progress", "paused", "finished"]),
  body("start_date").optional().isDate(),
  body("budget")
    .optional()
    .isNumeric()
    .custom((v) => v > 0),

  // TODO: 10. Validar leader_id como opcional, existente y de un usuario activo.
  body("leader_id")
    .optional()
    .custom(async (id) => {
      const usuario = await UserModel.findByPk(id);
      if (!usuario) throw new Error("El usuario no existe o fue eliminado");
      return true;
    }),

  // TODO: 11. Validar technologies como opcional, con ids que existan.
  body("technologies")
    .optional()
    .isArray()
    .custom(async (techIds) => {
      if (techIds.length === 0) return true;
      const count = await TechnologyModel.count({ where: { id: techIds } });
      if (count !== techIds.length)
        throw new Error("Una o más tecnologías no existen");
      return true;
    }),
];
