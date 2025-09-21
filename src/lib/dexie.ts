import Dexie, { type EntityTable } from "dexie";
import type { z } from "zod";
import type { equipmentFormSchema } from "@/schemas";

export type EquipmentForm = z.infer<typeof equipmentFormSchema> & {
  id?: number;
  submittedAt: Date;
  synced: boolean;
};

const db = new Dexie("EquipmentFormsDatabase") as Dexie & {
  equipmentForms: EntityTable<EquipmentForm, "id">;
};

db.version(1).stores({
  equipmentForms:
    "++id, submittedAt, synced, truckNumber, drillNumber, operatorName",
});

export const markAsSynced = async (id: number) => {
  await db.equipmentForms.update(id, { synced: true });
};

export const getUnsyncedForms = async () => {
  return await db.equipmentForms.filter((form) => !form.synced).toArray();
};

export { db };
