// schema/message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const Message = mongoose.model('Message', messageSchema);
