"use client";

import { useEffect, useRef, useState } from "react";
import type { SSEEvent } from "@/types/review-workflow";

export function useReviewRunEvents(runId: string | null) {
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!runId) return;

    const es = new EventSource(
      `/api/backend/api/v1/review-runs/${runId}/events`,
      {
        withCredentials: true,
      },
    );
    eventSourceRef.current = es;

    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);

    const handleMessage = (e: MessageEvent) => {
      try {
        const event = JSON.parse(e.data) as SSEEvent;
        setEvents((prev) => [...prev, event]);
      } catch {
        // ignore malformed events
      }
    };

    es.addEventListener("message", handleMessage);

    const eventTypes = [
      "STEP_STARTED",
      "STEP_COMPLETED",
      "STEP_FAILED",
      "RUN_COMPLETED",
      "RUN_FAILED",
      "RUN_CANCELLED",
      "RUN_SUPERSEDED",
      "HEARTBEAT",
    ] as const;

    for (const type of eventTypes) {
      es.addEventListener(type, (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          setEvents((prev) => [...prev, { type, data }]);
        } catch {
          // ignore
        }
      });
    }

    return () => {
      es.close();
      eventSourceRef.current = null;
      setConnected(false);
    };
  }, [runId]);

  return { events, connected };
}
