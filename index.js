const fs = require("fs");
const express = require("express");

const app = express();

app.use(express.json());

const contacts = JSON.parse(fs.readFileSync("./contacts.txt", "utf8"));

app.get("/api/v1/contacts", (req, res) => {
  res.status(200).json({ status: "success", data: contacts });
});

app.get("/api/v1/contact/:val", (req, res) => {
  const val = req.params.val;
  const contact = contacts.find(
    (el) => el.firstName === val || el.lastName === val
  );

  if (contact) {
    return res.status(200).json({ status: "success", data: contact });
  }
  res
    .status(201)
    .json({ message: "No contact found with follwing details", data: val });
});

app.post("/api/v1/contacts", (req, res) => {
  const { firstName, lastName, phone, contactType } = req.body;

  if (!firstName || !lastName || !phone) {
    return res.status(400).json({
      status: "fail",
      message: "missing firstname or lastName or phone",
    });
  }

  const contact = contacts.find((el) => el.phone === phone);
  //   console.log(contact);
  if (contact) {
    return res.status(409).json({ message: "Contact already exists", contact });
  }

  contacts.push({ firstName, lastName, phone, contactType });
  fs.writeFile("./contacts.txt", JSON.stringify(contacts), (err) => {
    res.status(200).json({ status: "success", data: req.body });
  });
});

// app.put("/api/v1/contact/", (req, res) => {
//   const { firstName, lastName, phone, contactType } = req.body;

//   if (!phone) {
//     return res.status(400).json({
//       status: "fail",
//       message: "missing phone",
//     });
//   }

//   const contact = contacts.find((el) => el.phone === phone);
//   console.log(contact);
//   if (contact) {
//     const updatedContact = [
//       ...contacts,
//       { firstName, lastName, phone, contactType },
//     ];
//     fs.writeFile("./contacts.txt", JSON.stringify(updatedContact), (err) => {
//       return res
//         .status(200)
//         .json({ message: "Contact updated Successfully", data: contact });
//     });
//   }
//   res.status(404).json({ status: "Failed", message: "Contact not founnd" });
// });

app.get("/api/v1/contact/phone/:phone", (req, res) => {
  const phone = req.params.phone;
  const contact = contacts.find((el) => el.phone === phone);

  if (contact) {
    return res.status(200).json({ status: "success", data: contact });
  }
  res.status(201).json({
    message: "No contact found with follwing given phone number",
    data: phone,
  });
});

app.delete("/api/v1/contact", (req, res) => {
  const { firstName, lastName, phone, contactType } = req.body;

  if (!firstName || !lastName || !phone) {
    return res.status(400).json({
      status: "fail",
      message: "missing firstname or lastName or phone",
    });
  }

  const contact = contacts.find(
    (el) => el.firstName === firstName && el.phone === phone
  );
  //   console.log(contact);
  if (!contact) {
    return res.status(404).json({ message: "Contact doesn't exists", contact });
  }

  const newContacts = contacts.filter(
    (el) =>
      !(
        el.firstName === firstName &&
        el.lastName === lastName &&
        el.phone === phone
      )
  );
  fs.writeFile("./contacts.txt", JSON.stringify(newContacts), (err) => {
    res
      .status(200)
      .json({ status: "Success", message: "contact Deleted successfully" });
  });
});

app.listen(8000, () => {
  console.log("Listening on PORT 8000");
});
