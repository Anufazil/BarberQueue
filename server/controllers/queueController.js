const queueService = require("../services/queueService");
const asyncHandler = require("../utils/asyncHandler");







const {
  successResponse,
} = require("../utils/apiResponse");


const joinQueue = asyncHandler(async (req, res) => {
  const result = await queueService.joinQueue(req.body);

  return successResponse(
    res,
    result.message,
    {
      queue: result.queue,
      estimatedWait: result.estimatedWait,
    },
    201
  );
});

const callNextCustomer = asyncHandler(async (req, res) => {
  const result = await queueService.callNextCustomer(
    req.params.barberId
  );

  return successResponse(
    res,
    result.message,
    {
      customer: result.customer,
    }
  );
});

const finishCurrentCustomer = asyncHandler(async (req, res) => {
  const result =
    await queueService.finishCurrentCustomer(
      req.params.barberId, req.body?.queueId
    );

  return successResponse(
    res,
    result.message,
    {
      customer: result.customer,
    }
  );
});

const skipCustomer = asyncHandler(async (req, res) => {
  const result = await queueService.skipCustomer(
    req.params.id,
    req.user
  );

  return successResponse(
    res,
    result.message,
    {
      customer: result.customer,
    }
  );
});

const cancelQueue = asyncHandler(async (req, res) => {
  const result = await queueService.cancelQueue(
    req.params.id,
    req.user
  );

  return successResponse(
    res,
    result.message,
    {
      customer: result.customer,
    }
  );
});

const getQueueAnalytics = asyncHandler(async (req, res) => {
  const result =
    await queueService.getQueueAnalytics(
      req.params.barberId
    );

  return successResponse(
    res,
    "Queue analytics fetched successfully.",
    result.analytics
  );
});

const getQueueByBarber = asyncHandler(async (req, res) => {

  const result =
    await queueService.getQueueByBarber(
      req.params.barberId
    );

  return successResponse(
    res,
    "Queue fetched successfully.",
    {
      barber: result.barber,
      currentCustomer: result.currentCustomer,
      waitingQueue: result.waitingQueue,
      waitingCount: result.waitingCount,
    }
  );

});

const getQueueSummary = asyncHandler(async (req, res) => {

  const result =
    await queueService.getQueueSummary(
      req.params.barberId
    );

  return successResponse(
    res,
    "Queue summary fetched successfully.",
    result.summary
  );

});

const getQueueStatus = asyncHandler(async (req, res) => {

  const result =
    await queueService.getQueueStatus(
      req.params.token
    );

  return successResponse(
    res,
    "Queue status fetched successfully.",
    result
  );

});

module.exports = {
    joinQueue,
    getQueueByBarber,
    getQueueSummary,
    getQueueAnalytics,
    getQueueStatus,
    callNextCustomer,
    finishCurrentCustomer,
    skipCustomer,
    cancelQueue,
};