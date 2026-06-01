import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthFieldProps = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
};

export function AuthField({
  label,
  name,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
}: AuthFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name} className="text-muted-foreground">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        className="bg-background/60"
      />
    </div>
  );
}
