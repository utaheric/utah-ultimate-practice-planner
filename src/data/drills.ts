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

export interface FocusAreaDrillSet
  extends Omit<FocusArea, "key" | "label" | "description"> {
  extras?: Drill[];
}

export interface EditableBuiltInDrill extends Drill {
  id: string;
  focusAreas: string[];
  sectionKey: string;
  sectionLabel: string;
  isOverridden: boolean;
}

const SECTION_LABELS: Record<string, string> = {
  warmup: "Warm-Up",
  drill_1: "Skill Drill 1",
  drill_2: "Skill Drill 2",
  scrimmage: "Scrimmage",
  conditioning: "Conditioning",
  extra: "Extra Drill",
  cooldown: "Cool-Down",
  freeplay: "Free Play",
};

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
    "Sharpen offensive cuts — power cuts, attack-column timing, explosiveness, and creating 2v2/3v3 separation games.",
  "zone defense":
    "Master zone defensive sets (3-2-2, 1-3-3), shifting, communication, and trapping the sideline. This is traditional zone — NOT SCRAM.",
  "handler movement":
    "Develop handler resets through the four reset corners (Alpha, Beta, Burnie, Trail), weaves, dump-swing continuations, and disc movement under pressure.",
  "break throws":
    "Build a complete break-throw arsenal — IO backhands, around forehands, high-release, and reading the mark.",
  "red zone offense":
    "Score efficiently inside 20 yards using the Shred red zone system: shift from vertical to lateral, attack break-side-in-motion, front cones primary, back cones last resort.",
  "hex offense":
    "Learn hex offense through small-sided games, throw-and-run technique, connected spacing, and shape recognition -- built from how top hex coaches actually teach it.",
  "reset corners":
    "Master the four named reset positions — Alpha, Beta, Burnie, and Trail — with shown-space mechanics, switch reads, and the 'hurry up and wait' principle.",
  "scram defense":
    "Learn SCRAM: cascading person-to-person pressure (NOT zone). Send to hot spots, pass-off vs switch, Cover 3 rotation, and the Recognize-Respect-Reduce return-to-man framework.",
  "double team":
    "Offense and defense double-team concepts. Offense: 360 pivots, contact as ally, cutter engagement (double fills, party cuts, strikes). Defense: 45, 90 Front, 90 Back, Sandwich sets.",
  "chunk yards":
    "The primary offensive engine: cutter-to-cutter continuations through the attack column, power cuts under and deep, varied stack formations (3-2, 4-1, 2-1-2), and breaking the force side.",
};

export const DRILL_LIBRARY: Record<string, FocusAreaDrillSet> = {
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
        "Use power cuts: change of speed is more important than change of direction — first 3 steps at max acceleration",
        "Attack the disc — don't wait for it to arrive",
        "Clear hard after the catch to keep space in the attack column",
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
        "Create 2v2 and 3v3 games — coordinate cuts with your partner, don't cut in isolation",
        "Cut WITH purpose — power cuts under and deep through the attack column, not lateral drifts",
        "Defenders: deny the first step, win the inside hip",
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
    extras: [
      {
        name: "1v1 Under-Deep Decision",
        description:
          "Set a handler with a disc and a cutter-defender pair 18 to 20 yards away. On the tap-in, the cutter sells a fake and attacks either under or deep. The defender plays live and tries to win the first step. Rotate every rep. Add a live mark to make the handler hold shape and throw on time.",
        coaching_points: [
          "Win with the first 3 steps, not with a slow double move",
          "Sell the fake with hips and shoulders, then plant hard and go",
          "Handler throws to the lane that actually won, not the lane they hoped would win",
        ],
        equipment: ["cones (4)", "discs (3)"],
      },
      {
        name: "Continuation Cut Chain",
        description:
          "Three cutters and one handler. Cutter 1 attacks under and receives. As that throw is released, Cutter 2 times a deep continuation. If the deep window is late or the defender stays on top, Cutter 2 bends back under into the space created by the first cut. Reset quickly and keep the rhythm high.",
        coaching_points: [
          "Second cutter moves on the first throw, not after the catch",
          "If the deep shot is late, come back under into the space you created",
          "First cutter clears hard after the catch so the continuation lane stays open",
        ],
        equipment: ["cones (6)", "discs (4)"],
      },
      {
        name: "Breakside J-Cut Timing",
        description:
          "Place a cutter on the break side and a handler with a mark. The cutter pushes up the break lane, continues to about 10 yards from the thrower, then plants and J-cuts back into the live-side lane. The handler reads whether the break is really available or whether the cutter should be hit as they bend back across.",
        coaching_points: [
          "Push far enough break side to move the defender before you bend the route",
          "Throwers should challenge the break only when they have the angle",
          "Cutter and thrower must read each other early, this drill dies if both react late",
        ],
        equipment: ["cones (5)", "discs (3)"],
      },
    ],
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
        "Wings key off the disc, not the person — this is what makes zone DIFFERENT from SCRAM (where you always have a primary person assignment)",
        "Deeps communicate 'last back' and 'no around'. Zone is about space coverage; SCRAM is about cascading person pressure.",
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
        "Zone = guard space, SCRAM = guard people with cascading help. Don't mix them — commit fully to zone in this drill.",
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
        "Think in terms of the four reset corners: Alpha (power dump), Beta (aggressive break-side), Burnie (break lane), Trail (far behind)",
        "Thrower: pivot to create the angle for whichever corner the reset shows in",
        "Catch with momentum toward the next throw — 'hurry up and wait' applies here too",
      ],
      equipment: ["cones (4)", "discs (6)"],
    },
    drill_1: {
      name: "Handler Weave (3-person)",
      description:
        "3 handlers advance the disc up a sideline using only resets and swings. No downfield throws allowed. Each handler must touch the disc. Progress to adding a mark.",
      coaching_points: [
        "After you throw, MOVE — fill the Alpha or Trail corner for the next handler",
        "Timing: show space at a reset corner, then wait — don't drift through it",
        "Stay balanced on the catch — ready to throw immediately from any reset corner",
      ],
      equipment: ["cones (6)", "discs (2)"],
    },
    drill_2: {
      name: "Dump-Swing-Continue",
      description:
        "4-person drill: handler dumps to reset, reset swings to far-side handler, who hits the continuation cutter. Emphasize flow and timing. Add live marks after 5 minutes.",
      coaching_points: [
        "The dump should come from the Alpha or Beta corner — show space in the correct reset position",
        "Continuation cutter starts moving on the swing release",
        "Reset handler: LOUD call — 'Alpha!' or 'Beta!' — name the corner so the thrower knows where to look",
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
  "red zone offense": {
    warmup: {
      name: "Lateral Throwing Warm-Up",
      description:
        "Partners at 10 yards (tight red zone spacing). 5 touch forehands, 5 touch backhands, then 10 break-side-in-motion throws: thrower pivots and leads the receiver laterally across the field. Pair with high-knee jog, lateral shuffles, and A-skips. Focus on throws that move the disc sideways, not just forward — this is the core red zone skill.",
      coaching_points: [
        "In the red zone, vertical momentum stops and lateral movement takes over — practice that shift now",
        "Break-side-in-motion throws need a soft leading touch, not a bullet",
        "Make eye contact before throwing into tight windows — the endzone is crowded",
      ],
      equipment: ["cones (4)", "discs (8)"],
    },
    drill_1: {
      name: "Front Cone Attack",
      description:
        "Set a 20x25 yard endzone with 4 cones: 2 'front cones' at the near corners of the endzone, 2 'back cones' at the far corners. Disc starts at the front of the endzone. 3 cutters set up in a stack. On 'go', cutters attack ONLY the front cones — one goes break-side-in-motion, one fills open-side front cone, one clears deep as a decoy. Thrower reads and hits whoever is open at a front cone. Rotate every 3 reps. The point: front cones are your primary target, back cones are last resort.",
      coaching_points: [
        "Front cones are PRIMARY — 80% of red zone scores should come from the front two cones",
        "Break-side-in-motion is the highest-value cut: running laterally across the endzone while the disc is moving",
        "Back cones are bail-out only — if your first look is the back cone, you're reading it wrong",
      ],
      equipment: ["cones (6)", "discs (3)"],
    },
    drill_2: {
      name: "Handler-as-Facilitator Combos",
      description:
        "3v3 in a 20-yard-deep endzone. The handler with the disc CANNOT score — they can only facilitate by throwing to cutters who score, or by throwing give-and-go combos where the handler cuts after releasing. After each score, rotate who is the designated facilitator. Add a mark after 5 reps. This teaches handlers to generate looks and combo plays instead of hero-ball hucks.",
      coaching_points: [
        "Handlers in the red zone are facilitators, not scorers — generate looks for cutters",
        "Give-and-go combos work because the defense relaxes after the first throw",
        "Read the defense: if they collapse on the front cones, the back cone opens. But only go there as a LAST resort",
      ],
      equipment: ["cones (4)", "discs (3)"],
    },
    scrimmage: {
      name: "Red Zone Scrimmage (20-Yard Box)",
      description:
        "Start every point from 20 yards out. Offense has 5 throws to score. If they don't score in 5, turnover. Play to 7. Between points, coach calls out what just happened: 'That was a front cone score — great.' or 'That was a back cone bailout — how could we have attacked the front cones instead?' Force the team to internalize front-cone-first thinking.",
      coaching_points: [
        "Shift from vertical to lateral the moment you enter the red zone — stop pushing forward and start moving sideways",
        "Attack break-side-in-motion as the primary look every single time",
        "No hero throws — if nothing is open in 2 seconds, reset and try the combo again",
      ],
      equipment: ["cones (4)", "discs (2)", "pinnies (14)"],
    },
    conditioning: {
      name: "Lateral Explosion Intervals",
      description:
        "Set 4 cones in a 10-yard square. Sprint to cone 1 (forward), shuffle to cone 2 (lateral), backpedal to cone 3, shuffle to cone 4 (lateral), sprint diagonally to start. Rest 30 seconds. 8 reps. Simulates the multi-directional movement of red zone offense — forward, lateral, backward, lateral.",
      coaching_points: [
        "Stay low through the lateral shuffles — red zone cuts are short and explosive",
        "The diagonal sprint simulates the break-side-in-motion cut — full speed",
        "Maintain form even when tired — red zone efficiency drops when legs go",
      ],
      equipment: ["cones (4)"],
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
    extras: [
      {
        name: "Give-Go-Swill",
        description:
          "Set up 7 to 12 players with one live offensive player, one defender, and the rest as connected static players. The live cutter-handler works the disc downhill using only connected options and must use at least one far-side static player before finishing at the end target. When the disc reaches the end, that player throws a floaty return shot back toward the start so both offense and defense can attack it.",
        coaching_points: [
          "Advance through give-go rhythm and misdirection, not by staring at the end target",
          "Use the far side, if every touch stays on the same side the shape gets sticky",
          "Static players should communicate early and put the return pass where the runner can attack it",
        ],
        equipment: ["cones (6)", "discs (3)"],
      },
      {
        name: "4v4 Triangle Game",
        description:
          "Play 4v4 in a 30x40 yard box. Start each rep from a static disc and require the offense to build connected triangles around the thrower instead of flooding the disc. Freeze and reset whenever spacing gets too tight or a player gets disconnected. Play short games to 3 so the reps stay sharp.",
        coaching_points: [
          "If you are lost, find two teammates and make a clean triangle without crowding them",
          "Only the nearby triangle should connect directly to the thrower, not everybody at once",
          "When one player cuts toward you, someone else should balance the shape by drifting out or filling behind",
        ],
        equipment: ["cones (4)", "discs (2)", "pinnies (8)"],
      },
      {
        name: "5v5 Keepdisc Waves",
        description:
          "Play 5v5 or 7v7 in a roomy half-field box. Teams alternate 60-second possession waves, trying to keep the disc for the full rep while staying in hex shape. Score 1 point for holding possession when the whistle blows. Reset quickly and run several waves so players feel how efficient movement matters under fatigue.",
        coaching_points: [
          "Do not surround the disc, only a few players should be directly connected to the thrower",
          "Take the easy pass even if it is sideways or backward, sustainable possession is the goal",
          "When you feel crowded, someone else is usually disconnected, fix the chain not just your own spot",
        ],
        equipment: ["cones (4)", "discs (3)", "pinnies (10)"],
      },
    ],
  },
  "reset corners": {
    warmup: {
      name: "Four-Corner Reset Warm-Up",
      description:
        "Set 4 cones around a handler: Alpha (power-side behind), Beta (aggressive break-side behind), Burnie (break-side lateral), Trail (far behind, least guarded). A handler stands with a disc. One reset player jogs to each position in sequence — Alpha, Beta, Burnie, Trail — receives a pass at each spot, throws it back, then moves to the next. 5 full rotations per pair. This builds muscle memory for WHERE the four reset positions are.",
      coaching_points: [
        "Alpha is the 'power position' — easy to read, easy to throw, but vulnerable to switches. It's the dump everyone knows.",
        "Beta is more aggressive — tighter throwing window, but harder for the defense to switch or junk. Think of it as the dump they DON'T expect.",
        "Burnie opens break-side lanes with easy throws. Trail is the least-guarded corner — great for give-and-go break looks.",
      ],
      equipment: ["cones (8)", "discs (6)"],
    },
    drill_1: {
      name: "Shown Space & Hurry-Up-and-Wait",
      description:
        "3-person drill: thrower, reset, defender on the reset. Reset player must 'show space' — sprint hard to one reset corner (e.g. Alpha), pause for half a second to show the thrower they're open (the 'hurry up' part), then WAIT there instead of continuing to run (the 'wait' part). If the throw doesn't come in 1 second, clear to a different corner and show space again. Thrower has a stall count of 5. Rotate after 5 reps. Progress: defender plays live, reset must read which corner the defender gives up.",
      coaching_points: [
        "The core principle is 'hurry up and wait' — sprint to the spot, then STOP. Don't drift through it.",
        "Show space means making yourself visible AND throwable — face the thrower, hands ready, not running away from them",
        "If the defender face-guards you at Alpha, Burnie and Trail are wide open. Read the defense, don't just run patterns.",
      ],
      equipment: ["cones (4)", "discs (3)"],
    },
    drill_2: {
      name: "Switch Reads & Counter Moves",
      description:
        "4v4 in a 20x30 yard box. Offense must complete 2 reset touches before going downfield. Defense is instructed to switch on every reset cut for the first 5 points, then play straight-up for the next 5. Offense must learn to READ the switch: if the defense switches, the give-and-go from Alpha is dead — go to Beta or Trail instead. If they DON'T switch, Alpha give-and-go is gold. After each point, offense says out loud: 'They switched' or 'They didn't switch' — build the habit of reading it.",
      coaching_points: [
        "Alpha is vulnerable to switches — if you see the switch happen, immediately bail to Beta or Trail",
        "Beta combos are harder to switch because the defender has to travel further. Exploit that.",
        "Read defense over the course of the game: are they switching every time? Only sometimes? Adjust your first look accordingly.",
      ],
      equipment: ["cones (4)", "discs (2)", "pinnies (8)"],
    },
    scrimmage: {
      name: "7v7 Reset Priority Points",
      description:
        "Full 7v7 scrimmage with a special rule: after every completed reset, the stall count resets to 0 (instead of staying where it was). This rewards teams that use their resets aggressively. Play to 5. Between points, coach asks: 'Which corner did you reset to? Was it the right read?' Defense can play anything — person, switch, junk. Offense must adapt their reset corner reads to whatever the defense shows.",
      coaching_points: [
        "Use ALL four corners over the course of the game — if you only go to Alpha, the defense will take it away",
        "The best reset is the one the defense isn't expecting. Vary your first look each possession.",
        "Hurry up and wait: sprint to the corner, show space, be patient. Don't panic if the first look isn't there.",
      ],
      equipment: ["cones (4)", "discs (3)", "pinnies (14)"],
    },
    conditioning: {
      name: "Four-Corner Sprint Circuit",
      description:
        "Set 4 cones in a diamond, 10 yards apart (representing Alpha, Beta, Burnie, Trail). Sprint from center to Alpha, back to center. Sprint to Beta, back. Sprint to Burnie, back. Sprint to Trail, back. That's 1 rep. Rest 20 seconds. 8 reps. Each sprint simulates the explosive cut to a reset position.",
      coaching_points: [
        "Plant hard at each cone — simulate arriving at the reset position and stopping ('hurry up and wait')",
        "First 3 steps out of the center are everything — be explosive",
        "Maintain form through all 8 reps — resets happen in the 4th quarter too",
      ],
      equipment: ["cones (5)"],
    },
  },
  "scram defense": {
    warmup: {
      name: "Cascading Pressure Warm-Up",
      description:
        "Groups of 4: 3 defenders, 1 offensive player with a disc. The 3 defenders are in a triangle, 10 yards apart. Coach calls a 'hot spot' (mark, reset, under, deep) and the nearest defender sprints to that spot while the other two shift to cover the gaps. No offense yet — just building the movement patterns. Then add a second offensive player who runs routes while defenders practice the cascading shifts. 5 minutes of walkthroughs, 5 minutes at jog speed.",
      coaching_points: [
        "SCRAM is NOT zone — it's cascading person-to-person pressure. You always have a primary assignment; you're just helping teammates when the hot spot appears.",
        "The shift is a SPRINT, not a jog. If you're walking to the hot spot, the offense will eat you alive.",
        "Success in SCRAM is usually established by players two removed from the play — the help defender's help defender is the one who makes it work.",
      ],
      equipment: ["cones (8)", "discs (4)"],
    },
    drill_1: {
      name: "Pass-Off vs Switch Drill",
      description:
        "3v3 in a 20x20 yard box. Defenders practice two distinct techniques: SWITCH (two defenders swap assignments when cutters cross) and PASS-OFF (the receiving defender sprints ahead and overtakes, keeping the original matchup). Coach calls 'switch!' or 'pass-off!' before each rep so defenders know which technique to use. After 5 reps of each, play 5 live reps where defenders choose which technique fits the situation. The key difference: in a pass-off, the receiving defender must SPRINT past to overtake — they don't just bump and trade.",
      coaching_points: [
        "Pass-off is NOT the same as a switch — the receiving defender sprints and overtakes to maintain the advantageous matchup",
        "Switch when the cutters are even and neither defender has leverage. Pass-off when one defender has a clear speed or position advantage worth keeping.",
        "Communicate LOUDLY: 'switch!' or 'I've got through!' — if you're silent, collisions happen and nobody covers anyone",
      ],
      equipment: ["cones (4)", "discs (2)", "pinnies (6)"],
    },
    drill_2: {
      name: "Cover 3 Rotation & Hot Spot Sends",
      description:
        "7v4 drill: 7 offensive players set up in a standard vertical stack, 4 defenders play SCRAM coverage. The 4 defenders form a rotating triangle (Cover 3) plus one 'send' defender who goes to the hot spot. Coach designates the hot spot before each rep: mark, reset, open-side under, or deep. The send defender sprints to the hot spot. The other 3 rotate into Cover 3: one takes the force-side deep, one takes the break-side deep, one becomes the 'voice and joystick' — the weakside defender who directs traffic and calls out threats. Offense runs their cuts; defense practices the rotation. 5 reps at each hot spot.",
      coaching_points: [
        "The weakside defender in Cover 3 is the 'voice and joystick' — they don't guard anyone directly but call out every threat and direct traffic",
        "When the send goes to the hot spot, the Cover 3 rotation must happen IMMEDIATELY — no delay or the offense finds the gap",
        "Return-to-man framework: Recognize the threat is gone, Respect that the offense might counter, Reduce back to your primary assignment",
      ],
      equipment: ["cones (4)", "discs (3)", "pinnies (8)"],
    },
    scrimmage: {
      name: "7v7 SCRAM Points",
      description:
        "Full 7v7 scrimmage. Defense MUST play SCRAM (not zone, not straight person-to-person). Before each point, defense huddles and designates: who is the initial send? What's the hot spot? Play to 5. After each point, defense debriefs: 'Did we recognize when to return to man? Did the Cover 3 rotation hold?' Coach should watch for defenders who forget to return to their primary assignment after the SCRAM pressure is no longer needed (the 'Reduce' step).",
      coaching_points: [
        "SCRAM is NOT zone — you always have a person. The send is temporary extra pressure, not a permanent poach.",
        "The Recognize-Respect-Reduce framework: Recognize the threat is neutralized, Respect that offense might adjust, THEN Reduce back to your primary matchup",
        "If SCRAM feels like zone, you're doing it wrong. Every defender should be able to name their primary assignment at any moment.",
      ],
      equipment: ["cones (4)", "discs (3)", "pinnies (14)"],
    },
    conditioning: {
      name: "SCRAM Sprint Rotations",
      description:
        "4 players, 4 cones in a 15-yard square. Player 1 sprints to the hot spot (cone 2), Player 2 rotates to cover Player 1's cone, Player 3 rotates to cover Player 2's cone, Player 4 becomes the voice (stays and points). Whistle: everyone resets. New hot spot called. 30 seconds on, 15 seconds rest. 10 rounds. Simulates the cascading sprint-and-rotate movement pattern of SCRAM.",
      coaching_points: [
        "The sprint to the hot spot must be full speed — half-speed SCRAM doesn't work",
        "The cascade (2 covers 1, 3 covers 2) must happen in ONE beat, not sequentially",
        "The voice player points and calls — practice being loud even when winded",
      ],
      equipment: ["cones (4)"],
    },
  },
  "double team": {
    warmup: {
      name: "360 Pivot & Contact Warm-Up",
      description:
        "Partners face each other, 2 yards apart. Player with disc practices full 360-degree pivots: start facing the partner (mark), pivot all the way around while keeping the disc protected, looking for throwing lanes at every angle. 10 full pivots each direction. Then: partner applies light hand pressure on the thrower's shoulder while they pivot — practice using the contact as information (where is the defender?) rather than fighting it. Pair with arm circles, hip openers, and wrist rolls.",
      coaching_points: [
        "360 pivots create throwing lanes that don't exist in a normal forehand-backhand pivot — practice looking for windows at every angle",
        "Contact is an ALLY in a double team — the body pressure tells you where the defenders are without having to look",
        "Keep the disc high and protected during the pivot. If you drop the disc to waist level during the spin, the trap defender will get a hand block.",
      ],
      equipment: ["cones (4)", "discs (8)"],
    },
    drill_1: {
      name: "Double Team Offensive Reads",
      description:
        "3v3: 1 handler with disc, 2 cutters vs 2 defenders on the mark + 1 trapping defender. The trapper sets up in one of 4 positions that the coach calls: 45 (force negative throw from middle), 90 Front (funnel throws down the sideline), 90 Back (force backfield/hammer throws), or Sandwich (limit throwing motion on the goal line). Handler must recognize which set the defense is in and find the correct escape: 360 pivot past the 45, high release over the 90 Front, quick inside break against the 90 Back, or patience against the Sandwich. Cutters run engagement routes: double fills (two cutters filling the same lane to create confusion), party cuts (one cutter screens for another), and strikes (hard cuts directly at the disc). 5 reps per defensive set.",
      coaching_points: [
        "Read the trap set FIRST: Is it 45? 90 Front? 90 Back? Sandwich? Each has a different escape route.",
        "Against 45: your full 360 pivot creates a lane the 45 can't cover. Against 90 Front: go high release or hammer over the top.",
        "Cutters: double fills and party cuts are your best friend against a double team — they create confusion for the off-disc defenders",
      ],
      equipment: ["cones (4)", "discs (3)", "pinnies (6)"],
    },
    drill_2: {
      name: "Defensive Double Team Sets",
      description:
        "4v4: 2 defenders on the mark (primary mark + trapper), 2 defenders on cutters. Defense practices the 4 double team sets. Coach calls the set before each rep. 45: trapper positions 45 degrees from the mark, forcing the thrower to throw a negative (backwards) throw. 90 Front: trapper is 90 degrees in front, funneling throws down the sideline. 90 Back: trapper is 90 degrees behind, forcing backfield or hammer throws. Sandwich: both defenders face the thrower from opposite sides, limiting all throwing motion (used on the goal line). Defense rotates through all 4 sets. Offense plays live. The goal is NOT a hand block — it's gaining an advantage for your teammates off the disc.",
      coaching_points: [
        "The goal of the double team is NOT a hand block — it's forcing a bad throw that gives your off-disc teammates an advantage",
        "45 set: position yourself to take away the thrower's first instinct. 90 Front: make them throw into your wall.",
        "Sandwich is a GOAL LINE set only. Don't use it in open field — the thrower will pivot around you.",
      ],
      equipment: ["cones (4)", "discs (3)", "pinnies (8)"],
    },
    scrimmage: {
      name: "7v7 Double Team Triggers",
      description:
        "Full 7v7 scrimmage. Defense plays normal person-to-person, but coach designates a 'trigger' — a specific field position (e.g. sideline trap, mid-field, goal line) where the defense must throw a double team. When the disc reaches the trigger zone, the nearest off-disc defender sprints to trap. Play to 5. Between points, debrief both sides: offense — 'Did you recognize the trap coming? Did your cutters engage?' Defense — 'Did the trap create an advantage for the off-disc defenders? Or did the thrower escape?'",
      coaching_points: [
        "The double team should feel like a surprise to the offense — sprint to the trap, don't jog",
        "Offense: when you see the trap coming, cutters must engage IMMEDIATELY with double fills, party cuts, or strikes — don't leave the handler alone",
        "Defense: the off-disc defenders are the real weapon. The double team holds the disc; the off-disc defenders take away the escape.",
      ],
      equipment: ["cones (4)", "discs (3)", "pinnies (14)"],
    },
    conditioning: {
      name: "Pivot Power & Sprint Recovery",
      description:
        "At a cone: 5 full 360-degree pivots (alternating direction), then throw. Sprint 20 yards to the next cone, catch a pass, 5 more 360 pivots, throw. Sprint to the next. 4 stations. Rest 30 seconds. 4 sets. This simulates the physical demand of escaping a double team (sustained pivoting under pressure) followed by the sprint to the next action.",
      coaching_points: [
        "Full 360s — don't cheat to 270. The disc must make a complete revolution.",
        "Stay balanced through the pivot even when tired — double teams in the 4th quarter are the ones that matter",
        "Throw quality after the pivot matters more than pivot speed — a turnover from a rushed pivot is worse than a stall",
      ],
      equipment: ["cones (4)", "discs (4)"],
    },
  },
  "chunk yards": {
    warmup: {
      name: "Cutter-to-Cutter Continuation Warm-Up",
      description:
        "Two lines of cutters face each other, 20 yards apart, with a handler at one end. Handler throws to Cutter 1 who is cutting under. Cutter 1 catches, pivots, and immediately throws a continuation pass to Cutter 2 who is cutting deep from the opposite line. Cutter 2 catches, pivots, and throws back to a new Cutter 1 cutting under. Continuous flow — no stopping. The point: chunk yards are gained through cutter-to-cutter continuations, not handler-to-cutter-back-to-handler.",
      coaching_points: [
        "The key to chunk yards is cutter-to-cutter — the disc should NOT come back to the handler after every throw",
        "Power cuts: explode into the cut with your first 3 steps at max speed. Change of speed > change of direction.",
        "The continuation cutter starts moving the moment the first throw is released — timing, not reaction",
      ],
      equipment: ["cones (6)", "discs (6)"],
    },
    drill_1: {
      name: "Attack Column 2v2 & 3v3",
      description:
        "Set a 15-yard-wide 'attack column' down the center of the field (mark with cones on both sides). Play 2v2 inside the column: cutters can only operate within the column, making power cuts under and deep. Handler starts the disc from outside the column. Cutter 1 cuts under, catches, hits Cutter 2 going deep — that's a chunk. Play to 3 chunks (a 'chunk' = a cutter-to-cutter completion that gains 10+ yards). Then expand to 3v3: same rules, but now cutters must create 2v2 and 3v3 games within the column — isolations, picks, and coordinated cuts.",
      coaching_points: [
        "The attack column is where chunk yards happen — keep the disc in the middle of the field, not the sideline",
        "In 2v2, one cutter goes under while the other goes deep. Simple. Don't overthink it.",
        "In 3v3, create games: two cutters running coordinated cuts to free the third. Think 'pick and roll' from basketball.",
      ],
      equipment: ["cones (8)", "discs (3)", "pinnies (6)"],
    },
    drill_2: {
      name: "Stack Formation Progression",
      description:
        "Walk through 3 stack formations, then play live from each. Formation 1: 3-2 stack (3 cutters in a line, 2 behind/beside). Cutter 1 attacks under, Cutter 2 attacks deep, Cutter 3 fills the vacated space. Formation 2: 4-1 stack (4 in a tight stack, 1 iso cutter). The iso cutter has the entire break-side to work with. Formation 3: 2-1-2 stack (2 up, 1 middle, 2 back). The middle player is the trigger — when they cut, the others react. Play 5 live reps from each formation. Cutters must stay ahead of the defense by attacking break-side and avoiding the sidelines.",
      coaching_points: [
        "3-2 is your default: balanced, versatile, hard to defend. Use it when you don't have a specific plan.",
        "4-1 is for your best cutter — give them space and let them work. The 4-stack clears the lane.",
        "2-1-2 creates natural 2v2 games at the top and bottom. The middle player is the trigger who decides which game starts first.",
      ],
      equipment: ["cones (8)", "discs (3)", "pinnies (8)"],
    },
    scrimmage: {
      name: "7v7 Chunk Yards Scrimmage",
      description:
        "Full 7v7 with a modified scoring system: a 'chunk' (any cutter-to-cutter completion gaining 10+ yards) is worth 1 point. A goal is worth 3 points. Play to 15. This incentivizes the team to move the disc through the attack column with cutter-to-cutter continuations instead of dump-swing-dump-swing. Between points, coach calls out which stack formation to use for the next point (rotate through 3-2, 4-1, and 2-1-2).",
      coaching_points: [
        "Handlers maintain flow shape — keep the disc moving, but let the cutters do the yards work",
        "Stay ahead of the defense: after a chunk, the next cut should already be happening. Don't let the defense recover.",
        "Attack break-side aggressively — the defense overplays the open side in chunk yards because that's where the easy throws are. Punish them.",
      ],
      equipment: ["cones (4)", "discs (3)", "pinnies (14)"],
    },
    conditioning: {
      name: "Power Cut Intervals",
      description:
        "3 cones in a line, 15 yards apart. Sprint under-cut to cone 1 (15 yards), plant, sprint deep to cone 2 (30 yards total), plant, sprint under to cone 3 (15 yards). That's 1 rep — 45 yards of power cuts. Rest 30 seconds. 8 reps. The cuts must be POWER cuts: first 3 steps at absolute maximum acceleration, not a gradual buildup.",
      coaching_points: [
        "Power cuts are the engine of chunk yards — if you jog into the cut, the defender stays with you",
        "First 3 steps are everything. Explode out of the plant like a sprinter out of blocks.",
        "Maintain cutting form even on rep 8 — chunk yards happen in the 4th quarter when legs are heavy",
      ],
      equipment: ["cones (3)"],
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

function getBuiltInDrillId(
  focusKey: string,
  sectionKey: string,
  index?: number
): string {
  return ["built-in", focusKey, sectionKey, index]
    .filter((value) => value !== undefined)
    .join(":");
}

function resolveBuiltInDrill(
  drillId: string,
  fallback: Drill,
  overrides: Record<string, Drill>
): Drill {
  return overrides[drillId] ?? fallback;
}

export function listEditableBuiltInDrills(
  overrides: Record<string, Drill> = {}
): EditableBuiltInDrill[] {
  const drills: EditableBuiltInDrill[] = [];

  for (const focusKey of Object.keys(DRILL_LIBRARY)) {
    const focusSet = DRILL_LIBRARY[focusKey];
    const baseSections: Array<[string, Drill]> = [
      ["warmup", focusSet.warmup],
      ["drill_1", focusSet.drill_1],
      ["drill_2", focusSet.drill_2],
      ["scrimmage", focusSet.scrimmage],
      ["conditioning", focusSet.conditioning],
    ];

    for (const [sectionKey, drill] of baseSections) {
      const id = getBuiltInDrillId(focusKey, sectionKey);
      drills.push({
        ...resolveBuiltInDrill(id, drill, overrides),
        id,
        focusAreas: [focusKey],
        sectionKey,
        sectionLabel: SECTION_LABELS[sectionKey] ?? sectionKey,
        isOverridden: !!overrides[id],
      });
    }

    for (const [index, drill] of (focusSet.extras ?? []).entries()) {
      const id = getBuiltInDrillId(focusKey, "extra", index);
      drills.push({
        ...resolveBuiltInDrill(id, drill, overrides),
        id,
        focusAreas: [focusKey],
        sectionKey: "extra",
        sectionLabel: SECTION_LABELS.extra,
        isOverridden: !!overrides[id],
      });
    }
  }

  const generalDrills: Array<[string, Drill]> = [
    ["cooldown", COOLDOWN],
    ["freeplay", FREE_PLAY],
  ];

  for (const [sectionKey, drill] of generalDrills) {
    const id = getBuiltInDrillId("general", sectionKey);
    drills.push({
      ...resolveBuiltInDrill(id, drill, overrides),
      id,
      focusAreas: ["general"],
      sectionKey,
      sectionLabel: SECTION_LABELS[sectionKey] ?? sectionKey,
      isOverridden: !!overrides[id],
    });
  }

  return drills;
}

export function getExtraDrillsForFocus(
  focusKey: string,
  overrides: Record<string, Drill> = {}
): Drill[] {
  return (DRILL_LIBRARY[focusKey]?.extras ?? []).map((drill, index) =>
    resolveBuiltInDrill(getBuiltInDrillId(focusKey, "extra", index), drill, overrides)
  );
}

export function generateSchedule(
  focusKey: string,
  overrides: Record<string, Drill> = {}
): ScheduleBlock[] {
  const drills = DRILL_LIBRARY[focusKey];
  if (!drills) return [];

  const sections: { key: string; label: string; drill: Drill; duration: number }[] = [
    {
      key: "warmup",
      label: "Warm-Up",
      drill: resolveBuiltInDrill(
        getBuiltInDrillId(focusKey, "warmup"),
        drills.warmup,
        overrides
      ),
      duration: 15,
    },
    {
      key: "drill_1",
      label: "Skill Drill 1",
      drill: resolveBuiltInDrill(
        getBuiltInDrillId(focusKey, "drill_1"),
        drills.drill_1,
        overrides
      ),
      duration: 20,
    },
    {
      key: "drill_2",
      label: "Skill Drill 2",
      drill: resolveBuiltInDrill(
        getBuiltInDrillId(focusKey, "drill_2"),
        drills.drill_2,
        overrides
      ),
      duration: 20,
    },
    {
      key: "scrimmage",
      label: "Scrimmage",
      drill: resolveBuiltInDrill(
        getBuiltInDrillId(focusKey, "scrimmage"),
        drills.scrimmage,
        overrides
      ),
      duration: 30,
    },
    {
      key: "conditioning",
      label: "Conditioning",
      drill: resolveBuiltInDrill(
        getBuiltInDrillId(focusKey, "conditioning"),
        drills.conditioning,
        overrides
      ),
      duration: 15,
    },
    {
      key: "cooldown",
      label: "Cool-Down",
      drill: resolveBuiltInDrill(
        getBuiltInDrillId("general", "cooldown"),
        COOLDOWN,
        overrides
      ),
      duration: COOLDOWN.duration,
    },
    {
      key: "freeplay",
      label: "Free Play",
      drill: resolveBuiltInDrill(
        getBuiltInDrillId("general", "freeplay"),
        FREE_PLAY,
        overrides
      ),
      duration: FREE_PLAY.duration,
    },
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
