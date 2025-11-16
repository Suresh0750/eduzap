import mongoose, { Schema, Document } from "mongoose";


export interface IRequestByUser extends Document {
  name: string;
  phone: string;
  title: string;
  image: string;            
  timestamp: Date;
}


const UserRequestSchema: Schema<IRequestByUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/, 
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true, 
    },
    timestamp: {
      type: Date,
      required: true,
    },
  },
  { timestamps: false }
);


const UserRequest = mongoose.model('UserRequest', UserRequestSchema,"request");

module.exports = UserRequest;
