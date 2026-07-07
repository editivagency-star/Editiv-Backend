const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Client = require("./models/Client");

dotenv.config();

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");
    const clients = await Client.find({});
    console.log("Registered Clients:");
    clients.forEach((c) => {
      console.log(`- ID: ${c._id}, Name: ${c.name}, Email: "${c.email}", isActive: ${c.isActive}`);
    });
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

test();
