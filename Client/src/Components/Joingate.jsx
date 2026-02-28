import React from "react";
import LanguageSelect from "./Drop";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useRef } from "react";
import { socket } from "../socket";
import Spinner from "./Spinner";
import { AvatarPicker } from "./Avatar";

function Joingate({ onSuccess }) {
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [name, setName] = useState("");
  const submittingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get("code");

  const handleJoin = async () => {
    if (!name.trim()) {
      alert("Enter username");
      return;
    }

    if (submittingRef.current) return;
    submittingRef.current = true;

    try {
      setLoading(true);
      setShowSpinner(true);

      // ✅ 1. REST VALIDATION ONLY
      const res = await fetch("http://localhost:5000/api/rooms/random-join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomCode,
          username: name.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        setLoading(false);
        setShowSpinner(false);
        submittingRef.current = false;
        return;
      }

      // ✅ 2. SAVE TO LOCALSTORAGE
      localStorage.setItem(
        `room-${roomCode}`,
        JSON.stringify({
          username: name.trim(),
          avatarIndex: selectedAvatar,
        }),
      );

      // ✅ 3. EMIT SOCKET JOIN
      socket.emit("join-room", {
        roomCode,
        player: {
          username: name.trim(),
          avatarIndex: selectedAvatar,
        },
      });

      // ✅ 4. CLOSE OVERLAY (if parent controls it)
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      alert("Join failed");
    } finally {
      setLoading(false);
      setShowSpinner(false);
      submittingRef.current = false;
    }
  };

  return (
    <div>
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-sm bg-white rounded-md shadow-2xl overflow-hidden mb-30">
          <div className="bg-white mx-1 rounded min-h-80 ">
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
              {showSpinner ? (
                <Spinner />
              ) : (
                <button
                  className="w-full m-2 p-2 text- xl font-bold border border-black rounded shadow-lg mt-5"
                  onClick={handleJoin}
                >
                  Join Room
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Joingate;
