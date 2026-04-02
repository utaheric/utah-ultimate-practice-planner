import { FOCUS_AREAS, FOCUS_AREA_DESCRIPTIONS } from "../data/drills";

const ICONS: Record<string, string> = {
  cutting: "\u2702\uFE0F",
  "zone defense": "\u{1F6E1}\uFE0F",
  "handler movement": "\u{1F3AF}",
  "break throws": "\u{1F4A5}",
  "endzone offense": "\u{1F3C6}",
  "hex offense": "\u2B21",
};

interface Props {
  onSelect: (key: string) => void;
}

export default function FocusAreaCards({ onSelect }: Props) {
  return (
    <section className="focus-cards-section">
      <div className="focus-intro">
        <h2>Select a Focus Area</h2>
        <p>Choose a skill to generate a full 90-minute practice plan.</p>
      </div>
      <div className="focus-grid">
        {FOCUS_AREAS.map((key) => (
          <button
            key={key}
            className="focus-card"
            onClick={() => onSelect(key)}
          >
            <span className="focus-card-icon">{ICONS[key] || "?"}</span>
            <h3 className="focus-card-title">
              {key
                .split(" ")
                .map((w) => w[0].toUpperCase() + w.slice(1))
                .join(" ")}
            </h3>
            <p className="focus-card-desc">{FOCUS_AREA_DESCRIPTIONS[key]}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
