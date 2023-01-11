const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.json());

const PORT = process.env.PORT || 5000;

const mailList = JSON.parse(fs.readFileSync("mailList.json", "utf-8"));

// `/lists` - fetch all the existing list names
app.get("/lists", (req, res) => {
  res.json(mailList.map((c) => c.name));
});

//GET single list
app.get("/lists/:name", (req, res) => {
  const name = req.params.name;
  const list = mailList.find((a) => a.name === name);
  if (!list) {
    res.status(404).send("No matching list found");
    return;
  }
  res.json(list);
});

// DELETE single list
app.delete("/lists/:name", (req, res) => {
  const name = req.params.name;
  if (!name) {
    res.status(400).send("please enter the name");
    return;
  }
  const list = mailList.find((a) => a.name === name);
  if (!list) {
    res.status(404).send("No matching list found");
    return;
  }
  const index = mailList.findIndex((a) => a.name === name);
  mailList.splice(index, 1);
  res.send(list);
});

//PUT - update single list
app.put("/lists/:name", (req, res) => {
  const found = mailList.some((c) => c.name === req.params.name);
  if (found) {
    const updatedList = req.body;
    mailList.forEach((list) => {
      if (list.name === req.params.name) {
        list.name = updatedList.name ? updatedList.name : list.name;
        list.members = updatedList.members ? updatedList.members : list.members;
        res.json({ msg: "list updated", list });
      }
    });
    return;
  }
  res
    .status(400)
    .json({ msg: `list is not found with the name ${req.params.name}` });
});

//POST: add email into the list
app.post("/lists/:name/members", (req, res) => {
  const found = mailList.some((c) => c.name === req.params.name);
  if (found && req.body.email) {
    mailList.forEach((list) => {
      if (list.name === req.params.name) {
        list.members.push(req.body.email);
        res.json({ msg: "email is added", list });
        return;
      }
    });
  }
  if (!req.body.email) {
    res.send("Enter the Email");
    return;
  }
  if (!found) {
    res
      .status(400)
      .json({ msg: `list is not found with the name ${req.params.name}` });
  }
});

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
