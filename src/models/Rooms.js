const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    roomId: { type: String, default: () => uuidv4(), unique: true },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    student: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    professor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    observer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, required: false }, // Hora y fecha de inicio
    configuration: {
      LB: [{ type: Number, default: 0 }], // - FHR baseline (beats per minute)
      AC: [{ type: Number, default: 0 }], // # of accelerations per second
      FM: [{ type: Number, default: 0 }], // # of fetal movements per second
      UC: [{ type: Number, default: 0 }], // - # of uterine contractions per second
      DL: [{ type: Number, default: 0 }], // - # of light decelerations per second
      DS: [{ type: Number, default: 0 }], // - # of severe decelerations per second
      DP: [{ type: Number, default: 0 }], // - # of prolongued decelerations per second
      ASTV: [{ type: Number, default: 0 }], // - percentage of time with abnormal short term variability
      MSTV: [{ type: Number, default: 0 }], // - mean value of short term variability
      ALTV: [{ type: Number, default: 0 }], // - percentage of time with abnormal long term variability
      MLTV: [{ type: Number, default: 0 }], // - mean value of long term variability
      Width: [{ type: Number, default: 0 }], // - width of FHR histogram
      Min: [{ type: Number, default: 0 }], // - minimum of FHR histogram
      Max: [{ type: Number, default: 0 }], // - Maximum of FHR histogram
      Nmax: [{ type: Number, default: 0 }], // - # of histogram peaks
      Nzeros: [{ type: Number, default: 0 }], // - # of histogram zeros
      Mode: [{ type: Number, default: 0 }], // - histogram mode
      Mean: [{ type: Number, default: 0 }], // - histogram mean
      Median: [{ type: Number, default: 0 }], // - histogram median
      Variance: [{ type: Number, default: 0 }], // - histogram variance
      Tendency: [{ type: Number, default: 0 }], // - histogram tendency
    },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "rooms" }
);

module.exports = mongoose.model("Room", RoomSchema);
