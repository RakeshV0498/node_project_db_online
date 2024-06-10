// API With db connection

import express from "express";
import { client, db } from "../db-utils/mongoConnection.js";
import teacherModel from "../db-utils/models.js";

const studentDbRouter = express.Router();
export const collection = db.collection("students");

studentDbRouter.get("/", async (req, res) => {
  try {
    const data = await collection.find({}).toArray();
    res.send(data);
  } catch (error) {
    res
      .status(500)
      .send({ msg: "MongoDB service is stopped, Please try again later" });
  }
});

studentDbRouter.get("/get-teacher/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const { teacherId } = await collection.findOne({ id: studentId });

    if (teacherId) {
      const teacherData = await teacherModel.findOne({ id: teacherId });
      res.send(teacherData);
    } else {
      res.status(400).send({ msg: "No Teacher Assigned to this student" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ msg: "MongoDB service is stopped, Please try again later" });
  }
});

studentDbRouter.post("/", async (req, res) => {
  const { body } = req;

  try {
    await collection.insertOne({
      ...body,
      id: Date.now().toString(),
      teacherId: null,
    });

    res.send({ msg: "Student addedd successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ msg: "MongoDB service is stopped, Please try again later" });
  }
});

studentDbRouter.put("/:studentId", async (req, res) => {
  const { studentId } = req.params;

  const { body } = req;

  try {
    const stuObj = await collection.findOne({ id: studentId });

    if (stuObj) {
      await collection.updateOne(
        { id: studentId },
        { $set: { ...body, id: studentId } }
      );

      res.send({ msg: "Updated Student Successfully" });
    } else {
      res.status(400).send({ msg: "Student Not found" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ msg: "MongoDB service is stopped, Please try again later" });
  }
});

studentDbRouter.delete("/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const stuObj = await collection.findOne({ id: studentId });

    if (stuObj) {
      await collection.deleteOne({ id: studentId });
      res.send({ msg: "Student deleted successfully" });
    } else {
      res.status(404).send({ msg: "Student not found" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ msg: "MongoDB service is stopped, Please try again later" });
  }
});

studentDbRouter.patch("/assign-teacher/:studentId", async (req, res) => {
  const { studentId } = req.params;
  const { teacherId } = req.body;

  console.log(teacherId);

  try {
    // Check if the student exists
    const student = await collection.findOne({ id: studentId });
    if (!student) {
      return res.status(404).send({ msg: "Student not found" });
    }

    // Check if the teacher exists
    const teacher = await teacherModel.findOne({ id: teacherId });
    if (!teacher) {
      return res.status(404).send({ msg: "Teacher not found" });
    }

    // Update the student document to set the teacherId
    await collection.updateOne(
      { id: studentId },
      { $set: { teacherId: teacherId } }
    );

    // Update the teacher document to add the studentId to the students array
    await teacherModel.updateOne(
      { id: teacherId },
      { $push: { students: studentId } }
    );

    res.send({ msg: "Teacher assigned to student successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ msg: "MongoDB service is stopped, Please try again later" });
  }
});

export default studentDbRouter;
