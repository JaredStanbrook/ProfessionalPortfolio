import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import { text, integer, index } from "drizzle-orm/sqlite-core";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const staffClock = table("staff_clocks", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    staffid: text("staff_id").notNull(),
    startdate: integer('timestamp').notNull(),
    enddate: integer('timestamp').notNull(),
    starttime: text("start_time").notNull(), // Format "HH:MM"
    endtime: text("end_time").notNull() // Format "HH:MM"
});
/*
    (employees) => {
        return {
            userIdIndex: index("name_idx").on(employees.userId),
        };
    }
);
*/
export const insertStaffClockSchema = createInsertSchema(staffClock, {
    staffid: z.string(),
    startdate: z.string(),
    enddate: z.string(),
    starttime: z.string(),
    endtime: z.string()
});

export const selectStaffClockSchema = createSelectSchema(staffClock);
