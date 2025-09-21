"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { NetworkStatus } from "@/components/network-status";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/dexie";

export function Outbox() {
  const forms = useLiveQuery(() =>
    db.equipmentForms.orderBy("submittedAt").reverse().toArray(),
  );

  const handleDelete = async (id: number) => {
    try {
      await db.equipmentForms.delete(id);
      toast.success("Form deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete form. Please try again.");
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (!forms) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Outbox</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center">
          <CardDescription>Loading forms...</CardDescription>
        </CardContent>
      </Card>
    );
  }

  if (forms.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Outbox</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center">
          <CardDescription>No submitted forms</CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Outbox</CardTitle>
          <NetworkStatus />
        </div>
        <CardDescription>
          {forms.length} form{forms.length !== 1 ? "s" : ""} pending sync
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {forms.map((form) => (
          <Card key={form.id} className="border-l-4 border-l-amber-400">
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle className="text-lg">
                  Truck #{form.truckNumber} - {form.drillNumber}
                </CardTitle>
                {/* @todo form synced status */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Form</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this form? This action
                        cannot be undone.{" "}
                        <strong>
                          Truck #{form.truckNumber} - {form.drillNumber}
                        </strong>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => form.id && handleDelete(form.id)}
                        className={buttonVariants({ variant: "destructive" })}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <CardDescription>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Operator:</span>{" "}
                    {form.operatorName}
                  </div>
                  <div>
                    <span className="font-medium">Submitted:</span>{" "}
                    {formatDate(form.submittedAt)}
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <span className="font-medium">Mileage:</span>{" "}
                  {form.stopMileage - form.startMileage} miles
                </div>
                <div>
                  <span className="font-medium">Shift:</span> {form.shiftStart}{" "}
                  - {form.shiftEnd}
                </div>
                <div>
                  <span className="font-medium">Hour Meter:</span>{" "}
                  {form.hourMeterEnd - form.hourMeterStart} hours
                </div>
                <div>
                  <span className="font-medium">Holes Drilled:</span>{" "}
                  {form.holesDrilled}
                </div>
                <div>
                  <span className="font-medium">Daily Footage:</span>{" "}
                  {form.dailyFootage}
                </div>
                <div>
                  <span className="font-medium">Hole Diameter:</span>{" "}
                  {form.holeDiameter}
                </div>
                <div>
                  <span className="font-medium">Per Diem:</span>{" "}
                  {form.perDiem ? "Yes" : "No"}
                </div>
                <div>
                  <span className="font-medium">Holes Covered:</span>{" "}
                  {form.holesCovered ? "Yes" : "No"}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
