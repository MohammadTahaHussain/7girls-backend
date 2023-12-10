import mongoose from 'mongoose';

// Create a Mongoose schema
const lineSchema = new mongoose.Schema({
  randomId: String,
  lines: [
    {
      startX: Number,
      startY: Number,
      endX: Number,
      endY: Number
    },
  ],
  pstTime: String,
});

// Create a Mongoose model based on the schema
const Drawing = mongoose.model('Drawing', lineSchema);
export default Drawing;


