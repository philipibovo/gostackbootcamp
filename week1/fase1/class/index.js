const express = require("express");
const server = express();

server.use(express.json());

const users = ["Philipi", "Jéssica", "João"];

//Global Middleware
server.use((req, res, next) => {
  //Log record
  console.time("Request");
  console.log(`Method: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

//Check if the req contain the attr name in body
function checkUserNameInReq(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }

  return next();
}

//Check if the req contain the user in index position
function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(404).json({ error: "User does not found" });
  }

  req.user = user;

  return next();
}

//Users list (all)
server.get("/users", (req, res) => {
  return res.status(200).json(users);
});

//Get user
server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.status(200).json({ name: `${req.user}` });
});

//Create user
server.post("/users", checkUserNameInReq, (req, res) => {
  const { name } = req.body;
  users.push(name);

  return res.status(201).json({ success: `User created: ${name}` });
});

//User update
server.put(
  "/users/:index",
  checkUserNameInReq,
  checkUserInArray,
  (req, res) => {
    const { index } = req.params;
    const { name } = req.body;
    const oldName = req.user;

    users[index] = name;
    req.user = name;

    return res
      .status(200)
      .json({ success: `User update: ${oldName} to ${req.user}` });
  }
);

//User delete
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.status(202).json({ success: `User deleted: ${req.user}` });
});

server.listen(3000);
