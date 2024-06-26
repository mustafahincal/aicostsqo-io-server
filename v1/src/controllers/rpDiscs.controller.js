const {
  listDiscs,
  getDiscsByRpId,
  insertDisc,
  updateDisc,
  bulkDeleteRpDiscs,
  bulkInsertDisc,
} = require('../services/rpDisc.service');

const index = async (req, res) => {
  const discs = await listDiscs();
  res.send({
    success: true,
    message: discs,
  });
};

const listByRpId = async (req, res) => {
  const discs = await getDiscsByRpId(req.params.id);
  res.send({
    success: true,
    discs,
  });
};

const create = async (req, res) => {
  const disc = await insertDisc(req.body);
  res.send({
    disc,
    success: true,
    message: 'Disc created successfully',
  });
};

const update = async (req, res) => {
  const { discId } = req.params;
  const disc = await updateDisc(discId, req.body);
  res.send({
    disc,
    success: true,
    message: 'Disc updated successfully',
  });
};

const bulkDelete = async (req, res) => {
  await bulkDeleteRpDiscs(req.body);
  res.send({
    success: true,
    message: 'Deleted successfully',
  });
};

const manual = async (req, res) => {
  const disc = await bulkInsertDisc(req.body);
  res.send({
    disc,
    success: true,
    message: 'Discs are created successfully',
  });
};

module.exports = {
  index,
  listByRpId,
  create,
  update,
  bulkDelete,
  manual,
};
