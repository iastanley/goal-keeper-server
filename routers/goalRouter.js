'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const router = express.Router();
mongoose.Promise = global.Promise;

const { Goal } = require('../models/models');
router.use(bodyParser.json());

// For Testing Only
let currentUser = "Illy";

// GET all goals
router.get('/', (req, res) => {
  Goal
    .find({user: currentUser})
    .exec()
    .then(goals => {
      res.status(200).json(goals);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error after goals GET route'});
    })
});

// POST new goal to server and respond with new goal
router.post('/', (req, res) => {
  const requiredFields = ['title', 'color'];
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const message = `Missing '${field}' in request body`;
      console.error(message);
      return res.status(400).json({message: message});
    }
  });

  let newData = {
    user: currentUser,
    title: req.body.title,
    color: req.body.color,
    tasks: []
  }

  Goal
    .create(newData)
    .then(goal => {
      res.status(201).json(goal);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'Internal server error after goals POST route'});
    });
});

// PUT request to add task to a route or change name or color
router.put('/:id', (req, res) => {
  //verify that req.params.id and req.body.id match
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = `Path id: ${req.params.id} and request body id: ${req.body.id} don't match`;
    console.error(message);
    res.status(400).json({message: message});
  }

  // first focus on adding a new task
  console.log(req.body);

  Goal
    .findOneAndUpdate({_id: req.params.id}, {$addToSet: {tasks: req.body}})
    .exec()
    .then( goal => {
      res.status(204).json(goal);
    })
    .catch(err => {
      console.error(err);
    });

});

module.exports = router;
