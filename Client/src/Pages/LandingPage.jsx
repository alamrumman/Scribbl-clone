import LanguageSelect from "../Components/Drop";
import { useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "@/Components/Spinner";
import { AvatarPicker } from "../Components/Avatar";
import { socket } from "@/socket";

function LandingPage() {
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [name, setName] = useState("");
  const submittingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const handlePrivatroom = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;

    setLoading(true);
    setShowSpinner(true);
    try {
      const res = await fetch("http://localhost:5000/api/rooms/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          avatarIndex: selectedAvatar,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (!data.roomCode) {
        throw new Error("Room code generation failed check backend");
      }
      localStorage.setItem(
        `room-${data.roomCode}`,
        JSON.stringify({
          username: name.trim(),
          avatarIndex: selectedAvatar,
        }),
      );
      socket.emit("join-room", {
        roomCode: data.roomCode,
        player: {
          username: name.trim(),
          avatarIndex: selectedAvatar,
          role: "host", // optional but recommended
        },
      });
      navigate(`/room-code?code=${data.roomCode}`);
    } catch (error) {}
  };

  return (
    <div
      className="min-h-screen flex justify-center"
      style={{
        backgroundImage: "url(/Images/main_bg.jpg)",
      }}
    >
      <div>
        <div className="flex justify-center py-10">
          <label
            htmlFor=""
            className="text-7xl font-extrabold bg-white tracking-widest border-0"
          >
            SKRIBBL
          </label>
        </div>
        <div className="bg-white mx-1 rounded min-h-80">
          <div className="nameAndlang flex justify-around py-3 gap-0">
            <div>
              <input
                type="text"
                placeholder="Enter your name"
                className="p-1 bg-gray-100 border shadow-md "
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div>
              <LanguageSelect />
            </div>
          </div>
          <div className="flex justify-center h-30 ">
            <div>
              {" "}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex justify-center p-2">
                  Pick your avatar
                </p>
                <AvatarPicker
                  selected={selectedAvatar}
                  onSelect={setSelectedAvatar}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button className="w-full m-2 p-2 mt-10 text-3xl font-bold border  border-black rounded shadow-lg">
              Play!
            </button>
          </div>
          <div className="flex justify-center">
            {showSpinner ? (
              <Spinner />
            ) : (
              <button
                className="w-full m-2 p-2 text- xl font-bold border border-black rounded shadow-lg "
                onClick={handlePrivatroom}
              >
                Create Private Room
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
