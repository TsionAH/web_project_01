import { Inngest } from "inngest";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "aau_social" });

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    let username = email_addresses[0].email.split("@")[0];
    const user = await User.findOne({ username });
    if (user) username += Math.floor(Math.random() * 1000);

    await User.create({
      _id: id,
      email: email_addresses[0].email,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
      username,
    });
  }
);

const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    await User.findByIdAndUpdate(id, {
      email: email_addresses[0].email,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
    });
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await User.findByIdAndDelete(event.data.id);
  }
);

export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
];