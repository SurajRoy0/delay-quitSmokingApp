"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Check } from "lucide-react";
import { ButtonLoader } from "@/components/button-loader";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUpdateUserProfile } from "@/hooks/use-smoking";
import { DurationPicker, rawMinuteOptions } from "@/components/duration-picker";

const minGap = rawMinuteOptions[0];

const schema = z.object({
  dailyCigarettes: z.coerce
    .number()
    .int()
    .min(1, "At least 1")
    .max(200, "Max 200"),
  cigarettePrice: z.coerce.number().positive("Must be greater than 0"),
  currency: z.enum(["INR", "USD", "EUR", "GBP"]),
  defaultGapTargetMinutes: z.coerce.number().int().min(minGap, `Must be at least ${minGap} minutes`),
});

type FormValues = z.output<typeof schema>;

const GAP_OPTIONS = [
  { label: "1 hour", value: 60 },
  { label: "2 hours", value: 120 },
  { label: "4 hours (recommended)", value: 240 },
  { label: "6 hours", value: 360 },
  { label: "8 hours", value: 480 },
  { label: "Custom...", value: -1 },
];

const CURRENCY_OPTIONS: { label: string; value: "INR" | "USD" | "EUR" | "GBP" }[] = [
  { label: "₹ INR", value: "INR" },
  { label: "$ USD", value: "USD" },
  { label: "€ EUR", value: "EUR" },
  { label: "£ GBP", value: "GBP" },
];

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: {
    dailyCigarettes: number;
    pricePerCigarette: number;
    currency: "INR" | "USD" | "EUR" | "GBP";
    defaultGapTargetMinutes: number;
  };
}

export function EditProfileModal({
  open,
  onOpenChange,
  initialValues,
}: EditProfileModalProps) {
  const router = useRouter();
  const { mutateAsync: updateProfile, isPending } = useUpdateUserProfile();
  
  // Detect if initial value is custom or preset
  const isPresetInitial = [60, 120, 240, 360, 480].includes(
    initialValues.defaultGapTargetMinutes
  );
  const [isCustom, setIsCustom] = useState(!isPresetInitial);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      dailyCigarettes: initialValues.dailyCigarettes,
      cigarettePrice: initialValues.pricePerCigarette,
      currency: initialValues.currency,
      defaultGapTargetMinutes: initialValues.defaultGapTargetMinutes,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await updateProfile(values);
      toast.success("Profile settings updated successfully!");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[2rem] bg-card border border-border shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-2">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Edit Smoking Profile
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Update your baseline cigarettes, price per single cigarette, currency, or preferred gap goal.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-2"
          >
            {/* Daily cigarettes */}
            <FormField
              control={form.control}
              name="dailyCigarettes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Daily Cigarettes</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={200}
                      className="bg-background border-border rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price + currency row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cigarettePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Price per single</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0.01}
                        step={0.01}
                        className="bg-background border-border rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/50 dark:bg-black/50 border-white/20 dark:border-white/10 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl bg-popover border-border">
                        {CURRENCY_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} className="rounded-lg">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Target gap */}
            <FormField
              control={form.control}
              name="defaultGapTargetMinutes"
              render={({ field }) => {
                const isPreset = [60, 120, 240, 360, 480].includes(field.value);
                const selectValue = isCustom || !isPreset ? "-1" : String(field.value);

                return (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-xs font-semibold">Default Gap Target</FormLabel>
                    <Select
                      onValueChange={(v) => {
                        const val = parseInt(v, 10);
                        if (val === -1) {
                          setIsCustom(true);
                          if (isPreset) {
                            field.onChange(240); // default custom
                          }
                        } else {
                          setIsCustom(false);
                          field.onChange(val);
                        }
                      }}
                      value={selectValue}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/50 dark:bg-black/50 border-white/20 dark:border-white/10 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl bg-popover border-border">
                        {GAP_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={String(opt.value)} className="rounded-lg">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />

                    {(isCustom || !isPreset) && (
                      <div className="mt-2 p-3 rounded-2xl bg-muted/20 border border-border/30 animate-in fade-in slide-in-from-top-1 duration-200">
                        <DurationPicker
                          value={field.value}
                          onChange={(mins) => field.onChange(mins)}
                        />
                      </div>
                    )}
                  </FormItem>
                );
              }}
            />

            <div className="flex gap-3 mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="flex-1 rounded-full h-11 border border-border/40 font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 rounded-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md transition-all active:scale-95"
              >
                {isPending ? (
                  <ButtonLoader className="mr-2" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
