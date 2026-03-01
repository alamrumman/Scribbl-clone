import {
  AlarmClockCheck,
  AArrowDown,
  UserRoundCog,
  CircleDotDashed,
} from "lucide-react";

const selectStyle = {
  background: "rgba(255,255,255,0.6)",
  border: "2px solid #1a1a1a",
  borderRadius: "6px",
  padding: "3px 6px",
  fontSize: "14px",
  fontWeight: "700",
  color: "#1a1a1a",
  cursor: "pointer",
  outline: "none",
  boxShadow: "2px 2px 0px #1a1a1a",
  flex: 3,
};

const labelStyle = {
  flex: 5,
  fontSize: "14px",
  fontWeight: "700",
  color: "#1a1a1a",
};

const cards = [
  {
    color: "#fecdd3",
    icon: <UserRoundCog size={18} strokeWidth={2.5} />,
    label: "Players",
    key: "players",
    options: [2, 3, 4, 5, 6, 7, 8].map((n) => ({ value: n, label: n })),
  },
  {
    color: "#fef08a",
    icon: <AlarmClockCheck size={18} strokeWidth={2.5} />,
    label: "Drawtime",
    key: "drawtime",
    options: [
      { value: 50, label: "50s" },
      { value: 30, label: "30s" },
    ],
  },
  {
    color: "#bbf7d0",
    icon: <CircleDotDashed size={18} strokeWidth={2.5} />,
    label: "Rounds",
    key: "rounds",
    options: [
      { value: 3, label: "3" },
      { value: 5, label: "5" },
    ],
  },
  {
    color: "#a5f3fc",
    icon: <AArrowDown size={18} strokeWidth={2.5} />,
    label: "Words",
    key: "wordCount",
    options: [
      { value: 3, label: "3" },
      { value: 5, label: "5" },
    ],
  },
];

function Settings({ settings, setSettings }) {
  return (
    <div
      style={{
        background: "#fffef7",
        border: "2px solid #1a1a1a",
        borderRadius: "8px",
        boxShadow: "3px 3px 0px #1a1a1a",
        padding: "10px",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1.5px solid #e5e5e5",
          paddingBottom: "6px",
          marginBottom: "10px",
          fontSize: "15px",
          fontWeight: "700",
          color: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span>⚙️</span> Settings
      </div>

      <div className="grid grid-cols-2 gap-3">
        {cards.map(({ color, icon, label, key, options }) => (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: color,
              border: "2px solid #1a1a1a",
              borderRadius: "8px",
              padding: "8px 10px",
              boxShadow: "3px 3px 0px #1a1a1a",
            }}
          >
            {icon}
            <div style={labelStyle}>{label}</div>
            <select
              value={settings[key]}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  [key]: Number(e.target.value),
                }))
              }
              style={selectStyle}
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Settings;
