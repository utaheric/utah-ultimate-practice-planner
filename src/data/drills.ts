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
    "Install and refine hex offensive structure — spacing, resets, isolation cuts, and positional flow.",
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
      name: "Hex Spacing Warm-Up",
      description:
        "Place 6 cones in a hexagon shape — like a stop sign missing one side — with about 20 yards between each cone. One player stands at each cone. Jog clockwise around the hex, stopping at each cone for a dynamic stretch: lunges at cone 1, frankensteins at cone 2, high knees at cone 3, butt kicks at cone 4, lateral shuffles at cone 5, carioca at cone 6. After one full loop, grab a disc and throw 10 passes to the player at the cone across from you (forehand and backhand).",
      coaching_points: [
        "Get comfortable with where each position is — you need to know the hex shape by feel",
        "When throwing, work different angles: straight across, to your left neighbor, to your right neighbor",
        "Move at game speed between cones, not a lazy jog",
      ],
      equipment: ["cones (6)", "discs (6)"],
    },
    drill_1: {
      name: "Hex Reset Flow",
      description:
        "6 players, one at each cone of the hex. One player starts with a disc. They have 3 seconds to throw to a neighbor — you can only throw to a cone directly next to yours, not across. After you throw, jog clockwise to the next cone. The receiver now has 3 seconds to throw to one of their neighbors. Keep the disc moving continuously. If the disc hits the ground or the 3-second count expires, reset and start over.",
      coaching_points: [
        "The point of hex is that you always have 2 or 3 easy options nearby — look for them",
        "Start moving to the next cone as the throw is released, not after",
        "Crisp, flat throws — sloppy passes slow the whole rotation down",
      ],
      equipment: ["cones (6)", "discs (2)"],
    },
    drill_2: {
      name: "Hex Isolation Cuts",
      description:
        "6 offensive players at the hex cones, 3 defenders. Each defender picks one offensive player to guard — that leaves 3 offensive players completely unguarded. The offense's job: move the disc around the hex (max 4 throws) to get it to one of the unguarded players. Defenders can switch who they're covering between reps. After 3 reps, rotate 3 new defenders in.",
      coaching_points: [
        "Before you throw, scan the hex — which 3 spots are uncovered? Move the disc toward them.",
        "Use your eyes and fakes to pull defenders one direction, then throw the other way",
        "The hex naturally creates open players — don't force a throw into traffic when someone else is wide open",
      ],
      equipment: ["cones (6)", "discs (3)", "pinnies (6)"],
    },
    scrimmage: {
      name: "7v7 Hex Offense vs. Person D",
      description:
        "Full 7v7 scrimmage on a regulation field. Offense must line up in the hex shape before every point starts (6 players in the hex, 1 handler with the disc in the middle or behind). Defense plays person-to-person. Normal scoring rules. After each point, pause and check: did the offense maintain hex spacing as they moved the disc, or did everyone clump together?",
      coaching_points: [
        "After you throw, don't stand and watch — fill back into an open spot in the hex shape",
        "The 7th player (not in the hex) is the free option — they cut into gaps when the defense shifts",
        "Once you get within 20 yards of the endzone, the hex is too spread out — switch to a tighter endzone set like flood",
      ],
      equipment: ["cones (4)", "discs (3)", "pinnies (14)"],
    },
    conditioning: {
      name: "Hex Sprint Rotations",
      description:
        "Set up the 6-cone hex. Start at any cone. Sprint diagonally across the hex to the cone on the opposite side (about 40 yards). Then jog to the next cone clockwise (about 20 yards). Sprint across again. Jog to the next. Keep going until you've sprinted from all 6 cones. That's one set. Rest 45 seconds. Do 4 sets.",
      coaching_points: [
        "Sprint the long diagonal, use the short jog to recover",
        "Stay light on your feet through the direction changes at each cone",
        "This is the actual movement pattern in hex offense — long burst, short reposition, repeat",
      ],
      equipment: ["cones (6)"],
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
