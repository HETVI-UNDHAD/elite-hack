const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.post('/', authenticate, isAdmin, eventController.createEvent);
router.get('/', authenticate, eventController.getAllEvents);
router.get('/:id', authenticate, eventController.getEventById);
router.put('/:id', authenticate, isAdmin, eventController.updateEvent);
router.delete('/:id', authenticate, isAdmin, eventController.deleteEvent);
router.post('/:id/rounds', authenticate, isAdmin, eventController.addEventRounds);
router.get('/:id/rounds', authenticate, eventController.getEventRounds);

module.exports = router;
