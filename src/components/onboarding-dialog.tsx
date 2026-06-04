"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Cigarette } from "lucide-react";

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
import { completeOnboarding } from "@/actions/onboarding";

const schema = z.object({
  dailyCigarettes: z.coerce
    .number()
    .int()
    .min(1, "At least 1")
    .max(200, "Max 200"),
  cigarettePrice: z.coerce.number().positive("Must be greater than 0"),
  currency: z.enum(["INR", "USD", "EUR", "GBP"]),
  defaultGapTargetMinutes: z.coerce.number().int().min(30),
});

type FormValues = z.output<typeof schema>;

const GAP_OPTIONS = [
  { label: "1 hour", value: 60 },
  { label: "2 hours", value: 120 },
  { label: "4 hours (recommended)", value: 240 },
  { label: "6 hours", value: 360 },
  { label: "8 hours", value: 480 },
];

const CURRENCY_OPTIONS: { label: string; value: "INR" | "USD" | "EUR" | "GBP" }[] = [
  { label: "₹ INR", value: "INR" },
  { label: "$ USD", value: "USD" },
  { label: "€ EUR", value: "EUR" },
  { label: "£ GBP", value: "GBP" },
];

interface OnboardingDialogProps {
  open: boolean;
  onComplete: () => void;
}

export function OnboardingDialog({ open, onComplete }: OnboardingDialogProps) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      dailyCigarettes: 10,
      cigarettePrice: 20,
      currency: "INR",
      defaultGapTargetMinutes: 240,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: FormValues) {
    const result = await completeOnboarding(values);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    toast.success("All set! Let's begin your journey.");
    onComplete();
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      // Prevent closing by clicking outside — must complete onboarding
      onOpenChange={() => {}}
    >
      <DialogContent
        className="sm:max-w-md rounded-[2rem] bg-card border border-border shadow-lg p-6 overflow-hidden"
        // Remove the default close button
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-left space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ember-1 to-ember-2 flex items-center justify-center shrink-0 shadow-sm">
              <Cigarette className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
              Tell us about yourself
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed pt-2">
            This helps us calculate how much you&apos;re saving and set a
            realistic first goal. You can update these anytime.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 mt-4"
          >
            {/* Daily cigarettes */}
            <FormField
              control={form.control}
              name="dailyCigarettes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">How many cigarettes do you smoke per day?</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={200}
                      placeholder="e.g. 10"
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
                    <FormLabel className="text-sm font-semibold">Price per cigarette</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0.01}
                        step={0.01}
                        placeholder="e.g. 20"
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
                    <FormLabel className="text-sm font-semibold">Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">What&apos;s your first gap target?</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(parseInt(v, 10))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/50 dark:bg-black/50 border-white/20 dark:border-white/10 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl bg-white/90 dark:bg-black/90 backdrop-blur-xl border-border/50">
                      {GAP_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={String(opt.value)} className="rounded-lg">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md transition-all active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving…
                </>
              ) : (
                "Start my journey"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
