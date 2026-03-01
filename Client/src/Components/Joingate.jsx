import React from "react";
import LanguageSelect from "./Drop";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useRef } from "react";
import { socket } from "../socket";
import Spinner from "./Spinner";
import { AvatarPicker } from "./Avatar";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Joingate({ onSuccess }) {
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [name, setName] = useState("");
  const submittingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get("code");

  const handleJoin = () => {
    if (!name.trim()) {
      toast.info("Username Required!");
      return;
    }

    if (submittingRef.current) return;
    submittingRef.current = true;

    setLoading(true);
    setShowSpinner(true);

    const stableId = crypto.randomUUID(); // ✅ generate before emit, no import needed

    socket.emit(
      "join-room",
      {
        roomCode,
        player: {
          id: stableId, // ✅ send to server
          username: name.trim(),
          avatarIndex: selectedAvatar,
        },
      },
      (response) => {
        if (!response.success) {
          alert(response.message);
          setLoading(false);
          setShowSpinner(false);
          submittingRef.current = false;
          return;
        }

        localStorage.setItem(
          // ✅ save same id after confirmed
          `room-${roomCode}`,
          JSON.stringify({
            id: stableId,
            username: name.trim(),
            avatarIndex: selectedAvatar,
          }),
        );

        if (onSuccess) onSuccess();
        setLoading(false);
        setShowSpinner(false);
        submittingRef.current = false;
        toast.success(`Welcome to ${roomCode}`);
      },
    );
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
