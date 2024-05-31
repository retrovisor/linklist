import { model, models, Schema } from "mongoose";

const PageSchema = new Schema({
  uri: { type: String, required: true, unique: true, minlength: 1 },
  owner: { type: String, required: true },
  displayName: { type: String, default: '' },
  location: { type: String, default: '' },
  bio: { type: String, default: '' },
  bgType: { type: String, default: 'color' },  // Assuming bgType could be 'color', 'image', etc.
  bgColor: { type: String, default: '#6fdcc6' },  // Default black color
  bgImage: { type: String, default: '' },      // URL to a background image
    buttons: { type: Object, default: {} },
    links: { type: Array, default: [] },
  template: { type: String, default: '' },
  avatar: { type: String, default: '' },
  textBoxes: [
    {
      key: { type: String, required: true },
      title: { type: String, required: true },
      text: { type: String, required: true }
    }
  ],
  imageLinks: [
    {
      key: { type: String, required: true },
      title: { type: String, required: true },
      url: { type: String, required: true },
      linkUrl: { type: String, required: true }
    }
  ],
  youTubeVideos: [
    {
      key: { type: String, required: true },
      url: { type: String, required: true }
    }
  ],
}, { timestamps: true });


export const Page = models?.Page || model('Page', PageSchema);
