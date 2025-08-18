import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMedia extends Document {
  _id: string;
  userId: string;
  filename: string;
  originalFilename: string;
  path: string;
  type: 'image' | 'video';
  size: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create or retrieve the Media model
const Media = mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);

export default Media;