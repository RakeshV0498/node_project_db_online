import express from "express";
import cors from "cors";

import connectToDb from "./db-utils/mongoConnection.js";
import studentDbRouter from "./routes/students.js";
import mongooseConnect from "./db-utils/mongooseConnection.js";
import teacherDbRouter from "./routes/teachers.js";

const server = express();

connectToDb();

mongooseConnect();

server.use(express.json());
server.use(cors());

server.use("/students-db", studentDbRouter);

server.use("/teachers-db", teacherDbRouter);

const port = 8000;

server.listen(port, () => {
  console.log(Date().toString(), "server listening on port " + port);
});
