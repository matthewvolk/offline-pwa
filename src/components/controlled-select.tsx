"use client";

import { useControl } from "@conform-to/react/future";
import { type ComponentRef, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectProps = {
  id?: string;
  name: string;
  items: Array<{ name: string; value: string }>;
  placeholder: string;
  defaultValue?: string;
  ["aria-describedby"]?: string;
};

export function ControlledSelect({
  name,
  items,
  placeholder,
  defaultValue,
  ...props
}: SelectProps) {
  const selectRef = useRef<ComponentRef<typeof SelectTrigger>>(null);
  const control = useControl({
    defaultValue,
    onFocus() {
      selectRef.current?.focus();
    },
  });

  return (
    <>
      <input name={name} ref={control.register} hidden />
      <Select
        value={control.value}
        onValueChange={(value) => control.change(value)}
        onOpenChange={(open) => {
          if (!open) {
            control.blur();
          }
        }}
      >
        <SelectTrigger {...props} ref={selectRef}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => {
            return (
              <SelectItem key={item.value} value={item.value}>
                {item.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
}
