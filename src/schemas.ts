import { z } from "zod";

export const equipmentFormSchema = z.object({
  truckNumber: z.number(),
  drillNumber: z.string(),
  drillReportNumber: z.string(),
  shotType: z.enum(["production", "stripping", "toe", "special"]),
  startMileage: z.number(),
  stopMileage: z.number(),
  shiftStart: z.string(),
  shiftEnd: z.string(),
  perDiem: z.coerce.boolean(),
  operatorName: z.string(),
  hourMeterStart: z.number(),
  /**
   * @todo should this always be greater than hourMeterStart?
   */
  hourMeterEnd: z.number(),
  /**
   * @todo is this fuel amount?
   */
  fuel: z.number(),
  dailyFootage: z.number(),
  holesDrilled: z.number(),
  holeDiameter: z.enum(['6.5"', '6.0"', '5.5"', '5.0"', '4.5"', '4.0"']),
  depth: z.number(),
  holesCovered: z.coerce.boolean(),
  coverTapeLayout: z.number(),
  tramHours: z.number(),
  /**
   * @todo is this number of repairs?
   */
  repairs: z.number(),
  /**
   * @todo is this hours spent in repair/shop?
   */
  repairRunTime: z.number(),
  driveTime: z.number(),
  shotStandBy: z.number(),
  cleanOutHours: z.number(),
  fuelServiceDrill: z.number(),
  /**
   * @todo what is other?
   */
  other: z.string(),
});
