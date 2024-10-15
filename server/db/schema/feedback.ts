import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import { text, integer, index } from "drizzle-orm/sqlite-core";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const feedback = table("feedback", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    studentid: text("student_id").notNull(),
    staffname: text("staff_name").notNull(),
    description: text("description").notNull(),
    rating: integer("rating").notNull(), // Assuming rating is 1-5 integer
    servicedate: integer('timestamp').notNull()
});
/*
    (employees) => {
        return {
            userIdIndex: index("name_idx").on(employees.userId),
        };
    }
);
*/
export const insertFeedbackSchema = createInsertSchema(feedback, {
    name: z.string(),
    studentid: z.string(),
    staffname: z.string(),
    description: z.string(),
    rating: z.string(),
    servicedate: z.string()

});

export const selectFeedbackSchema = createSelectSchema(feedback);
