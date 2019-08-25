const express = require("express");
const app = express();

app.use(express.json());

const projects = [];
let totalRequests = 0;

//Global Middleware
app.use((req, res, next) => {
  totalRequests++;

  console.log(`API total requests: ${totalRequests}`);

  return next();
});

//Check if the req contain the user in index position
function checkProjectExist(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(404).json({ error: "Project does not found" });
  }

  req.project = project;

  return next();
}

// Add project
app.post("/projects", (req, res) => {
  const { id } = req.body;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  if (project) {
    return res.status(400).json({ error: `Duplicated ID -> #${id}` });
  }

  const item = {
    id,
    title,
    tasks: []
  };

  projects.push(item);

  return res.status(201).json({ success: `Project added: #${id} - ${title}` });
});

//Get all projects
app.get("/projects", (req, res) => {
  return res.status(200).json(projects);
});

//Update project's title
app.put("/projects/:id", checkProjectExist, (req, res) => {
  const { title } = req.body;

  const project = projects.find(p => p.id == req.project.id);

  const oldTitle = project.title;

  project.title = title;

  return res
    .status(200)
    .json({ success: `Name changed: ${oldTitle} -> ${title}` });
});

//Add task to project
app.post("/projects/:id/tasks", checkProjectExist, (req, res) => {
  const { title } = req.body;

  const project = projects.find(p => p.id == req.project.id);

  project.tasks.push(title);

  return res.status(200).json({
    success: `Task added in #${req.project.id} - ${req.project.title}`
  });
});

//Delete project
app.delete("/projects/:id", checkProjectExist, (req, res) => {
  const projectIndex = projects.findIndex(p => p.id == req.project.id);

  projects.splice(projectIndex, 1);

  return res.status(202).json({
    success: `Project deleted: #${req.project.id} - ${req.project.title}`
  });
});

app.listen(3000);
