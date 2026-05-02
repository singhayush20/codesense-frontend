"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { LandingPage } from "@/modules/landing/pages/LandingPage";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(routes.app.dashboard);
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return <LandingPage />;
}
