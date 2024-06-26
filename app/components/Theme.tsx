import React from "react";

export default function Theme({ changeTheme }: { changeTheme: any }) {
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-neutral m-3">
        Theme
        <svg
          width="12px"
          height="12px"
          className="h-2 w-2 fill-current opacity-60 inline-block"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box"
      >
        {[
          "luxury",
          "retro",
          "dim",
          "coffee",
          "night",
          "dark",
          "nord",
          "aqua",
        ].map((theme) => (
          <li key={theme}>
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller btn btn-sm btn-ghost justify-start w-full "
              aria-label={theme.charAt(0).toUpperCase() + theme.slice(1)}
              value={theme}
              onClick={changeTheme}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
