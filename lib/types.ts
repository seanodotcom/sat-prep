export type NavItem = {
  href: string;
  label: string;
};

export type MissionStep = {
  id: string;
  type: "brief" | "drill" | "mini-test" | "review";
  title: string;
  durationMin: number;
  detail: string;
  status: "up-next" | "active" | "complete";
};

export type Question = {
  id: string;
  section: "Math" | "Reading & Writing";
  domain: string;
  skill: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  prompt: string;
  choices: string[];
  answer: string;
  explanation: string;
  estimatedTimeSec: number;
  errorTags: string[];
};

export type MissionQuestionSet = {
  stepId: string;
  introLabel: string;
  questions: Question[];
};

export type MissionBriefCard = {
  title: string;
  detail: string;
};

export type MissionDayConfig = {
  day: number;
  missionLabel: string;
  missionLengthLabel: string;
  primaryFocusLabel: string;
  finishLineLabel: string;
  briefHeadline: string;
  briefBody: string;
  briefCards: MissionBriefCard[];
  completionHeadline: string;
  completionBody: string;
  steps: MissionStep[];
  questionSets: MissionQuestionSet[];
};

export type DayPlan = {
  day: number;
  title: string;
  focus: string;
  missionType: string;
  duration: string;
  status?: "complete" | "current" | "upcoming";
};

export type RewardBadge = {
  id: string;
  title: string;
  detail: string;
  earned: boolean;
  category: "streak" | "review" | "mastery" | "checkpoint";
};

export type SkillMetric = {
  skill: string;
  accuracy: number;
  avgTimeSec: number;
  backlog: number;
  trend: "up" | "down" | "steady";
};

export type DashboardStats = {
  streakDays: number;
  xp: number;
  weeklyCompletion: number;
  questionsSolved: number;
  readinessGain: number;
};

export type ReviewItem = {
  id: string;
  prompt: string;
  skill: string;
  errorType: string;
  lastSeen: string;
  section: string;
  retryReady: boolean;
};

export type SessionReviewItem = {
  id: string;
  prompt: string;
  skill: string;
  section: string;
  source: "missed" | "flagged";
  status: "ready" | "new";
};
