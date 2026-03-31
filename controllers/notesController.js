const Note = require("../models/Notes");
const asyncHandler = require("express-async-handler");
// Get Notes

const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().populate("user", "username").lean();
  if (!notes?.length) {
    return res.status(400).json({ message: "No notes Found" });
  }
  res.json(notes);
});

const createNewNote = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body;

  // confirm data
  if (!title || !user || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await Note.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate note title" });
  }

  const noteObject = { user, title, text };

  const note = await Note.create(noteObject);

  if (note) {
    res.status(201).json({ message: `New note ${title} created` });
  } else {
    res.status(400).json({ message: "Invalid note data recieved" });
  }
});

const updateNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;
  // confirm data
  if (!id || !user || !title || !text || typeof completed != "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }

  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  // check for duplicate

  const duplicate = await Note.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  //Allow updates to original user

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate title" });
  }

  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();

  res.json({ message: `${updatedNote.title} updated` });
});

const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: `Note ID required` });
  }

  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  const { title, completed } = note;

  if (!completed) {
    return res.status(400).json({ message: "Note has not been completed" });
  }

  const result = await note.deleteOne();
  const reply = `Note ${title} with ID ${id} deleted`;
  res.json(reply);
});

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
};
