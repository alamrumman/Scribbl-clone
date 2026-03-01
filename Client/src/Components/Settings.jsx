import { AlarmClockCheck, AArrowDown } from "lucide-react";
import { UserRoundCog, CircleDotDashed } from "lucide-react";
function Settings({ settings, setSettings }) {
  return (
    <div className="grid grid-cols-2 gap-4 p-2">
      {/* Players */}
      <div className="flex gap-1 items-center">
        <UserRoundCog />
        <div className="flex-[5]">Players</div>
        <select
          value={settings.players}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              players: Number(e.target.value),
            }))
          }
          className="flex-[3]"
        >
          {[2, 3, 4, 5, 6, 7, 8].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Drawtime */}
      <div className="flex gap-1 items-center">
        <AlarmClockCheck />
        <div className="flex-[5]">Drawtime</div>
        <select
          value={settings.drawtime}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              drawtime: Number(e.target.value),
            }))
          }
          className="flex-[3]"
        >
          <option value={50}>50</option>
          <option value={30}>30</option>
        </select>
      </div>

      {/* Rounds */}
      <div className="flex gap-1 items-center">
        <CircleDotDashed />
        <div className="flex-[5]">Rounds</div>
        <select
          value={settings.rounds}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              rounds: Number(e.target.value),
            }))
          }
          className="flex-[3]"
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
        </select>
      </div>

      {/* Word Count */}
      <div className="flex gap-1 items-center">
        <AArrowDown />
        <div className="flex-[5]">Word count</div>
        <select
          value={settings.wordCount}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              wordCount: Number(e.target.value),
            }))
          }
          className="flex-[3]"
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
        </select>
      </div>
    </div>
  );
}

export default Settings;
