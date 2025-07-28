import React, { useState } from 'react';

interface App {
  name: string;
  description: string;
  link: string;
  icon: string; // Add icon property
}

const apps: App[] = [
  {
    name: "Roots",
    description: "Roots - Habit and Streak Tracker",
    link: "https://apps.apple.com/us/app/roots-habit-tracker/id6748220776",
    icon: "/roots_logo.png",
  },
  {
    name: "Anime AI Hero",
    description: "Anime AI Hero - Transform photos into anime art",
    link: "https://apps.apple.com/us/app/anime-ai-hero/id6747114814",
    icon: "/anime_ai_hero_logo.png",
  },
  {
    name: "StraySync",
    description: "StraySync - Find your way back home",
    link: "https://apps.apple.com/us/app/straysync/id6742747753",
    icon: "/cat-icon.jpg",
  },
  {
    name: "Decaff",
    description: "Decaff - Caffeine tracker",
    link: "https://apps.apple.com/us/app/decaff-caffeine-tracker/id6739958581",
    icon: "/decaff_logo.jpeg",
  },
  {
    name: "Meditrace",
    description: "Meditrace - Meditation App",
    link: "https://apps.apple.com/us/app/meditrace-meditation-app/id6737521772",
    icon: "/meditrace_logo.png",
  },
  {
    name: "Pixel Mint",
    description: "Pixel Mint - AI Art Generator",
    link: "https://www.pixelmint.art/",
    icon: "/pixel_mint_logo.png",
  },
];

const IconBar = () => {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const [groupHovered, setGroupHovered] = useState(false);

  return (
    <div
      className="flex items-center space-x-0 mt-6 justify-center group"
      onMouseEnter={() => setGroupHovered(true)}
      onMouseLeave={() => setGroupHovered(false)}
    >
      <span className="font-medium mr-2 transition-all duration-300 group-hover:mr-6 text-text-color dark:text-text-color">My apps</span>
      {apps.map((app, index) => (
        <a
          key={index}
          href={app.link}
          target="_blank"
          rel="noopener noreferrer"
          className="relative transition-all duration-300 transform -translate-x-1/2"
          style={{ zIndex: apps.length - index }}
          aria-label={`Open ${app.name} in a new tab`}
          onMouseEnter={() => setHoveredApp(app.name)}
          onMouseLeave={() => setHoveredApp(null)}
        >
          {/* App icon */}
          <div
            className="w-10 h-10 rounded-2xl bg-gray-200 flex items-center justify-center text-xs font-bold transition-all duration-300 -mr-5 group-hover:mr-2 overflow-hidden dark:bg-gray-700 text-text-color dark:text-text-color"
            style={{ transform: `rotate(${groupHovered ? 0 : index * 6 - 9}deg) scale(${groupHovered ? 1 : 0.75})` }}>
            {app.icon ? (
              <img src={app.icon} alt={`${app.name} icon`} className="w-full h-full object-cover" />
            ) : (
              // Placeholder icon if no image is available
              <span className="text-xs font-bold text-text-color dark:text-text-color">{app.name.charAt(0)}</span>
            )
            }
          </div>
          {/* Tooltip */}
          <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 transition-all duration-300 scale-95 pointer-events-none z-10 whitespace-nowrap ${hoveredApp === app.name ? 'opacity-100 scale-100' : ''} dark:bg-gray-700`}>
            <div className="tooltip-arrow absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            {app.description}
          </div>
        </a>
      ))}
    </div>
  );
};

export default IconBar;
