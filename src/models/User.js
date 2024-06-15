import { model, models, Schema } from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: String,
  image: String,
  emailVerified: Date,
  providerId: {
    type: String,
    unique: true, // Add a unique constraint to ensure providerId is unique across users
  },
});

export const User = models?.User || model('User', UserSchema);
