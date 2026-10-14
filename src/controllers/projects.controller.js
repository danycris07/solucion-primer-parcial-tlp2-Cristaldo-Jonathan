// * ARCHIVO A COMPLETAR
import { matchedData } from "express-validator";
import { ProjectModel, TechnologyModel, UserModel } from "../models/index.js";

export const createProject = async (req, res) => {
  try {
    // TODO: 1. Crear el project con los datos del body que ya pasaron la validación.
    const dataLimpia = matchedData(req);

    // ? Revisar de dónde debe salir el leader del proyecto.
    const project = await ProjectModel.create(dataLimpia);

    // TODO: 2. Asociar al project las technologies recibidas.
    if (dataLimpia.technologies && dataLimpia.technologies.length > 0) {
      await project.setTechnologies(dataLimpia.technologies);
    }

    // TODO: 3. Responder con código 201 y el project con sus technologies y su leader.
    const projectCreated = await ProjectModel.findByPk(project.id, {
      include: [
        {
          model: UserModel,
          as: "leader",
          attributes: { exclude: ["password"] },
        },
        { model: TechnologyModel, as: "technologies" },
      ],
    });

    return res.status(201).json({ data: projectCreated });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getAllProjects = async (_req, res) => {
  try {
    // TODO: 1. Listar todos los projects incluyendo su leader (sin la password) y sus technologies, y responder con código 200 y los projects..
    const projects = await ProjectModel.findAll({
      include: [
        {
          model: UserModel,
          as: "leader",
          attributes: { exclude: ["password"] },
        },
        { model: TechnologyModel, as: "technologies" },
      ],
    });
    return res.status(200).json({ data: projects });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    // TODO: 1. Listar los projects cuyo leader sea el usuario logueado, incluyendo sus technologies, y responder con código 200 y los projects.
    const projects = await ProjectModel.findAll({
      where: { leader_id: req.user.id },
      include: [
        {
          model: UserModel,
          as: "leader",
          attributes: { exclude: ["password"] },
        },
        { model: TechnologyModel, as: "technologies" },
      ],
    });
    return res.status(200).json({ data: projects });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const dataLimpia = matchedData(req);

    // TODO: 1. Actualizar el project con los datos recibidos.
    const project = await ProjectModel.findByPk(id);
    await project.update(dataLimpia);

    // TODO: 2. Reemplazar sus technologies si vienen en el body.
    if (dataLimpia.technologies) {
      await project.setTechnologies(dataLimpia.technologies);
    }

    // TODO: 3. Responder con código 200 y el project actualizado, incluyendo su leader y sus technologies.
    const projectUpdated = await ProjectModel.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: "leader",
          attributes: { exclude: ["password"] },
        },
        { model: TechnologyModel, as: "technologies" },
      ],
    });

    return res.status(200).json({ data: projectUpdated });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    // TODO: 1. Eliminar el project y responder con código 204 sin devolver ningún mensaje.
    const project = await ProjectModel.findByPk(req.params.id);
    await project.destroy();
    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};
