import React from "react";
import { useState, useEffect } from "react";
import Avatar from "@/Components/Avatar";
function PlayerList({ players }) {
  if (!players) return;

  return (
    <div>
      <ol className="bg-white rounded-lg">
        {players.map((player, index) => (
          <li
            key={player.id}
            className="flex items-center gap-3 px-3 py-2 border-b-4"
          >
            <span className="font-bold w-2">{index + 1}.</span>
            <Avatar index={player.avatarIndex} size={52} />
            <span className="font-medium">{player.username}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default PlayerList;
