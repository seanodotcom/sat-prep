import {
  type DayPlan,
  type MissionDayConfig,
  type MissionQuestionSet,
  type MissionStep,
  type NavItem,
  type Question,
  type ReviewItem
} from "@/lib/types";

export const marketingNav: NavItem[] = [
  { href: "#today", label: "Today" },
  { href: "#setup", label: "Setup" },
  { href: "#plan", label: "30-Day Plan" }
];

export const appNav: NavItem[] = [
  { href: "/app", label: "Today" },
  { href: "/app/plan", label: "Plan" },
  { href: "/app/mission", label: "Mission" },
  { href: "/app/review", label: "Review" },
  { href: "/app/history", label: "History" },
  { href: "/app/analytics", label: "Analytics" },
  { href: "/app/rewards", label: "Rewards" }
];

export const missionSteps: MissionStep[] = [
  {
    id: "brief",
    type: "brief",
    title: "Mission Brief",
    durationMin: 2,
    detail: "Focus on eliminating setup errors in linear systems before speed kicks in.",
    status: "complete"
  },
  {
    id: "drill",
    type: "drill",
    title: "Targeted Drill",
    durationMin: 7,
    detail: "5 algebra items tagged for substitution, elimination, and variable isolation.",
    status: "active"
  },
  {
    id: "mini",
    type: "mini-test",
    title: "Timed Mini-Test",
    durationMin: 6,
    detail: "6 mixed questions under light pressure to train pacing without burnout.",
    status: "up-next"
  },
  {
    id: "review",
    type: "review",
    title: "Mistake Review",
    durationMin: 4,
    detail: "Retry yesterday's transition and punctuation misses before they harden.",
    status: "up-next"
  }
];

export const featuredQuestions: Question[] = [
  {
    id: "q_math_01",
    section: "Math",
    domain: "Algebra",
    skill: "Linear systems",
    difficulty: 3,
    prompt:
      "If 2x + y = 11 and x - y = 1, what is the value of x?",
    choices: ["3", "4", "5", "6"],
    answer: "4",
    explanation: "Add the equations to eliminate y, giving 3x = 12 and x = 4.",
    estimatedTimeSec: 70,
    errorTags: ["Process Error", "Careless Accuracy"]
  },
  {
    id: "q_rw_01",
    section: "Reading & Writing",
    domain: "Grammar",
    skill: "Sentence boundaries",
    difficulty: 2,
    prompt:
      "The research team finalized the data set, however the visual summary still needed revisions. Which choice best revises the sentence?",
    choices: [
      "NO CHANGE",
      "set; however, the visual summary",
      "set however the visual summary",
      "set, however; the visual summary"
    ],
    answer: "set; however, the visual summary",
    explanation:
      "A semicolon correctly joins two independent clauses, and the conjunctive adverb is set off by a comma.",
    estimatedTimeSec: 55,
    errorTags: ["Concept Gap", "Trap Choice"]
  },
  {
    id: "q_math_03",
    section: "Math",
    domain: "Algebra",
    skill: "Substitution strategy",
    difficulty: 3,
    prompt:
      "If y = 2x + 4 and 4x + y = 22, what is the value of x?",
    choices: ["3", "4", "5", "6"],
    answer: "3",
    explanation:
      "Substitute 2x + 4 for y: 4x + 2x + 4 = 22, so 6x = 18 and x = 3.",
    estimatedTimeSec: 65,
    errorTags: ["Process Error", "Substitution"]
  },
  {
    id: "q_math_04",
    section: "Math",
    domain: "Algebra",
    skill: "Elimination",
    difficulty: 3,
    prompt:
      "For the system 5x + 2y = 18 and 5x - 2y = 6, what is the value of x?",
    choices: ["2", "2.4", "3", "4"],
    answer: "2.4",
    explanation:
      "Add the equations to eliminate y: 10x = 24, so x = 2.4.",
    estimatedTimeSec: 60,
    errorTags: ["Careless Accuracy", "Process Error"]
  },
  {
    id: "q_rw_03",
    section: "Reading & Writing",
    domain: "Grammar",
    skill: "Concision",
    difficulty: 2,
    prompt:
      "The coach repeated the key instruction again before the scrimmage began. Which revision is most concise?",
    choices: [
      "repeated the key instruction again",
      "repeated again the key instruction",
      "repeated the key instruction",
      "did repeat the key instruction again"
    ],
    answer: "repeated the key instruction",
    explanation:
      "The word 'again' is redundant because 'repeated' already includes that meaning.",
    estimatedTimeSec: 45,
    errorTags: ["Concision", "Trap Choice"]
  },
  {
    id: "q_rw_04",
    section: "Reading & Writing",
    domain: "Grammar",
    skill: "Sentence boundaries",
    difficulty: 3,
    prompt:
      "The exhibit opened late, the crowd still filled the gallery within minutes. Which choice best revises the sentence?",
    choices: [
      "opened late, the crowd still filled",
      "opened late; the crowd still filled",
      "opened late the crowd still filled",
      "opened late: and the crowd still filled"
    ],
    answer: "opened late; the crowd still filled",
    explanation:
      "A semicolon correctly joins two closely related independent clauses.",
    estimatedTimeSec: 55,
    errorTags: ["Sentence Boundaries", "Concept Gap"]
  },
  {
    id: "q_math_07",
    section: "Math",
    domain: "Algebra",
    skill: "Linear systems",
    difficulty: 4,
    prompt:
      "If x + 3y = 19 and 2x - y = 7, what is the value of y?",
    choices: ["2", "3", "4", "5"],
    answer: "4",
    explanation:
      "From 2x - y = 7, y = 2x - 7. Substitute into x + 3y = 19 to get x + 6x - 21 = 19, so 7x = 40 and y = 4.",
    estimatedTimeSec: 75,
    errorTags: ["Process Error", "Systems Setup"]
  },
  {
    id: "q_rw_07",
    section: "Reading & Writing",
    domain: "Grammar",
    skill: "Transitions",
    difficulty: 3,
    prompt:
      "The sample size was smaller than expected; _____, the findings were treated as preliminary rather than final.",
    choices: ["therefore", "meanwhile", "likewise", "for example"],
    answer: "therefore",
    explanation:
      "The second clause follows logically from the first, so a cause-and-effect transition is needed.",
    estimatedTimeSec: 45,
    errorTags: ["Logic Link", "Trap Choice"]
  },
  {
    id: "q_math_08",
    section: "Math",
    domain: "Algebra",
    skill: "Variable isolation",
    difficulty: 3,
    prompt:
      "If 4x + y = 25 and y = 9, what is the value of x?",
    choices: ["3", "4", "5", "6"],
    answer: "4",
    explanation:
      "Substitute 9 for y to get 4x + 9 = 25. Then 4x = 16, so x = 4.",
    estimatedTimeSec: 35,
    errorTags: ["Careless Accuracy", "Substitution"]
  }
];

export const miniTestQuestions: Question[] = [
  {
    id: "q_math_02",
    section: "Math",
    domain: "Algebra",
    skill: "Systems under time",
    difficulty: 4,
    prompt:
      "A student solves the system 3x + y = 17 and y = x + 1. What is the value of x?",
    choices: ["3", "4", "5", "6"],
    answer: "4",
    explanation:
      "Substitute y = x + 1 into 3x + y = 17 to get 3x + x + 1 = 17. Then 4x = 16, so x = 4.",
    estimatedTimeSec: 50,
    errorTags: ["Process Error", "Time Pressure"]
  },
  {
    id: "q_rw_02",
    section: "Reading & Writing",
    domain: "Grammar",
    skill: "Transitions",
    difficulty: 3,
    prompt:
      "Maya finished her outline early; _____, she used the extra time to sharpen her conclusion.",
    choices: ["however", "therefore", "for example", "nevertheless"],
    answer: "therefore",
    explanation:
      "The second clause is a result of finishing early, so 'therefore' is the clearest logical transition.",
    estimatedTimeSec: 40,
    errorTags: ["Trap Choice", "Logic Link"]
  },
  {
    id: "q_math_05",
    section: "Math",
    domain: "Algebra",
    skill: "Systems under time",
    difficulty: 4,
    prompt:
      "If 2x + 3y = 19 and x + y = 7, what is the value of y?",
    choices: ["3", "4", "5", "6"],
    answer: "5",
    explanation:
      "From x + y = 7, x = 7 - y. Substitute to get 2(7 - y) + 3y = 19, so 14 + y = 19 and y = 5.",
    estimatedTimeSec: 55,
    errorTags: ["Time Pressure", "Substitution"]
  },
  {
    id: "q_math_06",
    section: "Math",
    domain: "Algebra",
    skill: "Systems under time",
    difficulty: 4,
    prompt:
      "A system has equations x + 2y = 11 and 3x - 2y = 9. What is the value of x?",
    choices: ["4", "5", "6", "7"],
    answer: "5",
    explanation:
      "Add the equations to eliminate y: 4x = 20, so x = 5.",
    estimatedTimeSec: 45,
    errorTags: ["Elimination", "Time Pressure"]
  },
  {
    id: "q_rw_05",
    section: "Reading & Writing",
    domain: "Grammar",
    skill: "Transitions",
    difficulty: 3,
    prompt:
      "The data set was incomplete; _____, the team delayed publication until the missing results arrived.",
    choices: ["instead", "therefore", "meanwhile", "likewise"],
    answer: "therefore",
    explanation:
      "The team delayed publication because the data set was incomplete, so a cause-and-effect transition fits best.",
    estimatedTimeSec: 40,
    errorTags: ["Logic Link", "Trap Choice"]
  },
  {
    id: "q_rw_06",
    section: "Reading & Writing",
    domain: "Grammar",
    skill: "Punctuation",
    difficulty: 3,
    prompt:
      "The lecture covered mitosis, meiosis, and gene regulation _____ it did not include a lab demonstration.",
    choices: [", and", "; but", "but,", ": but"],
    answer: "; but",
    explanation:
      "A semicolon can join related independent clauses, and 'but' shows the contrast.",
    estimatedTimeSec: 50,
    errorTags: ["Punctuation", "Sentence Boundaries"]
  },
  {
    id: "q_math_09",
    section: "Math",
    domain: "Algebra",
    skill: "Systems under time",
    difficulty: 4,
    prompt:
      "If y = 3x - 2 and x + y = 14, what is the value of x?",
    choices: ["3", "4", "5", "6"],
    answer: "4",
    explanation:
      "Substitute 3x - 2 for y to get x + 3x - 2 = 14. Then 4x = 16, so x = 4.",
    estimatedTimeSec: 48,
    errorTags: ["Time Pressure", "Substitution"]
  },
  {
    id: "q_rw_08",
    section: "Reading & Writing",
    domain: "Grammar",
    skill: "Concision",
    difficulty: 2,
    prompt:
      "The committee members collaborated together on the final recommendation. Which revision is most concise?",
    choices: [
      "collaborated together on",
      "collaborated on",
      "did collaborate together on",
      "worked collaboratively together on"
    ],
    answer: "collaborated on",
    explanation:
      "The word 'collaborated' already implies working together, so 'together' is redundant.",
    estimatedTimeSec: 42,
    errorTags: ["Concision", "Redundancy"]
  },
  {
    id: "q_rw_09",
    section: "Reading & Writing",
    domain: "Grammar",
    skill: "Sentence boundaries",
    difficulty: 4,
    prompt:
      "The proposal seemed ambitious, the reviewers still approved the first phase. Which choice best revises the sentence?",
    choices: [
      "ambitious, the reviewers still approved",
      "ambitious; the reviewers still approved",
      "ambitious the reviewers still approved",
      "ambitious; and the reviewers still approved"
    ],
    answer: "ambitious; the reviewers still approved",
    explanation:
      "A semicolon correctly joins two independent clauses without adding an unnecessary conjunction.",
    estimatedTimeSec: 52,
    errorTags: ["Sentence Boundaries", "Concept Gap"]
  }
];

export const dayOneDrillQuestions: Question[] = [
  featuredQuestions[0],
  featuredQuestions[1],
  featuredQuestions[2],
  featuredQuestions[4],
  featuredQuestions[6]
];

export const dayOneMiniTestQuestions: Question[] = [
  miniTestQuestions[0],
  miniTestQuestions[1],
  miniTestQuestions[2],
  miniTestQuestions[4],
  miniTestQuestions[6]
];

export const dayTwoDrillQuestions: Question[] = [
  featuredQuestions[0],
  featuredQuestions[2],
  featuredQuestions[3],
  featuredQuestions[8]
];

export const dayTwoMiniTestQuestions: Question[] = [
  miniTestQuestions[0],
  miniTestQuestions[2],
  miniTestQuestions[3],
  miniTestQuestions[6]
];

export const dayThreeDrillQuestions: Question[] = [
  featuredQuestions[1],
  featuredQuestions[4],
  featuredQuestions[5],
  featuredQuestions[7]
];

export const dayThreeMiniTestQuestions: Question[] = [
  miniTestQuestions[1],
  miniTestQuestions[4],
  miniTestQuestions[5],
  miniTestQuestions[7],
  miniTestQuestions[8]
];

export const missionQuestionSets: MissionQuestionSet[] = [
  {
    stepId: "drill",
    introLabel: "Targeted drill set",
    questions: featuredQuestions
  },
  {
    stepId: "mini",
    introLabel: "Timed mini-test set",
    questions: miniTestQuestions
  }
];

export const allMissionQuestions: Question[] = [...featuredQuestions, ...miniTestQuestions];

const dayOneMissionSteps: MissionStep[] = [
  {
    id: "brief",
    type: "brief",
    title: "Mission Brief",
    durationMin: 2,
    detail: "Get oriented, understand the daily loop, and start with a mixed warm-up set.",
    status: "complete"
  },
  {
    id: "drill",
    type: "drill",
    title: "Targeted Drill",
    durationMin: 8,
    detail: "4 mixed calibration items to settle in without overcomplicating the first day.",
    status: "active"
  },
  {
    id: "mini",
    type: "mini-test",
    title: "Timed Mini-Test",
    durationMin: 5,
    detail: "4 mixed follow-ups with light pacing pressure to make the flow feel real.",
    status: "up-next"
  },
  {
    id: "review",
    type: "review",
    title: "Mistake Review",
    durationMin: 4,
    detail: "Close Day 1 by reviewing anything you missed or flagged before tomorrow.",
    status: "up-next"
  }
];

const dayTwoMissionSteps: MissionStep[] = [
  {
    id: "brief",
    type: "brief",
    title: "Mission Brief",
    durationMin: 2,
    detail: "Shift from orientation to algebra execution, with cleaner setup and quicker decisions.",
    status: "complete"
  },
  {
    id: "drill",
    type: "drill",
    title: "Targeted Drill",
    durationMin: 9,
    detail: "3 systems-of-equations reps focused on substitution, elimination, and setup accuracy.",
    status: "active"
  },
  {
    id: "mini",
    type: "mini-test",
    title: "Timed Mini-Test",
    durationMin: 6,
    detail: "3 algebra items under tighter pace pressure so speed does not break the method.",
    status: "up-next"
  },
  {
    id: "review",
    type: "review",
    title: "Mistake Review",
    durationMin: 4,
    detail: "Capture and revisit any algebra misses before they become a pattern.",
    status: "up-next"
  }
];

const dayThreeMissionSteps: MissionStep[] = [
  {
    id: "brief",
    type: "brief",
    title: "Mission Brief",
    durationMin: 2,
    detail: "Move into grammar control, with extra attention on punctuation and sentence boundaries.",
    status: "complete"
  },
  {
    id: "drill",
    type: "drill",
    title: "Targeted Drill",
    durationMin: 8,
    detail: "3 grammar reps to lock in sentence boundaries, concision, and clause control.",
    status: "active"
  },
  {
    id: "mini",
    type: "mini-test",
    title: "Timed Mini-Test",
    durationMin: 5,
    detail: "3 Reading & Writing questions with a faster clock and less margin for hesitation.",
    status: "up-next"
  },
  {
    id: "review",
    type: "review",
    title: "Mistake Review",
    durationMin: 4,
    detail: "Clean up any transition or punctuation misses before moving on.",
    status: "up-next"
  }
];

export const missionDayConfigs: MissionDayConfig[] = [
  {
    day: 1,
    missionLabel: "Day 1 launch",
    missionLengthLabel: "19 min",
    primaryFocusLabel: "Mixed warm-up",
    finishLineLabel: "Full flow complete",
    briefHeadline: "Start simple and learn the loop",
    briefBody:
      "Day 1 is about learning how this app works without making the first session feel heavy. Start with a mixed drill, answer a short timed block, and finish by cleaning up anything that needs one more look.",
    briefCards: [
      {
        title: "What to watch",
        detail: "Notice the rhythm more than the score: brief, drill, timed check, then review."
      },
      {
        title: "What's next",
        detail: "Start with mixed reps so both Math and Reading & Writing feel represented on day one."
      },
      {
        title: "What counts",
        detail: "Anything missed or flagged rolls straight into review, so the mission ends with a clean handoff."
      }
    ],
    completionHeadline: "Day 1 is in the books",
    completionBody:
      "You've completed the full mission loop once. Tomorrow tightens the focus so the routine feels less like setup and more like training.",
    steps: dayOneMissionSteps,
    questionSets: [
      {
        stepId: "drill",
        introLabel: "Day 1 mixed drill",
        questions: dayOneDrillQuestions
      },
      {
        stepId: "mini",
        introLabel: "Day 1 mixed mini-test",
        questions: dayOneMiniTestQuestions
      }
    ]
  },
  {
    day: 2,
    missionLabel: "Day 2 algebra lock-in",
    missionLengthLabel: "21 min",
    primaryFocusLabel: "Systems accuracy",
    finishLineLabel: "Math review queue",
    briefHeadline: "Turn yesterday's orientation into cleaner math execution",
    briefBody:
      "Day 2 narrows the focus to systems of equations. The goal is to keep the setup crisp, move faster without skipping steps, and leave with a smaller review queue than yesterday.",
    briefCards: [
      {
        title: "What to watch",
        detail: "Catch sign errors, choose the simplest solve path, and avoid redoing work mid-problem."
      },
      {
        title: "What's next",
        detail: "Start with a tighter algebra drill, then prove the same skill under a shorter timer."
      },
      {
        title: "What counts",
        detail: "Strong setup is the whole point today. Speed matters only if the work stays clean."
      }
    ],
    completionHeadline: "Algebra day closed out",
    completionBody:
      "You wrapped up today's algebra work. The next mission shifts into grammar so the plan keeps building range, not just repetition.",
    steps: dayTwoMissionSteps,
    questionSets: [
      {
        stepId: "drill",
        introLabel: "Day 2 algebra drill",
        questions: dayTwoDrillQuestions
      },
      {
        stepId: "mini",
        introLabel: "Day 2 algebra mini-test",
        questions: dayTwoMiniTestQuestions
      }
    ]
  },
  {
    day: 3,
    missionLabel: "Day 3 grammar control",
    missionLengthLabel: "19 min",
    primaryFocusLabel: "Sentence boundaries",
    finishLineLabel: "RW review queue",
    briefHeadline: "Switch gears and make the writing section feel sharper",
    briefBody:
      "Day 3 moves away from math and into high-yield grammar decisions. The goal is to spot sentence-boundary errors faster, trim redundancy, and hold your nerve once the timer starts moving.",
    briefCards: [
      {
        title: "What to watch",
        detail: "Look for clause boundaries first, then check whether the punctuation matches the structure."
      },
      {
        title: "What's next",
        detail: "Start with focused grammar reps before moving into a shorter timed writing set."
      },
      {
        title: "What counts",
        detail: "Today's review matters because grammar mistakes often repeat unless they get named clearly."
      }
    ],
    completionHeadline: "Grammar control day complete",
    completionBody:
      "You finished a full Reading & Writing mission. From here the plan can alternate focus areas without the app feeling like the same day on repeat.",
    steps: dayThreeMissionSteps,
    questionSets: [
      {
        stepId: "drill",
        introLabel: "Day 3 grammar drill",
        questions: dayThreeDrillQuestions
      },
      {
        stepId: "mini",
        introLabel: "Day 3 grammar mini-test",
        questions: dayThreeMiniTestQuestions
      }
    ]
  }
];

export function getMissionDayConfig(day: number, plan?: DayPlan) {
  const exactMatch = missionDayConfigs.find((config) => config.day === day);
  if (exactMatch) return exactMatch;

  if (plan?.missionType === "RW drill") {
    return {
      ...missionDayConfigs[2],
      day,
      missionLabel: `Day ${day} reading & writing mission`,
      briefHeadline: `Day ${day} keeps the pressure on Reading & Writing`,
      briefBody: `Today's focus is ${plan.focus}. You'll move through the same clear flow, but the content stays centered on grammar and rhetorical control.`,
      steps: missionDayConfigs[2].steps.map((step) =>
        step.id === "brief"
          ? { ...step, detail: `Today's focus is ${plan.focus.toLowerCase()}.` }
          : step
      )
    };
  }

  return {
    ...missionDayConfigs[1],
    day,
    missionLabel: `Day ${day} math mission`,
    briefHeadline: `Day ${day} keeps building math confidence`,
    briefBody: `Today's focus is ${plan?.focus ?? "clean setup and pacing"}. The structure stays the same so you can spend your energy on execution, not navigation.`,
    steps: missionDayConfigs[1].steps.map((step) =>
      step.id === "brief"
        ? { ...step, detail: `Today's focus is ${plan?.focus.toLowerCase() ?? "math execution under pressure"}.` }
        : step
    )
  };
}

export const dayPlan: DayPlan[] = [
  { day: 1, title: "Baseline Starter", focus: "Mixed easy-medium calibration", missionType: "Build momentum", duration: "15 min", status: "complete" },
  { day: 2, title: "Algebra Accuracy", focus: "Linear equations and systems", missionType: "Math drill", duration: "18 min", status: "complete" },
  { day: 3, title: "Grammar Control", focus: "Sentence boundaries and punctuation", missionType: "RW drill", duration: "16 min", status: "complete" },
  { day: 4, title: "Advanced Math Patterns", focus: "Functions and nonlinear setup", missionType: "Math drill", duration: "18 min", status: "complete" },
  { day: 5, title: "Synthesis Logic", focus: "Transitions and rhetorical fit", missionType: "RW drill", duration: "17 min", status: "complete" },
  { day: 6, title: "Checkpoint 1", focus: "Mixed timed set", missionType: "Checkpoint", duration: "20 min", status: "complete" },
  { day: 7, title: "Recovery Review", focus: "Redo misses, clean backlog", missionType: "Review", duration: "12 min", status: "complete" },
  { day: 8, title: "Systems Under Time", focus: "Equation solving speed", missionType: "Math drill", duration: "18 min", status: "current" },
  { day: 9, title: "Punctuation Mastery", focus: "Commas, semicolons, colons", missionType: "RW drill", duration: "16 min", status: "upcoming" },
  { day: 10, title: "Word Problem Precision", focus: "Ratios and percentages", missionType: "Math drill", duration: "18 min", status: "upcoming" },
  { day: 11, title: "Inference Discipline", focus: "Evidence-backed reading", missionType: "RW drill", duration: "17 min", status: "upcoming" },
  { day: 12, title: "Functions Focus", focus: "Tables, graphs, nonlinear relationships", missionType: "Math drill", duration: "18 min", status: "upcoming" },
  { day: 13, title: "Checkpoint 2", focus: "Mixed mini-block", missionType: "Checkpoint", duration: "20 min", status: "upcoming" },
  { day: 14, title: "Review Reset", focus: "Backlog cleanup", missionType: "Review", duration: "12 min", status: "upcoming" },
  { day: 15, title: "Pressure Algebra", focus: "Harder algebra under time", missionType: "Math drill", duration: "18 min", status: "upcoming" },
  { day: 16, title: "Editing Precision", focus: "Modifiers and concision", missionType: "RW drill", duration: "16 min", status: "upcoming" },
  { day: 17, title: "Chart Reading", focus: "Data interpretation", missionType: "Math drill", duration: "17 min", status: "upcoming" },
  { day: 18, title: "Paragraph Logic", focus: "Purpose and sequencing", missionType: "RW drill", duration: "17 min", status: "upcoming" },
  { day: 19, title: "Geometry Essentials", focus: "Common high-yield geometry traps", missionType: "Math drill", duration: "18 min", status: "upcoming" },
  { day: 20, title: "Checkpoint 3", focus: "Mixed harder set", missionType: "Checkpoint", duration: "20 min", status: "upcoming" },
  { day: 21, title: "Pattern Repair", focus: "Retry repeated misses", missionType: "Review", duration: "13 min", status: "upcoming" },
  { day: 22, title: "Weak-Spot Rebalance", focus: "Adaptive skill allocation", missionType: "Adaptive", duration: "18 min", status: "upcoming" },
  { day: 23, title: "Pacing Reset", focus: "Shorter timers, same difficulty", missionType: "Pacing", duration: "15 min", status: "upcoming" },
  { day: 24, title: "Grammar Frequency Set", focus: "High-yield editing moves", missionType: "RW drill", duration: "16 min", status: "upcoming" },
  { day: 25, title: "Hard Math Select", focus: "Advanced algebra and setup", missionType: "Math drill", duration: "18 min", status: "upcoming" },
  { day: 26, title: "Mixed Verbal Pressure", focus: "Reading & Writing pacing", missionType: "RW drill", duration: "17 min", status: "upcoming" },
  { day: 27, title: "Checkpoint 4", focus: "Best-effort timed block", missionType: "Checkpoint", duration: "20 min", status: "upcoming" },
  { day: 28, title: "Review Heavy", focus: "Fix recurring errors", missionType: "Review", duration: "14 min", status: "upcoming" },
  { day: 29, title: "Confidence Builder", focus: "High-success medium set", missionType: "Confidence", duration: "15 min", status: "upcoming" },
  { day: 30, title: "Final Checkpoint", focus: "Summary and next-plan recommendation", missionType: "Checkpoint", duration: "20 min", status: "upcoming" }
];

export const dayRationales: Record<number, string> = {
  1: "Start with a low-friction win so the app flow becomes familiar before the training gets more specific.",
  2: "Narrow into algebra early while attention is still fresh, so setup habits improve before speed becomes a problem.",
  3: "Switch sections on purpose to build range and keep the plan from feeling like one skill repeated forever.",
  4: "Return to Math with a harder pattern set once the basic routine already feels stable.",
  5: "Bring back Reading & Writing and focus on logic moves that tend to snowball when they go unchecked.",
  6: "Use a checkpoint here to see whether the first week is actually transferring under a mixed set.",
  7: "Pause the push and clean up misses so weak habits do not carry into the next block.",
  8: "Revisit systems under time after a reset day, when pacing work can land without as much mental clutter.",
  9: "Follow the math-pressure day with punctuation control so the plan keeps alternating load instead of stacking fatigue.",
  10: "Keep Math moving, but shift from pure equations to applied setup so transfer starts showing up in word problems.",
  11: "Slot inference work here because evidence discipline benefits from the pacing control built over the last few days.",
  12: "Use functions now that the student has enough rhythm to handle more abstract representations without extra UI friction.",
  13: "Checkpoint again before the midpoint so the app can prove the sequence is working, not just filling days.",
  14: "Reset with review after the checkpoint to turn patterns into corrections before the next difficulty climb.",
  15: "Bring back algebra under pressure once earlier cleanup has had time to stick.",
  16: "Shift to editing precision next so attention moves from solving speed to control and clarity.",
  17: "Data interpretation lands better here because it blends math setup with reading discipline from prior days.",
  18: "Paragraph logic follows naturally after editing precision, when sentence-level control is already warmed up.",
  19: "Introduce geometry after broader pacing and confidence have improved, so it feels like expansion rather than derailment.",
  20: "Use a tougher checkpoint here to test whether the middle stretch is producing real resilience.",
  21: "Follow the harder checkpoint with repair work so misses become useful signals instead of discouraging noise.",
  22: "Adaptive allocation belongs here because enough history exists to rebalance the plan around actual weak spots.",
  23: "Reset pacing after the adaptive day so the student can feel sharper timing without carrying full session weight.",
  24: "Return to high-yield grammar late in the plan because repeated exposure is what usually turns those rules automatic.",
  25: "Push into harder math now that the plan has already built stamina, not just familiarity.",
  26: "Counterbalance the hard math day with verbal pressure so the final stretch still feels mixed and exam-like.",
  27: "This checkpoint is the dress rehearsal: not the final day, but close enough to test composure honestly.",
  28: "Use a review-heavy day here so the final two sessions can feel focused instead of cluttered by old misses.",
  29: "Add a confidence builder before the end so momentum is high going into the final checkpoint.",
  30: "Finish with a summary checkpoint so the plan ends with evidence and a clear sense of what should come next."
};
