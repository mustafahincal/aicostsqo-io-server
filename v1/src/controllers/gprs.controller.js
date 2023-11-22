const {
  getBySiteId: getGprs,
  insertGpr,
  bulkDelete: removeGprs,
} = require('../services/gpr.service');
const { getBySiteId: getDiscs } = require('../services/gprDisc.service');
const {
  getBySiteId: getProfiles,
  insert: insertGprProfile,
  bulkDelete: removeGprProfiles,
} = require('../services/gprProfile.service');

const create = async (req, res) => {
  const { body } = req;
  const gpr = await insertGpr(body);
  res.send({
    result: gpr,
    success: true,
    message: 'Gpr created successfully',
  });
};

const createGprProfile = async (req, res) => {
  const { body } = req;
  const gprProfile = await insertGprProfile(body);
  res.send({
    result: gprProfile,
    success: true,
    message: 'Gpr profile created successfully',
  });
};

const deleteGprs = async (req, res) => {
  const { body } = req;
  await removeGprs(body);
  res.send({
    success: true,
    message: 'Gpr profile deleted successfully',
  });
};
const deleteGprProfiles = async (req, res) => {
  const { body } = req;
  await removeGprProfiles(body);
  res.send({
    success: true,
    message: 'Gpr profile deleted successfully',
  });
};

const getBySiteId = async (req, res) => {
  const { siteId } = req.params;
  const gprs = await getGprs(siteId);
  const gprProfiles = await getProfiles(siteId);
  const gprDiscs = await getDiscs(siteId);
  const result = {
    gprs,
    gprProfiles,
    gprDiscs,
  };
  res.send({
    result,
    success: true,
    message: 'Gprs listed successfully',
  });
};

module.exports = {
  getBySiteId,
  create,
  createGprProfile,
  deleteGprs,
  deleteGprProfiles,
};
