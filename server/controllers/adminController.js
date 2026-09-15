const asyncHandler = require("../utils/asyncHandler");
const adminService = require("../services/adminService");

const {
  successResponse,
} = require("../utils/apiResponse");

const getDashboard = asyncHandler(async (req, res) => {

  const data = await adminService.getDashboard();

  return successResponse(
    res,
    "Dashboard fetched successfully.",
    data
  );

});

const getStatistics = asyncHandler(async (req, res) => {

  const data = await adminService.getStatistics();

  return successResponse(
    res,
    "Statistics fetched successfully.",
    data
  );

});

module.exports = {
  getDashboard,
  getStatistics,
};