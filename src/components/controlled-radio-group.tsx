import { useControl } from "@conform-to/react/future";
import { useRef } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type RadioGroupProps = {
  id?: string;
  name: string;
  items: Array<{ value: string; label: string }>;
  defaultValue?: string;
  ["aria-describedby"]?: string;
};

export function ControlledRadioGroup({
  id,
  name,
  items,
  defaultValue,
  ["aria-describedby"]: ariaDescribedBy,
}: RadioGroupProps) {
  const radioGroupRef = useRef<React.ElementRef<typeof RadioGroup>>(null);
  const control = useControl({
    defaultValue,
    onFocus() {
      radioGroupRef.current?.focus();
    },
  });

  return (
    <>
      <input ref={control.register} name={name} hidden />
      <RadioGroup
        ref={radioGroupRef}
        className="flex items-center gap-4"
        value={control.value ?? ""}
        onValueChange={(value) => control.change(value)}
        onBlur={() => control.blur()}
        aria-labelledby={id}
      >
        {items.map((item) => {
          return (
            <div className="flex items-center gap-2" key={item.value}>
              <RadioGroupItem
                id={`${id}-${item.value}`}
                value={item.value}
                aria-describedby={ariaDescribedBy}
              />
              <label htmlFor={`${id}-${item.value}`}>{item.label}</label>
            </div>
          );
        })}
      </RadioGroup>
    </>
  );
}
