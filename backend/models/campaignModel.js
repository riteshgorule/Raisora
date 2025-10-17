import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  organiser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  category: { type: String, default: 'General' },
  progress: { type: Number, default: 0 },
  supporters: { type: Number, default: 0 },
  target: { type: Number, default: 10000 },
  timeLeft: { type: String, default: 'N/A' },
  image: { type: String, default: 'bg-gradient-to-br from-gray-400 to-gray-600' },
  urgent: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Campaign', campaignSchema);
