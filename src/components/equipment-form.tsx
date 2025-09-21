"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { startTransition, useActionState, useState } from "react";
import { toast } from "sonner";
import { submitEquipmentForm } from "@/actions";
import { ControlledRadioGroup } from "@/components/controlled-radio-group";
import { ControlledSelect } from "@/components/controlled-select";
import { NetworkStatus } from "@/components/network-status";
import { Outbox } from "@/components/outbox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/dexie";
import { equipmentFormSchema } from "@/schemas";

export function EquipmentForm() {
  const [tab, setTab] = useState("equipment-form");
  const [lastResult, action, isPending] = useActionState(
    submitEquipmentForm,
    undefined,
  );
  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      truckNumber: 1234,
      drillNumber: "ABC123",
      drillReportNumber: "XX1234XX",
      shotType: "production",
      startMileage: 10000,
      stopMileage: 10100,
      shiftStart: "08:00",
      shiftEnd: "16:00",
      perDiem: "true",
      operatorName: "John Doe",
      hourMeterStart: 10000,
      hourMeterEnd: 10100,
      fuel: 100,
      dailyFootage: 1000,
      holesDrilled: 100,
      holeDiameter: '6.5"',
      depth: 100,
      holesCovered: "true",
      coverTapeLayout: 100,
      tramHours: 100,
      repairs: 100,
      repairRunTime: 100,
      driveTime: 100,
      shotStandBy: 100,
      cleanOutHours: 100,
      fuelServiceDrill: 100,
      other: "Other",
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: equipmentFormSchema });
    },
    onSubmit(event, { formData }) {
      event.preventDefault();
      startTransition(async () => {
        try {
          const submission = parseWithZod(formData, {
            schema: equipmentFormSchema,
          });

          if (submission.status !== "success") {
            toast.error("Form validation failed. Please check your inputs.");
            return;
          }

          await db.equipmentForms.add({
            ...submission.value,
            submittedAt: new Date(),
            synced: false,
          });

          if (!navigator.onLine) {
            toast.warning(
              "Form saved locally. Will sync when connection is available.",
            );
            setTab("outbox");
            return;
          }

          try {
            await submitEquipmentForm(undefined, formData);
            toast.success("Form synced successfully");
            setTab("outbox");
          } catch (error) {
            console.error(error);
            toast.error("Failed to sync form. Please try again.");
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to save form. Please try again.");
        }
      });
    },
  });

  /**
   * @todo figure out the UX of this form. Is DRILL/SHOT INFORMATION and HOURS
   *       filled out at the end of the shift, and the rest filled out at the
   *       beginning of the shift? If so, they should be split into two forms.
   */

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Tabs value={tab} defaultValue="equipment-form" onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="equipment-form">Equipment Form</TabsTrigger>
          <TabsTrigger value="outbox">Outbox</TabsTrigger>
        </TabsList>
        <TabsContent value="equipment-form">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>Equipment Form</CardTitle>
                <NetworkStatus />
              </div>
              <CardDescription>Daily Equipment Usage Form</CardDescription>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-4">
                Daily Time & Inspection Sheet
              </CardTitle>
              {/* @todo implement dynamic form */}
              <form
                action={action}
                id={form.id}
                onSubmit={form.onSubmit}
                className="flex w-full flex-col gap-4"
                noValidate
              >
                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.truckNumber.name}
                    data-error={!!fields.truckNumber.errors}
                  >
                    Truck Number
                  </Label>
                  <Input
                    type="number"
                    key={fields.truckNumber.key}
                    name={fields.truckNumber.name}
                    defaultValue={fields.truckNumber.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.truckNumber.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.drillNumber.name}
                    data-error={!!fields.drillNumber.errors}
                  >
                    Drill Number
                  </Label>
                  <Input
                    type="text"
                    key={fields.drillNumber.key}
                    name={fields.drillNumber.name}
                    defaultValue={fields.drillNumber.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.drillNumber.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.drillReportNumber.name}
                    data-error={!!fields.drillReportNumber.errors}
                  >
                    Drill Report Number
                  </Label>
                  <Input
                    type="text"
                    key={fields.drillReportNumber.key}
                    name={fields.drillReportNumber.name}
                    defaultValue={fields.drillReportNumber.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.drillReportNumber.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.shotType.name}
                    data-error={!!fields.shotType.errors}
                  >
                    Shot Type
                  </Label>
                  <ControlledSelect
                    name={fields.shotType.name}
                    items={[
                      { name: "Production", value: "production" },
                      { name: "Stripping", value: "stripping" },
                      { name: "Toe", value: "toe" },
                      { name: "Special", value: "special" },
                    ]}
                    placeholder="Select a shot type"
                    defaultValue={fields.shotType.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.shotType.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.startMileage.name}
                    data-error={!!fields.startMileage.errors}
                  >
                    Start Mileage
                  </Label>
                  <Input
                    type="number"
                    key={fields.startMileage.key}
                    name={fields.startMileage.name}
                    defaultValue={fields.startMileage.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.startMileage.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.stopMileage.name}
                    data-error={!!fields.stopMileage.errors}
                  >
                    Stop Mileage
                  </Label>
                  <Input
                    type="number"
                    key={fields.stopMileage.key}
                    name={fields.stopMileage.name}
                    defaultValue={fields.stopMileage.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.stopMileage.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.shiftStart.name}
                    data-error={!!fields.shiftStart.errors}
                  >
                    Shift Start
                  </Label>
                  <Input
                    type="time"
                    key={fields.shiftStart.key}
                    name={fields.shiftStart.name}
                    defaultValue={fields.shiftStart.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.shiftStart.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.shiftEnd.name}
                    data-error={!!fields.shiftEnd.errors}
                  >
                    Shift End
                  </Label>
                  <Input
                    type="time"
                    key={fields.shiftEnd.key}
                    name={fields.shiftEnd.name}
                    defaultValue={fields.shiftEnd.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.shiftEnd.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.perDiem.name}
                    data-error={!!fields.perDiem.errors}
                  >
                    Per Diem
                  </Label>
                  <ControlledRadioGroup
                    id={fields.perDiem.id}
                    name={fields.perDiem.name}
                    defaultValue={fields.perDiem.defaultValue}
                    items={[
                      { value: "true", label: "Yes" },
                      { value: "false", label: "No" },
                    ]}
                    aria-describedby={
                      !fields.perDiem.valid ? fields.perDiem.errorId : undefined
                    }
                  />
                  <p className="text-sm text-destructive">
                    {fields.perDiem.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.operatorName.name}
                    data-error={!!fields.operatorName.errors}
                  >
                    Operator Name
                  </Label>
                  <Input
                    type="text"
                    key={fields.operatorName.key}
                    name={fields.operatorName.name}
                    defaultValue={fields.operatorName.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.operatorName.errors}
                  </p>
                </div>

                <CardTitle>Drill/Shot Information</CardTitle>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.hourMeterStart.name}
                    data-error={!!fields.hourMeterStart.errors}
                  >
                    Hour Meter Start
                  </Label>
                  <Input
                    type="number"
                    key={fields.hourMeterStart.key}
                    name={fields.hourMeterStart.name}
                    defaultValue={fields.hourMeterStart.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.hourMeterStart.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.hourMeterEnd.name}
                    data-error={!!fields.hourMeterEnd.errors}
                  >
                    Hour Meter End
                  </Label>
                  <Input
                    type="number"
                    key={fields.hourMeterEnd.key}
                    name={fields.hourMeterEnd.name}
                    defaultValue={fields.hourMeterEnd.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.hourMeterEnd.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.fuel.name}
                    data-error={!!fields.fuel.errors}
                  >
                    Fuel
                  </Label>
                  <Input
                    type="number"
                    key={fields.fuel.key}
                    name={fields.fuel.name}
                    defaultValue={fields.fuel.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.fuel.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.dailyFootage.name}
                    data-error={!!fields.dailyFootage.errors}
                  >
                    Daily Footage
                  </Label>
                  <Input
                    type="number"
                    key={fields.dailyFootage.key}
                    name={fields.dailyFootage.name}
                    defaultValue={fields.dailyFootage.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.dailyFootage.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.holesDrilled.name}
                    data-error={!!fields.holesDrilled.errors}
                  >
                    Holes Drilled
                  </Label>
                  <Input
                    type="number"
                    key={fields.holesDrilled.key}
                    name={fields.holesDrilled.name}
                    defaultValue={fields.holesDrilled.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.holesDrilled.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.holeDiameter.name}
                    data-error={!!fields.holeDiameter.errors}
                  >
                    Hole Diameter
                  </Label>
                  <ControlledSelect
                    name={fields.holeDiameter.name}
                    items={[
                      { name: '6.5"', value: '6.5"' },
                      { name: '6.0"', value: '6.0"' },
                      { name: '5.5"', value: '5.5"' },
                      { name: '5.0"', value: '5.0"' },
                      { name: '4.5"', value: '4.5"' },
                      { name: '4.0"', value: '4.0"' },
                    ]}
                    placeholder="Select a hole diameter"
                    defaultValue={fields.holeDiameter.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.holeDiameter.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.depth.name}
                    data-error={!!fields.depth.errors}
                  >
                    Depth
                  </Label>
                  <Input
                    type="number"
                    key={fields.depth.key}
                    name={fields.depth.name}
                    defaultValue={fields.depth.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.depth.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.holesCovered.name}
                    data-error={!!fields.holesCovered.errors}
                  >
                    Holes Covered
                  </Label>
                  <ControlledRadioGroup
                    id={fields.holesCovered.id}
                    name={fields.holesCovered.name}
                    defaultValue={fields.holesCovered.defaultValue}
                    items={[
                      { value: "true", label: "Yes" },
                      { value: "false", label: "No" },
                    ]}
                  />
                  <p className="text-sm text-destructive">
                    {fields.holesCovered.errors}
                  </p>
                </div>

                <CardTitle>Hours</CardTitle>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.coverTapeLayout.name}
                    data-error={!!fields.coverTapeLayout.errors}
                  >
                    Cover Tape Layout
                  </Label>
                  <Input
                    type="number"
                    key={fields.coverTapeLayout.key}
                    name={fields.coverTapeLayout.name}
                    defaultValue={fields.coverTapeLayout.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.coverTapeLayout.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.tramHours.name}
                    data-error={!!fields.tramHours.errors}
                  >
                    Tram Hours
                  </Label>
                  <Input
                    type="number"
                    key={fields.tramHours.key}
                    name={fields.tramHours.name}
                    defaultValue={fields.tramHours.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.tramHours.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.repairs.name}
                    data-error={!!fields.repairs.errors}
                  >
                    Repairs
                  </Label>
                  <Input
                    type="number"
                    key={fields.repairs.key}
                    name={fields.repairs.name}
                    defaultValue={fields.repairs.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.repairs.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.repairRunTime.name}
                    data-error={!!fields.repairRunTime.errors}
                  >
                    Repair Run Time
                  </Label>
                  <Input
                    type="number"
                    key={fields.repairRunTime.key}
                    name={fields.repairRunTime.name}
                    defaultValue={fields.repairRunTime.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.repairRunTime.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.driveTime.name}
                    data-error={!!fields.driveTime.errors}
                  >
                    Drive Time
                  </Label>
                  <Input
                    type="number"
                    key={fields.driveTime.key}
                    name={fields.driveTime.name}
                    defaultValue={fields.driveTime.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.driveTime.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.shotStandBy.name}
                    data-error={!!fields.shotStandBy.errors}
                  >
                    Shot Stand By
                  </Label>
                  <Input
                    type="number"
                    key={fields.shotStandBy.key}
                    name={fields.shotStandBy.name}
                    defaultValue={fields.shotStandBy.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.shotStandBy.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.cleanOutHours.name}
                    data-error={!!fields.cleanOutHours.errors}
                  >
                    Clean Out Hours
                  </Label>
                  <Input
                    type="number"
                    key={fields.cleanOutHours.key}
                    name={fields.cleanOutHours.name}
                    defaultValue={fields.cleanOutHours.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.cleanOutHours.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.fuelServiceDrill.name}
                    data-error={!!fields.fuelServiceDrill.errors}
                  >
                    Fuel Service Drill
                  </Label>
                  <Input
                    type="number"
                    key={fields.fuelServiceDrill.key}
                    name={fields.fuelServiceDrill.name}
                    defaultValue={fields.fuelServiceDrill.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.fuelServiceDrill.errors}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label
                    className="data-[error=true]:text-destructive"
                    htmlFor={fields.other.name}
                    data-error={!!fields.other.errors}
                  >
                    Other
                  </Label>
                  <Input
                    type="text"
                    key={fields.other.key}
                    name={fields.other.name}
                    defaultValue={fields.other.initialValue}
                  />
                  <p className="text-sm text-destructive">
                    {fields.other.errors}
                  </p>
                </div>

                <Button type="submit" disabled={isPending}>
                  {isPending ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="outbox">
          <Outbox />
        </TabsContent>
      </Tabs>
    </div>
  );
}
