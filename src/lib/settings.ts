import "server-only";
import { cache } from "react";
import { db } from "./db";

export const getSettings = cache(async () => {
  return db.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
});

export const getNavCategories = cache(async () => {
  return db.category.findMany({ orderBy: { sortOrder: "asc" } });
});
