import { model, Schema } from 'mongoose';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
    // parentId: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    // },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Contact = model('Contact', contactSchema);

export { Contact };
