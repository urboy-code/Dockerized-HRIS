const express = require('express');
const { createUser, getAllUsers, updateUser, deleteUser } = require('../controllers/user.controller');
const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
