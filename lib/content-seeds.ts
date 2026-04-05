import {
  allMissionQuestions,
  appNav,
  dayPlan,
  dayRationales,
  getMissionDayConfig,
  marketingNav
} from "@/data/mock-data";
import type { NavItem, PlanDayContent, Question } from "@/lib/types";

export const seedMarketingNav: NavItem[] = marketingNav;
export const seedAppNav: NavItem[] = [...appNav, { href: "/app/admin", label: "Admin" }];
export const seedQuestions: Question[] = allMissionQuestions;
export const seedPlanDays: PlanDayContent[] = dayPlan.map((item) => {
  const missionConfig = getMissionDayConfig(item.day, item);

  return {
    ...item,
    rationale:
      dayRationales[item.day] ??
      "This day keeps the sequence understandable, measurable, and easy to continue tomorrow.",
    missionConfig: {
      ...missionConfig,
      questionSets: missionConfig.questionSets.map((set) => ({
        stepId: set.stepId,
        introLabel: set.introLabel,
        questionIds: set.questions.map((question) => question.id)
      }))
    }
  };
});
