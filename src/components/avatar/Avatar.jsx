import React from "react";

const Avatar = ({ name, size = 50, backgroundColor = "#3533cd", textColor = "white" }) => {
  const getInitials = (fullName) => {
    if (!fullName) return "";
    const parts = fullName.trim().split(" ");
    return parts.map(p => p[0].toUpperCase()).slice(0, 2).join("");
  };

  const initials = getInitials(name);

  const style = {
    width: size,
    height: size,
    borderRadius: "50%",
    backgroundColor,
    color: textColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: size / 2.5,
    fontFamily: "sans-serif",
    textTransform: "uppercase",
    userSelect: "none",
  };

  return <div style={style}>{initials}</div>;
};

export default Avatar;
