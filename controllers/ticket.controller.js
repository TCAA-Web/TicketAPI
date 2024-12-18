const db = require("../models");
const jwt = require("jsonwebtoken");
const ticket = db.Ticket;

// Function to Create Ticket
exports.create = (req, res) => {
  // Get decoded user id from token
  let authorization = req.headers.authorization.split(" ")[1];
  let decoded = jwt.verify(authorization, process.env.JWT_SECRET);
  console.log(decoded.id);

  // Create new ticket object
  const Ticket = {
    title: req.body.title,
    date: req.body.date,
    location: req.body.location,
    time: req.body.time,
    description: req.body.description,
    published: new Date().toLocaleDateString("da-DK"),
    user: decoded.id,
    image: req.body.image,
  };

  // Insert ticket into DB and return data to user, excluding user ID
  ticket
    .create(Ticket)
    .then((data) => {
      delete data["user"], res.send(data);
    })
    .catch((err) =>
      res.status(500).send({
        message:
          err.message || "An unknown error occured while creating a ticket",
      })
    );
};

// Function to find all tickets belonging to user
exports.findAll = (req, res) => {
  // get user ID from decoded token
  let authorization = req.headers.authorization.split(" ")[1];
  let decoded = jwt.verify(authorization, process.env.JWT_SECRET);

  // find all tickets belonging to user and returns them back
  ticket
    .findAll({
      where: { user: decoded.id },
      attributes: {
        exclude: ["user"],
      },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving tickets.",
      });
    });
};

// Function to find one ticket belonging to user, with ticket ID
exports.findOne = (req, res) => {
  // get the ID from request
  const id = req.params.id;

  // get decoded user id
  let authorization = req.headers.authorization.split(" ")[1];
  let decoded = jwt.verify(authorization, process.env.JWT_SECRET);

  // find ticket by id and user ID
  ticket
    .findByPk(id)
    .then((data) => {
      if (data && data.user === decoded.id) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find ticket with id=${id} or this ID does not belong to user`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving ticket with id=" + id + err,
      });
    });
};

// Function to update user tickets
exports.update = (req, res) => {
  // get id of ticket to update
  const id = req.params.id;
  // find ticket by id and user ID
  ticket.findByPk(id).then((data) => {
    if (data && data.user === decoded.id) {
      ticket
        .update(
          {
            title: req.body.title ? req.body.title : data.title,
            date: req.body.date ? req.body.date : data.date,
            location: req.body.location ? req.body.location : data.location,
            time: req.body.time ? req.body.time : data.time,
            image: req.body.image ? req.body.image : data.image,
            description: req.body.description
              ? req.body.description
              : data.description,
            published: data.published,
            createdAt: data.createdAt,
            updatedAt: new Date().toLocaleDateString("da-DK"),
          },
          {
            where: { id: id, user: decoded.id },
            attributes: {
              exclude: ["user"],
            },
          }
        )
        .then((num) => {
          if (num == 1) {
            res.send({
              message: "ticket was updated successfully.",
            });
          } else {
            res.send({
              message: `Cannot update ticket with id=${id}!`,
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: `Error updating ticket with id=${id} ErrorMessage: ${err}}`,
          });
        });
    }
  });

  // get decoded user id
  let authorization = req.headers.authorization.split(" ")[1];
  let decoded = jwt.verify(authorization, process.env.JWT_SECRET);

  // update ticket with specified id belonging to user ID
};

// Function to delete a ticket
exports.delete = (req, res) => {
  // get id of ticket to delete
  const id = req.params.id;

  // get user id from decoded token
  let authorization = req.headers.authorization.split(" ")[1];
  let decoded = jwt.verify(authorization, process.env.JWT_SECRET);

  // delete ticket belonging to user ID and with specified ticket ID
  ticket
    .destroy({
      where: { id: id, user: decoded.id },
      attributes: {
        exclude: ["user"],
      },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "ticket was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete ticket with id=${id}. Maybe ticket was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete ticket with id=" + id,
      });
    });
};

// Function to delete all tickets
exports.deleteAll = (req, res) => {
  // get user id from decoded token
  let authorization = req.headers.authorization.split(" ")[1];
  let decoded = jwt.verify(authorization, process.env.JWT_SECRET);

  // delete all tokens belonging to user
  ticket
    .destroy({
      where: { user: decoded.id },
      truncate: false,
    })
    .then((nums) => {
      res.send({ message: `${nums} tickets were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tickets.",
      });
    });
};
