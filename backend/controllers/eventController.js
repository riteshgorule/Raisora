import Event from '../models/eventModel.js';

const listEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('organiser', 'username').populate('attendees', 'username').sort({ eventDate: -1 });
    res.json({ ok: true, events });
  } catch (err) {
    console.error('listEvents error', err);
    res.status(500).json({ ok: false, message: 'Failed to fetch events' });
  }
};

const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organiser', 'username').populate('attendees', 'username');
    if (!event) return res.status(404).json({ ok: false, message: 'Event not found' });
    res.json({ ok: true, event });
  } catch (err) {
    console.error('getEvent error', err);
    res.status(500).json({ ok: false, message: 'Failed to fetch event' });
  }
};

const createEvent = async (req, res) => {
  try {
    const {
      title,
      dateText,
      eventDate,
      time,
      location,
      description,
      category,
      featured = false,
      type = 'In-Person'
    } = req.body;

    const organiser = req.user && req.user.id;
    const eDate = eventDate ? new Date(eventDate) : (dateText ? new Date(dateText) : null);

    const event = new Event({
      title,
      dateText,
      eventDate: eDate,
      time,
      location,
      organiser,
      description,
      category,
      featured,
      type,
    });

    event.attendeesCount = (event.attendees && event.attendees.length) || 0;
    await event.save();

    await event.populate('organiser', 'username');
    await event.populate('attendees', 'username');

    res.status(201).json({ ok: true, event });
  } catch (err) {
    console.error('createEvent error', err);
    res.status(500).json({ ok: false, message: 'Failed to create event' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.attendeesCount !== undefined) delete updates.attendeesCount;

    if (updates.eventDate) updates.eventDate = new Date(updates.eventDate);

    const event = await Event.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!event) return res.status(404).json({ ok: false, message: 'Event not found' });

    event.attendeesCount = (event.attendees && event.attendees.length) || 0;
    await event.save();

    await event.populate('organiser', 'username');
    await event.populate('attendees', 'username');

    res.json({ ok: true, event });
  } catch (err) {
    console.error('updateEvent error', err);
    res.status(500).json({ ok: false, message: 'Failed to update event' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ ok: false, message: 'Event not found' });
    res.json({ ok: true, message: 'Event deleted' });
  } catch (err) {
    console.error('deleteEvent error', err);
    res.status(500).json({ ok: false, message: 'Failed to delete event' });
  }
};

const registerEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const event = await Event.findOneAndUpdate(
      { _id: id, attendees: { $ne: userId } },
      { $addToSet: { attendees: userId } },
      { new: true }
    );

    if (!event) {
      const exists = await Event.findById(id);
      if (!exists) return res.status(404).json({ ok: false, message: 'Event not found' });
      return res.status(400).json({ ok: false, message: 'Already registered' });
    }

    event.attendeesCount = (event.attendees && event.attendees.length) || 0;
    await event.save();

    await event.populate('organiser', 'username');
    await event.populate('attendees', 'username');

    res.json({ ok: true, event });
  } catch (err) {
    console.error('registerEvent error', err);
    res.status(500).json({ ok: false, message: 'Failed to register' });
  }
};

const unregisterEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const event = await Event.findOneAndUpdate(
      { _id: id, attendees: { $in: [userId] } },
      { $pull: { attendees: userId } },
      { new: true }
    );

    if (!event) {
      const exists = await Event.findById(id);
      if (!exists) return res.status(404).json({ ok: false, message: 'Event not found' });
      return res.status(400).json({ ok: false, message: 'Not registered' });
    }

    event.attendeesCount = (event.attendees && event.attendees.length) || 0;
    await event.save();

    await event.populate('organiser', 'username');
    await event.populate('attendees', 'username');

    res.json({ ok: true, event });
  } catch (err) {
    console.error('unregisterEvent error', err);
    res.status(500).json({ ok: false, message: 'Failed to unregister' });
  }
};

export { listEvents, getEvent, createEvent, updateEvent, deleteEvent, registerEvent, unregisterEvent };
