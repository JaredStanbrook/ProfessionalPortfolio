import { insertEmployeeSchema } from "./db/schema/employee";
import { insertClockRegSchema } from "./db/schema/clockReg";
import { insertFeedbackSchema } from "./db/schema/feedback";
import { insertStaffClockSchema } from "./db/schema/staffClock";

import { z } from "zod";

export const createEmployeeSchema = insertEmployeeSchema.omit({
    id: true,
});
export const createClockRegSchema = insertClockRegSchema.omit({
    id: true,
});
export const createFeedbackSchema = insertFeedbackSchema.omit({
    id: true,
});
export const createStaffClockSchema = insertStaffClockSchema.omit({
    id: true,
});

export type CreateEmployee = z.infer<typeof createEmployeeSchema>;
export type createClockReg = z.infer<typeof createClockRegSchema>;
export type CreateFeedback = z.infer<typeof createFeedbackSchema>;
export type CreateStaffClock = z.infer<typeof createStaffClockSchema>;
