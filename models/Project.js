const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    status: {
      type: String,
      enum: ["not_started", "in_progress", "review", "completed"],
      default: "not_started",
    },
    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    startDate: {
      type: Date,
    },
    deadline: {
      type: Date,
    },
    teamMembers: [
      {
        name: String,
        role: String,
        avatar: String,
      },
    ],
    tasks: [
      {
        title: String,
        assignedTo: String,
        status: {
          type: String,
          enum: ["pending", "in_progress", "done"],
          default: "pending",
        },
        dueDate: Date,
      },
    ],
    clientNotes: {
      type: String,
    },
    deliverables: [
      {
        label: String,
        url: String,
        publicId: String,
        sharedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    milestoneEmails: {
      sent50: {
        type: Boolean,
        default: false,
      },
      sent100: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
