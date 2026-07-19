"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Sparkles } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

export default function Footer() {
  const { ref, isVisible } = useInView();

  return (
    <footer className="border-t border-border/70 bg-background/80 py-12" ref={ref}>
      <Container className={cn(
        "flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">CodeSense</p>
            <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
              AI-powered code review, your way.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
          <a
            href="https://github.com/singhayush20/codesense-frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all duration-300 hover:opacity-80 hover:scale-110"
          >
            <Image
              src="/github.png"
              alt="GitHub"
              width={40}
              height={40}
              className="inline-block"
            />
          </a>
          <span className="text-border" aria-hidden="true">/</span>
          <span>
            Built by{" "}
            <a
              href="https://www.ayushsinghtech.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground transition-all duration-300 hover:text-primary hover:underline"
            >
              Ayush Singh
            </a>
          </span>
        </div>
      </Container>
    </footer>
  );
}
