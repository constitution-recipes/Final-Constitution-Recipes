import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "./Input";

/**
 * 체크박스 컴포넌트
 */
const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

/**
 * 체크박스 항목 컴포넌트
 */
const CheckboxItem = React.forwardRef(({ id, label, ...props }, ref) => (
  <div className="flex items-center space-x-2">
    <Checkbox id={id} ref={ref} {...props} />
    <Label
      htmlFor={id}
      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {label}
    </Label>
  </div>
));
CheckboxItem.displayName = "CheckboxItem";

/**
 * 다중 선택 컴포넌트
 * 레이블, 체크박스 목록, 에러 메시지를 포함하는 컴포넌트
 */
const MultiSelect = React.forwardRef(({ label, options, value = [], onChange, error, ...props }, ref) => {
  const handleCheckboxChange = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-base">{label}</Label>}
      <div className="space-y-2">
        {options.map((option) => (
          <CheckboxItem
            key={option.value}
            id={`${props.id || 'checkbox'}-${option.value}`}
            label={option.label}
            checked={value.includes(option.value)}
            onCheckedChange={() => handleCheckboxChange(option.value)}
          />
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});
MultiSelect.displayName = "MultiSelect";

export { Checkbox, CheckboxItem, MultiSelect }; 