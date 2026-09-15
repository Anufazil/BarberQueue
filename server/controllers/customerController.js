const asyncHandler = require("../utils/asyncHandler");

const customerService = require("../services/customerService");

const { successResponse } = require("../utils/apiResponse");

const getCustomerHome = asyncHandler(async (req, res) => {

  const data =
    await customerService.getCustomerHome();

  return successResponse(
    res,
    "Customer home fetched successfully.",
    data
  );

});

module.exports = {
  getCustomerHome,
};