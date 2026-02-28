import { useState } from "react";

export default function LanguageSelect() {
  const [language, setLanguage] = useState("English");

  const languages = ["English", "German", "Italian", "Japanese"];

  return (
    <div className="">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className=" p-1 border rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
}
