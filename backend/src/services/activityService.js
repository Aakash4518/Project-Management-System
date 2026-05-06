import { ActivityLog } from "../models/ActivityLog.js";

export const createActivity = async ({ actor, entityType, entityId, action, message }) => {
  await ActivityLog.create({ actor, entityType, entityId, action, message });
};
