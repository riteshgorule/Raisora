import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  eventDate: { type: Date, required: true },
  dateText: { type: String },
  time: { type: String },
  location: { type: String },
  organiser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attendeesCount: { type: Number, default: 0 },
  description: { type: String },
  category: { type: String, default: 'General' },
  featured: { type: Boolean, default: false },
  type: { type: String, enum: ['In-Person','Virtual','Hybrid'], default: 'In-Person' },
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
