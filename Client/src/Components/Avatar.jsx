// 📁 Place sprite at: public/Images/avatars-sprite.jpg
//
// Each entry is the [cx, cy] center point of that avatar in the 3000x2000 sprite.
// Measured precisely by scanning actual pixel content per cell.

const AVATAR_CENTERS = [
  [250, 604], // 0
  [750, 613], // 1
  [1250, 625], // 2
  [1750, 599], // 3
  [2250, 613], // 4
  [2750, 604], // 5
  [250, 1366], // 6
  [750, 1415], // 7
  [1250, 1531], // 8
  [1750, 1517], // 9
  [2250, 1411], // 10
  [2750, 1392], // 11
];

function Avatar({ index = 0, size = 52 }) {
  const [cx, cy] = AVATAR_CENTERS[index];
  const scale = size / 500;

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundImage: "url(/Images/avatars-sprite.jpg)",
        backgroundSize: `${3350 * scale}px ${2005 * scale}px`,
        backgroundPosition: `${size / 7 - cx * scale}px ${size / 1.4 - cy * scale}px`,
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}

export function AvatarPicker({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-6 gap-2 px-2">
      {AVATAR_CENTERS.map((_, i) => (
        <div
          key={i}
          onClick={() => onSelect(i)}
          className={`rounded-xl overflow-hidden cursor-pointer transition-all ${
            selected === i
              ? "ring-4 ring-blue-500 scale-105"
              : "ring-2 ring-gray-200 hover:ring-blue-300 hover:scale-105"
          }`}
        >
          <Avatar index={i} size={52} />
        </div>
      ))}
    </div>
  );
}

export default Avatar;
