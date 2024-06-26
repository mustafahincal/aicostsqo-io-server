const Site = require('../models/site.model');
const { insertGpr } = require('./gpr.service');
const { insertGprDiscs } = require('./gprDisc.service');
const { insertGprProfiles } = require('./gprProfile.service');
const { insertSiteBound } = require('./siteBound.service');
const { insertRp } = require('./rp.service');
const { insertDiscs: insertRpDiscs } = require('./rpDisc.service');
const { insertMagnetometric } = require('./magnetometric.service');
const { insertMagnetometricDiscs } = require('./magnetometricDisc.service');
const { insertResistivity } = require('./resistivity.service');
const { insertResistivityContours } = require('./resistivityContour.service');
const { insertSeismic } = require('./seismic.service');
const { insertSeismicDiscs } = require('./seismicDisc.service');
const { insertSeismicProfiles } = require('./seismicProfile.service');
const { insertTeleviewer } = require('./televiewer.service');
const { insertTeleviewerDiscs } = require('./televiewerDisc.service');
const { SITE_COLUMNS } = require('./constants/modelColumns');
const { createWorkBook, addWorksheetToWorkbook } = require('./excel.service');
const { writeWorkbookToFile } = require('../scripts/utils/excel.helper');

const insert = async (data) => {
  const site = await Site.create(data);
  if (site) return site;
  throw new Error('Site not created');
};

const list = async () => {
  const sites = await Site.find({});
  if (sites) return sites;
  throw new Error('Sites not found');
};

const listByProjectId = async (projectId) => {
  const sites = await Site.find({ project: projectId });
  if (sites) return sites;
  throw new Error('Sites not found');
};

const get = async (id) => {
  const site = await Site.findById(id);
  if (site) return site;
  throw new Error('Site not found');
};

const getByCustomerId = async (userId) => {
  const sites = await Site.find({ customerId: userId }).sort({ name: 1 });
  if (sites) return sites;
  throw new Error('sites not found');
};

const insertWithRelations = async (body) => {
  const {
    site,
    siteBound,
    rps,
    gprs,
    magnetometrics,
    seismics,
    televiewers,
    resistivities,
  } = body;

  const { height, ...pureSite } = site;
  const { limits, ...pureSiteBound } = siteBound;

  const siteToInsert = await insert({ ...pureSite });
  const siteBoundToInsert = await insertSiteBound({
    site: siteToInsert._id,
    ...pureSiteBound,
  });

  await insertRp({
    siteBound: siteBoundToInsert._id,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    sizeX: Math.abs(limits.right - limits.left), // sağ - sol
    sizeY: Math.abs(limits.top - limits.bottom), // üst - alt
    sizeZ: height,
    name: 'RP 0',
    slopeAngle: 0,
    crepeAngle: 0,
  });

  for (const rp of rps) {
    const { discs, ...rest } = rp;
    const rpToInsert = await insertRp({
      siteBound: siteBoundToInsert._id,
      ...rest,
    });

    await insertRpDiscs(discs.map((d) => ({ rpId: rpToInsert._id, ...d })));
  }

  for (const gpr of gprs) {
    const { discs, profiles, ...rest } = gpr;
    await insertGpr({
      siteId: siteToInsert._id,
      ...rest,
    });

    await insertGprDiscs(
      discs.map((d) => ({ ...d, siteId: siteToInsert._id }))
    );
    await insertGprProfiles(
      profiles.map((d) => ({ ...d, siteId: siteToInsert._id }))
    );
  }

  for (const magnetometric of magnetometrics) {
    const { discs, ...rest } = magnetometric;
    await insertMagnetometric({
      siteId: siteToInsert._id,
      ...rest,
    });
    await insertMagnetometricDiscs(
      discs.map((d) => ({ ...d, siteId: siteToInsert._id }))
    );
  }

  for (const seismic of seismics) {
    const { discs, profiles, ...rest } = seismic;
    await insertSeismic({
      siteId: siteToInsert._id,
      ...rest,
    });
    await insertSeismicDiscs(
      discs.map((d) => ({ ...d, siteId: siteToInsert._id }))
    );
    await insertSeismicProfiles(
      profiles.map((d) => ({ ...d, siteId: siteToInsert._id }))
    );
  }

  for (const televiewer of televiewers) {
    const { discs, ...rest } = televiewer;
    await insertTeleviewer({
      siteId: siteToInsert._id,
      ...rest,
    });
    await insertTeleviewerDiscs(
      discs.map((d) => ({ ...d, siteId: siteToInsert._id }))
    );
  }

  for (const resistivity of resistivities) {
    const { contours, ...rest } = resistivity;
    await insertResistivity({
      siteId: siteToInsert._id,
      ...rest,
    });
    await insertResistivityContours(
      contours.map((d) => ({ ...d, siteId: siteToInsert._id }))
    );
  }
};

const exportMySitesToExcel = async (userId) => {
  const sites = (await getByCustomerId(userId)).map((p) => {
    return {
      ...p._doc,
      _id: p._id.toString(),
    };
  });

  if (sites.length < 1) {
    throw new Error('No sites found');
  }

  const workbook = createWorkBook();
  addWorksheetToWorkbook(workbook, 'Sites', SITE_COLUMNS, sites);
  return await writeWorkbookToFile(workbook);
};

module.exports = {
  insertSite: insert,
  listSites: list,
  listSitesByProjectId: listByProjectId,
  getSite: get,
  insertWithRelations,
  exportMySitesToExcel,
  getByCustomerId,
};
