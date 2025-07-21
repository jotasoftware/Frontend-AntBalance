import React from "react";

const Avatar = ({ name, size = 55, backgroundColor = "rgb(235, 235, 235)", textColor = "#191919", shadow= '0px 2px 8px rgba(0, 0, 0, 0.573)', borderSize = 'none'}) => {
  const getInitials = (fullName) => {
    if (!fullName) return "";
    const parts = fullName.trim().split(" ");
    return parts.map(p => p[0].toUpperCase()).slice(0, 2).join("");
  }

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
    cursor: 'pointer',
    boxShadow: shadow,
    border: borderSize
  }

  return <div style={style}>{initials}</div>;
};

export default Avatar;
