"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PageContainer } from "@/components/layout/PageContainer";
import { FormSection } from "@/components/onboarding/FormSection";
import { SkillsInput } from "@/components/onboarding/SkillsInput";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuthStore } from "@/lib/store/auth";
import { calcHustlerCompletion } from "@/lib/utils";

interface FormState {
  occupation: string;
  field: string;
  designation: string;
  skills: string[];
  experience: string;
  services: string;
  bio: string;
  availability: string;
  expectedRate: string;
}

const initialState: FormState = {
  occupation: "",
  field: "",
  designation: "",
  skills: [],
  experience: "",
  services: "",
  bio: "",
  availability: "",
  expectedRate: "",
};

const TOTAL_STEPS = 3;

export default function HustlerOnboardingPage() {
  const { ready } = useRequireAuth("hustler");
  const router = useRouter();

  const saveHustlerProfile = useAuthStore(
    (s) => s.saveHustlerProfile
  );

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);

  const completion = useMemo(
    () => calcHustlerCompletion(form),
    [form]
  );

  function update<K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) {
    setForm((f) => ({
      ...f,
      [key]: value,
    }));
  }

  /*
   * Profile information is OPTIONAL.
   *
   * We no longer block the user if fields are empty.
   */
  function handleNext() {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      return;
    }

    saveHustlerProfile(form);
    router.push("/dashboard/hustler");
  }

  /*
   * Skip the current onboarding step.
   *
   * Any information already entered is preserved.
   */
  function handleSkip() {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      return;
    }

    saveHustlerProfile(form);
    router.push("/dashboard/hustler");
  }

  function handleBack() {
    if (step > 1) {
      setStep((s) => s - 1);
    }
  }

  if (!ready) return null;

  return (
    <div className="min-h-screen glow-bg py-14">
      <PageContainer className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-soft">
            <Sparkles className="h-4 w-4" />
            Hustler profile
          </div>

          <h1 className="font-display text-3xl font-bold text-text-primary">
            Let&apos;s build your Hustle Profile.
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            You can complete this now or skip it and come back later.
          </p>

          <div className="mt-6">
            <ProgressBar
              value={completion}
              label="Your Hustle Profile"
            />
          </div>

          <div className="mt-2 flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i + 1 <= step
                    ? "bg-blue-primary"
                    : "bg-bg-card"
                }`}
              />
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-border-subtle bg-bg-card/60 p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{
                  opacity: 0,
                  x: 16,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -16,
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* STEP 1 */}
                {step === 1 && (
                  <FormSection
                    title="The basics"
                    description="What do you do, and where do you specialize?"
                  >
                    <Input
                      label="Occupation"
                      placeholder="e.g. Frontend Developer"
                      value={form.occupation}
                      onChange={(e) =>
                        update("occupation", e.target.value)
                      }
                    />

                    <Input
                      label="Field"
                      placeholder="e.g. Software Development"
                      value={form.field}
                      onChange={(e) =>
                        update("field", e.target.value)
                      }
                    />

                    <Input
                      label="Designation"
                      placeholder="e.g. Junior React Developer"
                      value={form.designation}
                      onChange={(e) =>
                        update("designation", e.target.value)
                      }
                      className="sm:col-span-2"
                    />
                  </FormSection>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <FormSection
                    title="Skills & services"
                    description="Show what you bring to the table."
                  >
                    <SkillsInput
                      value={form.skills}
                      onChange={(skills) =>
                        update("skills", skills)
                      }
                    />

                    <Select
                      label="Experience level"
                      placeholder="Select level"
                      value={form.experience}
                      onChange={(e) =>
                        update("experience", e.target.value)
                      }
                      options={[
                        {
                          value: "beginner",
                          label: "Just starting out",
                        },
                        {
                          value: "intermediate",
                          label: "1–3 years",
                        },
                        {
                          value: "experienced",
                          label: "3–6 years",
                        },
                        {
                          value: "expert",
                          label: "6+ years",
                        },
                      ]}
                    />

                    <Input
                      label="Services offered"
                      placeholder="e.g. Landing pages, dashboards"
                      value={form.services}
                      onChange={(e) =>
                        update("services", e.target.value)
                      }
                    />
                  </FormSection>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <FormSection
                    title="Availability & rate"
                    description="Help owners know when and how to reach you."
                  >
                    <Textarea
                      label="Short bio"
                      placeholder="A couple of sentences about who you are and what you're great at."
                      value={form.bio}
                      onChange={(e) =>
                        update("bio", e.target.value)
                      }
                      className="sm:col-span-2"
                      rows={3}
                    />

                    <Select
                      label="Availability"
                      placeholder="Select availability"
                      value={form.availability}
                      onChange={(e) =>
                        update("availability", e.target.value)
                      }
                      options={[
                        {
                          value: "full-time",
                          label: "Full-time",
                        },
                        {
                          value: "part-time",
                          label: "Part-time",
                        },
                        {
                          value: "weekends",
                          label: "Weekends only",
                        },
                        {
                          value: "flexible",
                          label: "Flexible",
                        },
                      ]}
                    />

                    <Input
                      label="Expected rate"
                      placeholder="e.g. $25/hr or $500/project"
                      value={form.expectedRate}
                      onChange={(e) =>
                        update(
                          "expectedRate",
                          e.target.value
                        )
                      }
                    />
                  </FormSection>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              variant="secondary"
              onClick={handleBack}
              disabled={step === 1}
              className={
                step === 1 ? "invisible" : ""
              }
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              {/* SKIP */}
              <Button
                variant="secondary"
                onClick={handleSkip}
              >
                Skip for now
              </Button>

              {/* NEXT / FINISH */}
              <Button onClick={handleNext}>
                {step === TOTAL_STEPS
                  ? "Finish setup"
                  : "Next"}

                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </PageContainer>
    </div>
  );
}