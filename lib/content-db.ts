import { prisma } from "@/lib/prisma";
import { seedPlanDays, seedQuestions } from "@/lib/content-seeds";
import type {
  ContentState,
} from "@/lib/content";
import type {
  MissionDayContent,
  MissionQuestionSetDefinition,
  PlanDayContent,
  Question
} from "@/lib/types";

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function normalizeQuestion(value: {
  id: string;
  section: string;
  domain: string;
  skill: string;
  difficulty: number;
  prompt: string;
  choices: unknown;
  answer: string;
  explanation: string;
  estimatedTimeSec: number;
  errorTags: unknown;
}): Question {
  return {
    id: value.id,
    section: value.section as Question["section"],
    domain: value.domain,
    skill: value.skill,
    difficulty: Math.max(1, Math.min(5, value.difficulty)) as Question["difficulty"],
    prompt: value.prompt,
    choices: normalizeStringArray(value.choices),
    answer: value.answer,
    explanation: value.explanation,
    estimatedTimeSec: value.estimatedTimeSec,
    errorTags: normalizeStringArray(value.errorTags)
  };
}

function normalizeMissionQuestionSets(value: unknown): MissionQuestionSetDefinition[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item !== "object" || item === null) {
        return null;
      }

      const record = item as Record<string, unknown>;

      return {
        stepId: typeof record.stepId === "string" ? record.stepId : "drill",
        introLabel: typeof record.introLabel === "string" ? record.introLabel : "Question set",
        questionIds: normalizeStringArray(record.questionIds)
      } satisfies MissionQuestionSetDefinition;
    })
    .filter((item): item is MissionQuestionSetDefinition => Boolean(item));
}

function normalizeMissionDayContent(value: unknown): MissionDayContent {
  const fallback = seedPlanDays[0].missionConfig;

  if (typeof value !== "object" || value === null) {
    return fallback;
  }

  const record = value as Record<string, unknown>;

  return {
    day: typeof record.day === "number" ? record.day : fallback.day,
    missionLabel:
      typeof record.missionLabel === "string" ? record.missionLabel : fallback.missionLabel,
    missionLengthLabel:
      typeof record.missionLengthLabel === "string"
        ? record.missionLengthLabel
        : fallback.missionLengthLabel,
    primaryFocusLabel:
      typeof record.primaryFocusLabel === "string"
        ? record.primaryFocusLabel
        : fallback.primaryFocusLabel,
    finishLineLabel:
      typeof record.finishLineLabel === "string"
        ? record.finishLineLabel
        : fallback.finishLineLabel,
    briefHeadline:
      typeof record.briefHeadline === "string" ? record.briefHeadline : fallback.briefHeadline,
    briefBody: typeof record.briefBody === "string" ? record.briefBody : fallback.briefBody,
    briefCards: Array.isArray(record.briefCards)
      ? record.briefCards
          .map((item) => {
            if (typeof item !== "object" || item === null) {
              return null;
            }

            const briefRecord = item as Record<string, unknown>;
            return {
              title:
                typeof briefRecord.title === "string"
                  ? briefRecord.title
                  : "Key point",
              detail:
                typeof briefRecord.detail === "string"
                  ? briefRecord.detail
                  : "Stay focused on the skill this day is training."
            };
          })
          .filter((item): item is MissionDayContent["briefCards"][number] => Boolean(item))
      : fallback.briefCards,
    completionHeadline:
      typeof record.completionHeadline === "string"
        ? record.completionHeadline
        : fallback.completionHeadline,
    completionBody:
      typeof record.completionBody === "string"
        ? record.completionBody
        : fallback.completionBody,
    steps: Array.isArray(record.steps)
      ? record.steps
          .map((item) => {
            if (typeof item !== "object" || item === null) {
              return null;
            }

            const stepRecord = item as Record<string, unknown>;
            return {
              id: typeof stepRecord.id === "string" ? stepRecord.id : "brief",
              type:
                typeof stepRecord.type === "string"
                  ? (stepRecord.type as MissionDayContent["steps"][number]["type"])
                  : "brief",
              title: typeof stepRecord.title === "string" ? stepRecord.title : "Mission step",
              durationMin:
                typeof stepRecord.durationMin === "number" ? stepRecord.durationMin : 5,
              detail: typeof stepRecord.detail === "string" ? stepRecord.detail : "",
              status:
                typeof stepRecord.status === "string"
                  ? (stepRecord.status as MissionDayContent["steps"][number]["status"])
                  : "up-next"
            };
          })
          .filter((item): item is MissionDayContent["steps"][number] => Boolean(item))
      : fallback.steps,
    questionSets: normalizeMissionQuestionSets(record.questionSets)
  };
}

function normalizePlanDay(value: {
  day: number;
  title: string;
  focus: string;
  missionType: string;
  duration: string;
  rationale: string;
  missionConfig: unknown;
}): PlanDayContent {
  return {
    day: value.day,
    title: value.title,
    focus: value.focus,
    missionType: value.missionType,
    duration: value.duration,
    rationale: value.rationale,
    missionConfig: normalizeMissionDayContent(value.missionConfig)
  };
}

export async function readContentFromDb(): Promise<ContentState> {
  const [questionRows, planDayRows] = await Promise.all([
    prisma.questionContent.findMany({
      where: { userProfileId: 1 },
      orderBy: [{ id: "asc" }]
    }),
    prisma.planDayContent.findMany({
      where: { userProfileId: 1 },
      orderBy: [{ day: "asc" }]
    })
  ]);

  if (questionRows.length === 0) {
    await prisma.questionContent.createMany({
      data: seedQuestions.map((question) => ({
        ...question,
        choices: question.choices,
        errorTags: question.errorTags,
        userProfileId: 1
      })),
      skipDuplicates: true
    });
  }

  if (planDayRows.length === 0) {
    await prisma.planDayContent.createMany({
      data: seedPlanDays.map((planDay) => ({
        day: planDay.day,
        title: planDay.title,
        focus: planDay.focus,
        missionType: planDay.missionType,
        duration: planDay.duration,
        rationale: planDay.rationale,
        missionConfig: planDay.missionConfig,
        userProfileId: 1
      })),
      skipDuplicates: true
    });
  }

  const questions = questionRows.length
    ? questionRows.map(normalizeQuestion)
    : seedQuestions;
  const planDays = planDayRows.length
    ? planDayRows.map(normalizePlanDay)
    : seedPlanDays;

  return {
    questions,
    planDays
  };
}

export async function upsertQuestionInDb(question: Question) {
  const saved = await prisma.questionContent.upsert({
    where: { id: question.id },
    update: {
      section: question.section,
      domain: question.domain,
      skill: question.skill,
      difficulty: question.difficulty,
      prompt: question.prompt,
      choices: question.choices,
      answer: question.answer,
      explanation: question.explanation,
      estimatedTimeSec: question.estimatedTimeSec,
      errorTags: question.errorTags
    },
    create: {
      ...question,
      choices: question.choices,
      errorTags: question.errorTags,
      userProfileId: 1
    }
  });

  return normalizeQuestion(saved);
}

export async function upsertPlanDayInDb(planDay: PlanDayContent) {
  const saved = await prisma.planDayContent.upsert({
    where: { day: planDay.day },
    update: {
      title: planDay.title,
      focus: planDay.focus,
      missionType: planDay.missionType,
      duration: planDay.duration,
      rationale: planDay.rationale,
      missionConfig: planDay.missionConfig
    },
    create: {
      day: planDay.day,
      title: planDay.title,
      focus: planDay.focus,
      missionType: planDay.missionType,
      duration: planDay.duration,
      rationale: planDay.rationale,
      missionConfig: planDay.missionConfig,
      userProfileId: 1
    }
  });

  return normalizePlanDay(saved);
}
