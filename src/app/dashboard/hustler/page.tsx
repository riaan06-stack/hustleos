"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Compass,
  BookImage,
  Sparkles,
  ArrowUpRight,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/States";
import { LoadingState } from "@/components/ui/States";
import { hustlerNav } from "@/components/layout/navConfig";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useHustlerProfile } from "@/lib/store/auth";
import { calcHustlerCompletion, hustlerCompletionTagline } from "@/lib/utils";

export default function HustlerDashboardPage() {
  const { ready, user } = useRequireAuth("hustler");
  const profile = useHustlerProfile();
  const router = useRouter();

  useEffect(() => {
    if (ready && !profile) {
      router.replace("/onboarding/hustler");
    }
  }, [ready, profile, router]);

  if (!ready || !profile) return <LoadingState label="Loading your dashboard…" />;

  const completion = calcHustlerCompletion(profile);
  const tagline = hustlerCompletionTagline(completion);

  return (
    <AppShell items={hustlerNav}>
      <PageContainer className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
            Welcome back, {user?.name?.split(" ")[0]}.
          </h1>
          <p className="mt-1 text-text-secondary">
            Here&apos;s where your hustle stands today.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-semibold text-text-primary">
                  Profile completion
                </h2>
                <Badge variant={tagline ? "success" : "blue"}>
                  {tagline ? "Nearly there" : "In progress"}
                </Badge>
              </div>
              <div className="mt-5">
                <ProgressBar value={completion} label="Your Hustle Profile" />
              </div>
              {tagline && (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-blue-soft">
                  <Sparkles className="h-3.5 w-3.5" />
                  {tagline}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-text-secondary">
                  {profile.designation || profile.field
                    ? [profile.designation, profile.field].filter(Boolean).join(" · ")
                    : "Add your occupation and field to finish setting up."}
                </p>
                <Link href="/profile/hustler">
                  <Button variant="secondary" size="sm">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit profile
                  </Button>
                </Link>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <h2 className="font-display font-semibold text-text-primary">
                  Skills
                </h2>
                <Sparkles className="h-4 w-4 text-blue-soft" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.skills.length > 0 ? (
                  profile.skills.map((skill) => (
                    <Badge key={skill} variant="blue">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-text-secondary">
                    No skills added yet.
                  </p>
                )}
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <h2 className="font-display font-semibold text-text-primary">
                  Availability
                </h2>
                <ArrowUpRight className="h-4 w-4 text-text-secondary" />
              </div>
              <p className="mt-4 text-sm text-text-secondary">
                {profile.availability || profile.expectedRate ? (
                  <>
                    {profile.availability || "Not set"} · Expected rate:{" "}
                    <span className="text-text-primary">
                      {profile.expectedRate || "Not set"}
                    </span>
                  </>
                ) : (
                  "Add your availability and rate to finish setting up."
                )}
              </p>
            </Card>

            <Card className="lg:col-span-1">
              <h2 className="mb-4 font-display font-semibold text-text-primary">
                Portfolio
              </h2>
              <EmptyState
                icon={<BookImage className="h-5 w-5" />}
                title="No projects yet"
                description="Your portfolio will live here in a future phase."
              />
            </Card>

            <Card className="lg:col-span-1">
              <h2 className="mb-4 font-display font-semibold text-text-primary">
                Opportunities
              </h2>
              <EmptyState
                icon={<Compass className="h-5 w-5" />}
                title="Nothing to discover yet"
                description="Once the marketplace launches, matching work will show up here."
              />
            </Card>
          </div>
        </motion.div>
      </PageContainer>
    </AppShell>
  );
}