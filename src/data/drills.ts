export interface Drill {
  name: string;
  description: string;
  coaching_points: string[];
  equipment: string[];
}

export interface FocusArea {
  key: string;
  label: string;
  description: string;
  warmup: Drill;
  drill_1: Drill;
  drill_2: Drill;
  scrimmage: Drill;
  conditioning: Drill;
}

export const COOLDOWN: Drill & { duration: number } = {
  name: "Cool-Down & Debrief",
  duration: 5,
  description:
    "Static stretching circle: hamstrings, quads, hip flexors, shoulders, wrists. While stretching, coach leads a 2-minute debrief: one thing that went well, one thing to work on next practice.",
  coaching_points: [
    "Hold each stretch 20-30 seconds — no bouncing",
    "Use this time to reinforce the day's focus",
    "Players should be able to name today's focus in one sentence",
  ],
  equipment: [],
};

export const FREE_PLAY: Drill & { duration: number } = {
  name: "Free Play / Open Scrimmage",
  duration: 15,
  description:
    "Open scrimmage or pickup-style play. Players call their own lines. Encourage players to try what they practiced today in a game setting. Coach observes but does not intervene unless asked.",
  coaching_points: [
    "Let players experiment — this is their time",
    "Watch for players applying today's focus organically",
    "Note any habits that need correction for next practice",
  ],
  equipment: ["discs (3)", "cones (4)"],
};

export const FOCUS_AREA_DESCRIPTIONS: Record<string, string> = {
  cutting:
    "Sharpen offensive cuts — fakes, timing, explosiveness, and creating separation from defenders.",
  "zone defense":
    "Master zone defensive sets, shifting, communication, and trapping the sideline.",
  "handler movement":
    "Develop handler resets, weaves, dump-swing continuations, and disc movement under pressure.",
  "break throws":
    "Build a complete break-throw arsenal — IO backhands, around forehands, high-release, and reading the mark.",
  "endzone offense":
    "Execute in tight spaces with flood patterns, give-and-go scores, and efficient red zone offense.",
  "hex offense":
    "Learn hex offense through small-sided games, throw-and-run technique, connected spacing, and shape recognition -- built from how top hex coaches actually teach it.",
};

export const DRILL_LIBRARY: Record<string, Omit<FocusArea, "key" | "label" | "description">> = {
  cutting: {
    warmup: {
      name: "Dynamic Cuts Warm-Up",
      description:
        "Jog line to line. Every 10 yards, perform a cutting motion: plant-and-go, 45-degree cut, in-cut fake to deep, deep fake to under. Pair with partner throwing (10 completions each side).",
      coaching_points: [
        "Sell the fake with your hips, not just your shoulders",
        "Explode out of cuts — first 3 steps are everything",
        "Throwing: hit cutters in stride, lead passes",
      ],
      equipment: ["cones (12)", "discs (6)"],
    },
    drill_1: {
      name: "Cutting Triangle",
      description:
        "Set 3 cones in a triangle (15 yards apart). Cutter starts at cone A, makes a hard fake toward cone B, plants and cuts to cone C to receive. Thrower is at the top. Rotate after each rep. Progress to live defender.",
      coaching_points: [
        "Change of speed is more important than change of direction",
        "Attack the disc — don't wait for it to arrive",
        "Clear hard after the catch to keep space",
      ],
      equipment: ["cones (3)", "discs (3)"],
    },
    drill_2: {
      name: "Give-and-Go Cutting Lanes",
      description:
        "Two lines: handlers and cutters. Cutter makes an in-cut, catches, immediately hits a continuation throw to the next cutter going deep. Emphasize timing — the second cut starts as the first throw is released.",
      coaching_points: [
        "Catch and pivot quickly — no extra steps",
        "Second cutter: read the disc, not the person",
        "Reset spacing after every throw",
      ],
      equipment: ["cones (6)", "discs (4)"],
    },
    scrimmage: {
      name: "3v3 Live Cutting Box",
      description:
        "3 offense vs 3 defense in a 30x30 yard box. Offense must complete 5 passes (no hucks) to score. Defense plays person-to-person. Rotate on turnover or score. Focus: creating and using space.",
      coaching_points: [
        "Clear out after 2 seconds if you don't have the disc",
        "Cut WITH purpose — know if you're going under or deep before you move",
        "Defenders: deny the first step",
      ],
      equipment: ["cones (4)", "discs (2)", "pinnies (6)"],
    },
    conditioning: {
      name: "Cut-Sprint Intervals",
      description:
        "Sprint 40 yards, plant, sprint back 20 yards, plant, sprint 40 yards. Rest 30 seconds. Repeat 8 times. Simulates repeated cutting patterns.",
      coaching_points: [
        "Stay low through the plant",
        "Drive arms on acceleration",
        "Maintain form even when tired",
      ],
      equipment: ["cones (3)"],
    },
  },
  "zone defense": {
    warmup: {
      name: "Sideline Shuffle & Throw",
      description:
        "Defensive slides along the sideline (10 yards), backpedal, then sprint to a cone. Pair with partner throwing: focus on quick-release forehands and backhands (10 each side).",
      coaching_points: [
        "Stay on the balls of your feet during slides",
        "Keep hips low and eyes up",
        "Communication starts in warm-up — call out imaginary swings",
      ],
      equipment: ["cones (8)", "discs (6)"],
    },
    drill_1: {
      name: "Zone Shell Walkthrough",
      description:
        "Set up a 3-2-2 zone (cup + wings + deeps). Walk through shifts as the disc moves: swing left, swing right, up-line. No offense yet. Coach calls out disc position and players shift. Build to jog speed.",
      coaching_points: [
        "Cup stays connected — arm's length from each other",
        "Wings key off the disc, not the person",
        "Deeps communicate 'last back' and 'no around'",
      ],
      equipment: ["cones (8)", "discs (2)", "pinnies (7)"],
    },
    drill_2: {
      name: "Zone vs. Handlers",
      description:
        "7v3: full zone defense vs. 3 handlers only. Handlers try to swing the disc past the cup. Zone works on trapping the sideline. If handlers complete 3 swings, offense wins. Rotate every 3 reps.",
      coaching_points: [
        "Mark should force a specific direction — don't let them choose",
        "Short-deep reads the lane for poaches",
        "Communicate EVERY throw: 'up!', 'no break!', 'strike!'",
      ],
      equipment: ["cones (4)", "discs (3)", "pinnies (7)"],
    },
    scrimmage: {
      name: "7v7 Zone-Only Points",
      description:
        "Full 7v7 points. Defense MUST play zone (coach picks 3-2-2 or 1-3-3). Offense can run anything. Play to 5. After each point, defense huddles and identifies what broke down.",
      coaching_points: [
        "Transition from person D to zone set must happen in < 3 seconds",
        "After a turn, zone must reset before offense advances the disc",
        "Poach lanes, not people — take away throwing windows",
      ],
      equipment: ["cones (4)", "discs (3)", "pinnies (14)"],
    },
    conditioning: {
      name: "Defensive Slide Ladder",
      description:
        "Set cones 5 yards apart in a zigzag (8 cones). Defensive slide between each cone, sprint to the end. Rest 20 seconds. 8 reps. Simulates zone shifting.",
      coaching_points: [
        "Don't cross your feet during slides",
        "Quick hip turn at each cone",
        "Stay low — tall defenders get beaten",
      ],
      equipment: ["cones (8)"],
    },
  },
  "handler movement": {
    warmup: {
      name: "Handler Reset Warm-Up",
      description:
        "Partners 15 yards apart. Practice handler resets: dump swing, around break, IO break, give-and-go. 5 of each. Then jog figure-8s around cones with dynamic stretches.",
      coaching_points: [
        "Reset cut should be at 45 degrees behind the disc",
        "Thrower: pivot to create the angle, don't force it flat",
        "Catch with momentum toward the next throw",
      ],
      equipment: ["cones (4)", "discs (6)"],
    },
    drill_1: {
      name: "Handler Weave (3-person)",
      description:
        "3 handlers advance the disc up a sideline using only resets and swings. No downfield throws allowed. Each handler must touch the disc. Progress to adding a mark.",
      coaching_points: [
        "After you throw, MOVE — become the next reset option",
        "Timing: don't cut to the reset spot until the thrower is looking",
        "Stay balanced on the catch — ready to throw immediately",
      ],
      equipment: ["cones (6)", "discs (2)"],
    },
    drill_2: {
      name: "Dump-Swing-Continue",
      description:
        "4-person drill: handler dumps to reset, reset swings to far-side handler, who hits the continuation cutter. Emphasize flow and timing. Add live marks after 5 minutes.",
      coaching_points: [
        "The swing throw should be a leading pass — don't make them stop",
        "Continuation cutter starts moving on the swing release",
        "Reset handler: LOUD call — 'dump! dump!' — so the thrower knows",
      ],
      equipment: ["cones (6)", "discs (3)"],
    },
    scrimmage: {
      name: "4v4 Handler Game",
      description:
        "4v4 in a narrow field (20x40 yards). Must complete at least 2 handler touches (reset or swing) before going downfield. Score by catching in the endzone. Turnover = immediate transition.",
      coaching_points: [
        "Handlers initiate the offense — don't wait for cutters to get open",
        "Use fakes to move the mark before throwing",
        "After the stall reaches 5, MUST reset — practice the bail-out",
      ],
      equipment: ["cones (4)", "discs (2)", "pinnies (8)"],
    },
    conditioning: {
      name: "Shuttle Pivots",
      description:
        "Sprint 10 yards to a cone, pivot and fake (forehand, backhand), sprint 10 more yards, pivot and throw. Rest 20 seconds. 10 reps. Simulates handler movement under pressure.",
      coaching_points: [
        "Stay balanced through the pivot",
        "Fakes should be convincing — full arm extension",
        "Throw accurately even when winded",
      ],
      equipment: ["cones (4)", "discs (4)"],
    },
  },
  "break throws": {
    warmup: {
      name: "Break Mark Throwing Warm-Up",
      description:
        "Partners at 15 yards. 10 forehands, 10 backhands, then break throws: 10 inside-out backhands, 10 around forehands, 10 high-release backhands. Pair with hip circles, leg swings, arm circles.",
      coaching_points: [
        "Step around the imaginary mark on every throw",
        "Inside-out: release point is at your opposite hip",
        "High-release: keep the disc flat, don't let it turn over",
      ],
      equipment: ["cones (4)", "discs (8)"],
    },
    drill_1: {
      name: "Break Mark Gauntlet",
      description:
        'Thrower faces a live mark (force forehand). Must complete 3 break throws in a row to rotate out: 1 IO backhand, 1 around forehand, 1 high-release. Mark plays honest but not overly aggressive.',
      coaching_points: [
        "Use your pivot — create space before you throw",
        "Read the mark: if they take away around, go IO",
        "Quick release beats the mark — don't wind up",
      ],
      equipment: ["cones (2)", "discs (4)"],
    },
    drill_2: {
      name: "Break to Space",
      description:
        "Cutter stands in the break-side lane. Thrower must hit them with a break throw while a live mark defends. Cutter varies position: short break, deep break, front-cone break. Rotate every 5 throws.",
      coaching_points: [
        "Throw to the cutter's upfield shoulder — give them momentum",
        "Cutter: time your cut so you arrive as the throw does",
        "Don't force it — if the look isn't there, reset",
      ],
      equipment: ["cones (6)", "discs (4)"],
    },
    scrimmage: {
      name: "Break-Side Bonus Points",
      description:
        "Full 7v7 scrimmage. Normal scoring, BUT any goal completed from a break throw is worth 2 points. Forces offense to look break-side. Play to 7 (by 2s with break throws).",
      coaching_points: [
        "Don't force break throws — earn them with good fakes and pivots",
        "Off-disc: position yourself on the break side to invite the throw",
        "Defenders: mark honestly — no cheating to the break side",
      ],
      equipment: ["cones (4)", "discs (3)", "pinnies (14)"],
    },
    conditioning: {
      name: "Pivot Power Series",
      description:
        "At a cone: 10 full-speed pivots (forehand to backhand), throw. Sprint 20 yards to next cone, repeat. 6 stations. Rest 30 seconds between sets. 3 sets total.",
      coaching_points: [
        "Explosive pivot — don't drift",
        "Stay on balance through the throw",
        "Throw quality matters more than speed",
      ],
      equipment: ["cones (6)", "discs (6)"],
    },
  },
  "endzone offense": {
    warmup: {
      name: "Endzone Throwing Warm-Up",
      description:
        "Partners at 10 yards (tight endzone spacing). Practice short passes: 5 touch forehands, 5 touch backhands, 5 scoobers, 5 blades. Pair with high-knee jog, karaoke, and A-skips.",
      coaching_points: [
        "Tight spaces = quick release and soft touch",
        "Scoobers and blades are real endzone weapons — practice them",
        "Make eye contact before throwing in tight windows",
      ],
      equipment: ["cones (4)", "discs (8)"],
    },
    drill_1: {
      name: "Endzone Flood Drill",
      description:
        "Set a 20x25 yard endzone. 3 cutters start stacked at the front cone. On 'go': first cutter goes break side, second goes open side, third goes deep. Thrower reads and hits the open cutter. Rotate positions.",
      coaching_points: [
        "Timing is everything — don't all go at once",
        "First cutter clears if not open within 2 seconds",
        "Thrower: take what the defense gives you",
      ],
      equipment: ["cones (6)", "discs (3)"],
    },
    drill_2: {
      name: "Red Zone Give-Go-Score",
      description:
        "Disc starts at the front of the endzone. Handler gives a short pass to a cutter, then cuts for the give-and-go score. Add a mark and downfield defender after 5 reps. Emphasize the finish.",
      coaching_points: [
        "The give-and-go works because the defense relaxes after the first throw",
        "Cutter: catch and immediately look for the handler cutting",
        "Score with conviction — attack the disc in the endzone",
      ],
      equipment: ["cones (4)", "discs (3)"],
    },
    scrimmage: {
      name: "Endzone-Only Points",
      description:
        "Start every point from the brick mark (20 yards out). Offense has 3 throws to score. If they don't score in 3, turnover. Play to 7. Forces efficient endzone execution.",
      coaching_points: [
        "No hero throws — move the disc to create the open look",
        "Clear space for each other — one cutter in the lane at a time",
        "After a turn, defensive transition must be instant",
      ],
      equipment: ["cones (4)", "discs (2)", "pinnies (14)"],
    },
    conditioning: {
      name: "Endzone Suicide Sprints",
      description:
        "Sprint from endzone line to 5 yards, back. To 10, back. To 15, back. To 20, back. Rest 45 seconds. 5 sets. Simulates the short, explosive bursts of endzone play.",
      coaching_points: [
        "Touch the line every time — discipline matters",
        "Decelerate under control — protect your knees",
        "Last set is the one that counts",
      ],
      equipment: ["cones (5)"],
    },
  },
  "hex offense": {
    warmup: {
      name: "Throw-and-Run Technique + Keepdisc",
      description:
        "Part 1 (5 min): In pairs, 10 yards apart. Practice the throw-and-run: after each throw, lift your non-pivot knee high and sprint 5 yards forward before stopping. Do 5 reps backhand, 5 forehand, 5 off-hand. The point is building the habit of moving immediately after releasing the disc, not standing and watching. Part 2 (10 min): Split into two teams of 7 (or as close as you can). Play keepdisc in a half-field box. Offense tries to complete as many consecutive passes as possible without scoring -- just keep possession. Switch on turnovers. Count passes out loud.",
      coaching_points: [
        "Throw-and-run is THE core hex technique -- if you throw and stand still, the offense stalls",
        "In keepdisc, stay about 10 yards from your nearest teammates -- close enough to make easy throws, far enough that your defender can't clog two lanes",
        "Take the open pass even if it doesn't gain yards. Lateral and backward passes are fine -- movement is the point, not field position",
      ],
      equipment: ["cones (4)", "discs (6)"],
    },
    drill_1: {
      name: "Small-Sided Progression: 2v2 to 4v4",
      description:
        "Start with 2v2 in a 20x30 yard box. Play to 3 points, then rotate pairs. Rules: take the open pass, even if it's lateral. Players should end up side-by-side as often as one-in-front-of-the-other. After 2v2 rounds, move to 3v3 in a 25x35 box (same rules, add: after you throw, move to an open spot -- don't stand where you threw from). Finish with 4v4 in a 30x40 box (add: if the stall count hits 5, you must throw a reset -- no hero balls).",
      coaching_points: [
        "In 2v2, notice how often the best throw is sideways, not forward -- that's hex thinking",
        "In 3v3, the player who just threw should be the one moving most aggressively to a new spot",
        "In 4v4, start reading where the open space is before you get the disc -- if everyone crowds one side, the whole other side of the box is empty",
      ],
      equipment: ["cones (8)", "discs (4)", "pinnies (8)"],
    },
    drill_2: {
      name: "Shape Setup Race + Whistle Freeze",
      description:
        "Part 1 -- Shape Race (5 min): Two teams of 7. Coach throws a disc onto the field. Both teams race to set up correct hex spacing around the disc: 2 backs (behind/level with the disc), 2 wings (out toward the sidelines, connected to backs), 1 hat (central, in front of disc), 2 forwards (furthest downfield, connected to hat and wings). 'Connected' means about 10 yards apart -- close enough for an easy throw, far enough your defender can't guard two people. First team set correctly wins the rep. 5 reps with the disc in different field positions. Part 2 -- Whistle Freeze (15 min): Play 7v7. Whenever the stall count hits 3, coach blows a whistle and everyone freezes. Look at the offense's shape: are positions filled? Is anyone too far away or crowding? Fix the shape, then resume.",
      coaching_points: [
        "The hex shape rotates with the disc -- when the disc is on the sideline, the whole shape shifts. Don't think of it as fixed field positions",
        "'Connected' is the key concept: ~10 yards from your nearest teammates. If you're 25 yards from everyone, you're disconnected and useless",
        "The most common mistake: everyone drifts downfield and nobody is behind the disc. If the back positions are empty, there's no reset option",
      ],
      equipment: ["cones (4)", "discs (3)", "pinnies (14)"],
    },
    scrimmage: {
      name: "7v7 Hex Scrimmage with Shape Checks",
      description:
        "Full 7v7 on a regulation field. Before each point, offense sets up in hex shape: call a pull catcher, everyone else positions relative to that person (not fixed field spots). Play normal rules. Coach watches for shape breakdowns -- if flow dies and the stall count is climbing, blow the whistle, freeze, let the offense fix their spacing, then resume. After each point, quick team huddle: what worked, where did the shape collapse? Play to 5.",
      coaching_points: [
        "Don't call positions on the line -- part of learning hex is reading where to go based on where the disc and your teammates are",
        "After you throw forward from a back position, you're already in a good spot -- don't automatically clear deep out of habit. Stay if no one is replacing you.",
        "Near the endzone (~15 yards out), the hex gets too wide. Compress into a tighter set for the final throw",
      ],
      equipment: ["cones (4)", "discs (3)", "pinnies (14)"],
    },
    conditioning: {
      name: "Throw-and-Go Relay",
      description:
        "Two lines facing each other, 15 yards apart. Player 1 throws to Player 2 and immediately sprints to the back of Player 2's line. Player 2 catches, throws to the next person in Player 1's line, and sprints to the back of that line. Keep it continuous for 3 minutes. Rest 1 minute. Do 3 rounds. Each round, increase the distance by 5 yards (15, 20, 25). If a throw is dropped, the thrower does 5 burpees and the drill continues.",
      coaching_points: [
        "This is throw-and-run at speed under fatigue -- exactly what hex demands",
        "Throw accuracy matters more as you get tired -- focus on a clean release, not just speed",
        "Sprint hard to the back of the line -- the recovery happens while you're waiting, not while you're moving",
      ],
      equipment: ["cones (4)", "discs (4)"],
    },
  },
};

export interface ScheduleBlock {
  startMin: number;
  endMin: number;
  label: string;
  drill: Drill;
  duration: number;
  sectionKey: string;
}

export function generateSchedule(focusKey: string): ScheduleBlock[] {
  const drills = DRILL_LIBRARY[focusKey];
  if (!drills) return [];

  const sections: { key: string; label: string; drill: Drill; duration: number }[] = [
    { key: "warmup", label: "Warm-Up", drill: drills.warmup, duration: 15 },
    { key: "drill_1", label: "Skill Drill 1", drill: drills.drill_1, duration: 20 },
    { key: "drill_2", label: "Skill Drill 2", drill: drills.drill_2, duration: 20 },
    { key: "scrimmage", label: "Scrimmage", drill: drills.scrimmage, duration: 30 },
    { key: "conditioning", label: "Conditioning", drill: drills.conditioning, duration: 15 },
    { key: "cooldown", label: "Cool-Down", drill: COOLDOWN, duration: COOLDOWN.duration },
    { key: "freeplay", label: "Free Play", drill: FREE_PLAY, duration: FREE_PLAY.duration },
  ];

  let time = 0;
  return sections.map((s) => {
    const block: ScheduleBlock = {
      startMin: time,
      endMin: time + s.duration,
      label: s.label,
      drill: s.drill,
      duration: s.duration,
      sectionKey: s.key,
    };
    time += s.duration;
    return block;
  });
}

export function aggregateEquipment(blocks: ScheduleBlock[]): { name: string; count: number }[] {
  const map: Record<string, number> = {};
  for (const block of blocks) {
    for (const item of block.drill.equipment) {
      const match = item.match(/^(.+?)\s*\((\d+)\)$/);
      if (match) {
        const name = match[1].trim();
        const count = parseInt(match[2], 10);
        map[name] = Math.max(map[name] || 0, count);
      } else {
        map[item] = Math.max(map[item] || 0, 1);
      }
    }
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, count]) => ({ name, count }));
}

export const FOCUS_AREAS = Object.keys(DRILL_LIBRARY);
