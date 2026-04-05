"use client";

import { useEffect, useState } from "react";
import { type ContentState } from "@/lib/content";
import { readClientContentState, subscribeToContentSync, syncContentFromServer } from "@/lib/content-client";
import { seedPlanDays, seedQuestions } from "@/lib/content-seeds";

export function useStudyContent() {
  const [content, setContent] = useState<ContentState>({
    questions: seedQuestions,
    planDays: seedPlanDays
  });

  useEffect(() => {
    function syncLocal() {
      setContent(readClientContentState());
    }

    syncLocal();
    void syncContentFromServer().then(setContent);
    return subscribeToContentSync(syncLocal);
  }, []);

  return content;
}
