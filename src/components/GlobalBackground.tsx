import React from "react";

const GlobalBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: "url('/images/background.png')",
        zIndex: -50,
        pointerEvents: "none",
      }}
    />
  );
};

export default GlobalBackground;
