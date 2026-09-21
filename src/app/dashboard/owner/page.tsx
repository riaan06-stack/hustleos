"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, FilePlus2, Pencil } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState, LoadingState } from "@/components/ui/States";
import { ownerNav } from "@/components/layout/navConfig";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useOwnerProfile } from "@/lib/store/auth";
import { calcOwnerCompletion } from "@/lib/utils";

export default function OwnerDashboardPage() {
  const { ready, user } = useRequireAuth("owner");
  const profile = useOwnerProfile();
  const router = useRouter();

  useEffect(() => {
    if (ready && !profile) {
      router.replace("/onboarding/owner");
    }
  }, [ready, profile, router]);

  if (!ready || !profile) return <LoadingState label="Loading your dashboard…" />;

  const completion = calcOwnerCompletion(profile);

  return (
    <AppShell items={ownerNav}>
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
            {[profile.companyName, profile.industry].filter(Boolean).join(" · ") ||
              "Finish your company profile to get started."}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-semibold text-text-primary">
                  Company profile completion
                </h2>
                <Badge variant={completion === 100 ? "success" : "blue"}>
                  {completion === 100 ? "Complete" : "In progress"}
                </Badge>
              </div>
              <div className="mt-5">
                <ProgressBar value={completion} label="Your Company Profile" />
              </div>
              <p className="mt-4 text-sm text-text-secondary">
                {profile.description || "Add a short description to finish setting up."}
              </p>
              <div className="mt-4 flex justify-end">
                <Link href="/profile/owner">
                  <Button variant="secondary" size="sm">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit profile
                  </Button>
                </Link>
              </div>
            </Card>

            <Card>
              <h2 className="mb-4 font-display font-semibold text-text-primary">
                Find Hustlers
              </h2>
              <EmptyState
                icon={<Users className="h-5 w-5" />}
                title="Marketplace coming soon"
                description="Browsing Hustler profiles will be available in a future phase."
              />
            </Card>

            <Card>
              <h2 className="mb-4 font-display font-semibold text-text-primary">
                Post a Project
              </h2>
              <EmptyState
                icon={<FilePlus2 className="h-5 w-5" />}
                title="Project posting coming soon"
                description="You'll be able to describe work and get matched with Hustlers here."
              />
            </Card>

            <Card className="lg:col-span-2">
              <h2 className="mb-2 font-display font-semibold text-text-primary">
                Looking for
              </h2>
              <p className="text-sm text-text-secondary">
                {profile.freelancerRequirements ||
                  "Add what you're looking for to finish setting up."}
              </p>
            </Card>
          </div>
        </motion.div>
      </PageContainer>
    </AppShell>
  );
}