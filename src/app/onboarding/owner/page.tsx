"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PageContainer } from "@/components/layout/PageContainer";
import { FormSection } from "@/components/onboarding/FormSection";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuthStore } from "@/lib/store/auth";
import { calcOwnerCompletion } from "@/lib/utils";

interface FormState {
  companyName: string;
  industry: string;
  designation: string;
  description: string;
  website: string;
  freelancerRequirements: string;
}

const initialState: FormState = {
  companyName: "",
  industry: "",
  designation: "",
  description: "",
  website: "",
  freelancerRequirements: "",
};

const TOTAL_STEPS = 2;

export default function OwnerOnboardingPage() {
  const { ready } = useRequireAuth("owner");
  const router = useRouter();
  const saveOwnerProfile = useAuthStore((s) => s.saveOwnerProfile);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  const completion = useMemo(() => calcOwnerCompletion(form), [form]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validateStep(): boolean {
    const errors: Record<string, string> = {};
    if (step === 1) {
      if (!form.companyName.trim()) errors.companyName = "Required";
      if (!form.industry.trim()) errors.industry = "Required";
      if (!form.designation.trim()) errors.designation = "Required";
    } else if (step === 2) {
      if (!form.description.trim()) errors.description = "Required";
      if (!form.freelancerRequirements.trim())
        errors.freelancerRequirements = "Required";
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleNext() {
    if (!validateStep()) return;
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      saveOwnerProfile({
        companyName: form.companyName,
        industry: form.industry,
        designation: form.designation,
        description: form.description,
        website: form.website || undefined,
        freelancerRequirements: form.freelancerRequirements,
      });
      router.push("/dashboard/owner");
    }
  }

  function handleBack() {
    if (step > 1) setStep((s) => s - 1);
  }

  if (!ready) return null;

  return (
    <div className="min-h-screen glow-bg py-14">
      <PageContainer className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-soft">
            <Briefcase className="h-4 w-4" />
            Owner profile
          </div>
          <h1 className="font-display text-3xl font-bold text-text-primary">
            Tell us about your work.
          </h1>

          <div className="mt-6">
            <ProgressBar value={completion} label="Your Company Profile" />
          </div>

          <div className="mt-2 flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i + 1 <= step ? "bg-blue-primary" : "bg-bg-card"
                }`}
              />
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-border-subtle bg-bg-card/60 p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {step === 1 && (
                  <FormSection
                    title="Your company"
                    description="Just enough for Hustlers to know who they'd be working with."
                  >
                    <Input
                      label="Company / business name"
                      required
                      placeholder="e.g. Northbeam Studio"
                      value={form.companyName}
                      onChange={(e) => update("companyName", e.target.value)}
                      error={stepErrors.companyName}
                    />
                    <Input
                      label="Industry"
                      required
                      placeholder="e.g. E-commerce, Fintech"
                      value={form.industry}
                      onChange={(e) => update("industry", e.target.value)}
                      error={stepErrors.industry}
                    />
                    <Input
                      label="Your designation"
                      required
                      placeholder="e.g. Founder, Operations Lead"
                      value={form.designation}
                      onChange={(e) => update("designation", e.target.value)}
                      error={stepErrors.designation}
                    />
                    <Input
                      label="Website"
                      placeholder="https://yourcompany.com"
                      value={form.website}
                      onChange={(e) => update("website", e.target.value)}
                    />
                  </FormSection>
                )}

                {step === 2 && (
                  <FormSection
                    title="What you need"
                    description="Help us understand what kind of help you're looking for."
                  >
                    <Textarea
                      label="Short description"
                      required
                      placeholder="What does your company do?"
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                      error={stepErrors.description}
                      className="sm:col-span-2"
                      rows={3}
                    />
                    <Textarea
                      label="What type of freelancers are you looking for?"
                      required
                      placeholder="e.g. Product designers with fintech experience"
                      value={form.freelancerRequirements}
                      onChange={(e) =>
                        update("freelancerRequirements", e.target.value)
                      }
                      error={stepErrors.freelancerRequirements}
                      className="sm:col-span-2"
                      rows={3}
                    />
                  </FormSection>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              variant="secondary"
              onClick={handleBack}
              disabled={step === 1}
              className={step === 1 ? "invisible" : ""}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext}>
              {step === TOTAL_STEPS ? "Finish setup" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </PageContainer>
    </div>
  );
}
