import express from "express";

import teacherModel from "../db-utils/models.js";
import { collection } from "./students.js";

const teacherDbRouter = express.Router();

teacherDbRouter.get("/", async (req, res) => {
  const { studentId } = req.query;

  if (studentId) {
    try {
      const teacherData = await teacherModel.findOne({ students: studentId });

      if (teacherData) {
        res.send(teacherData);
      } else {
        res.status(400).send({ msg: "No Teacher assigned to this student" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ msg: "MongoDB service is stopped, Please try again later" });
    }
  } else {
    try {
      const teachers = await teacherModel.find({});
      res.send(teachers);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ msg: "MongoDB service is stopped, Please try again later" });
    }
  }
});

teacherDbRouter.get("/get-students/:teacherId", async (req, res) => {
  const { teacherId } = req.params;
  console.log(teacherId);

  const studentsData = await collection.findOne({ teacherId: teacherId });

  console.log(studentsData);

  if (teacherId && studentsData) {
    res.send({ students: studentsData });
  } else {
    res.status(404).send({ msg: "Teacher or student not found" });
  }
});

teacherDbRouter.post("/", async (req, res) => {
  const { body } = req;

  try {
    // Validates a payload for the teacher model
    const newTeacher = await new teacherModel({
      ...body,
      id: Date.now().toString(),
    });

    await newTeacher.save();

    res.send({ msg: "Teacher Created Successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ msg: "MongoDB service is stopped, Please try again later" });
  }
});

teacherDbRouter.put("/:teacherId", async (req, res) => {
  const { teacherId } = req.params;
  const { body } = req;

  try {
    const teacherObj = {
      ...body,
      id: teacherId,
    };
    // Validates a payload for the teacher model
    await new teacherModel(teacherObj).validate(); //validate manually

    await teacherModel.updateOne({ id: teacherId }, { $set: teacherObj });

    res.send({ msg: "Teacher updated Successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ msg: "MongoDB service is stopped, Please try again later" });
  }
});

teacherDbRouter.delete("/:teacherId", async (req, res) => {
  const { teacherId } = req.params;

  try {
    const teacherObj = await teacherModel.findOne({ id: teacherId });

    if (teacherObj) {
      await teacherModel.deleteOne({ id: teacherId });
      res.send({ msg: "Teacher deleted Successfully" });
    } else {
      res.status(404).send({ msg: "Teacher not found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ msg: "MongoDB service is stopped, Please try again later" });
  }
});

export default teacherDbRouter;
