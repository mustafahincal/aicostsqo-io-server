const Mongoose = require('mongoose');

const DfnSchema = Mongoose.Schema(
  {
    siteId: {
      type: Mongoose.Types.ObjectId,
      ref: 'sites',
      required: true,
    },
    discontinuitySetId: Number,
    shape: String,
    type: String,
    dip: Number,
    dipDirection: Number,
    expectationTraceLength: Number,
    spacing: Number,
    fisherK: Number,
    mu: Number,
    mean: Number,
    std: Number,
    frictionAngle: Number,
    location: String,
    persistence: String,
    orientation: String,
    fractureIntensity: String,
    intensityValue: Number,
    positionX: Number,
    positionY: Number,
    positionZ: Number,
    vertex2: {
      x: Number,
      y: Number,
      z: Number,
    },
    vertex3: {
      x: Number,
      y: Number,
      z: Number,
    },
    vertex4: {
      x: Number,
      y: Number,
      z: Number,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = Mongoose.model('dfns', DfnSchema);
