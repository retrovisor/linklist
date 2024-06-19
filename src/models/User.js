import { model, models, Schema } from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: String,
  image: {
    type: String,
    default: 'https://t1.kakaocdn.net/account_images/default_profile.jpeg', // Specify the default image URL
  },
  emailVerified: Date,
  providerId: {
    type: String,
    unique: true, // Add a unique constraint to ensure providerId is unique across users
  },
});

export const User = models?.User || model('User', UserSchema);
