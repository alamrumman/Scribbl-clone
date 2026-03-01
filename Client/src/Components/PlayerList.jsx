import React from "react";
import { useState, useEffect } from "react";
import Avatar from "@/Components/Avatar";

function PlayerList({ players }) {
  if (!players) return;

  return (
    <div
      className="h-56 max-h-56 overflow-scroll"
      style={{
        background: "#fffef7",
        border: "2px solid #1a1a1a",
        borderRadius: "8px",
        boxShadow: "3px 3px 0px #1a1a1a",
      }}
    >
      <ol className="bg-white rounded-lg">
        {players.map((player, index) => (
          <li
            key={player.id}
            className="flex items-center gap-2 px-3 py-2 border-b-4"
          >
            <span className="font-bold ">{index + 1}.</span>
            <Avatar className="" index={player.avatarIndex} size={52} />
            <span className="font-medium">{player.username}</span>
            <span className="font-bold text-yellow-600 text-sm">
              {player.score ?? 0} pts
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default PlayerList;
