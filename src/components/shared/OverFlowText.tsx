import React, { useEffect, useRef, useState } from "react";
type OverFlowTextProps = {
  children: React.ReactNode;
  height?: string;
  width?: string;
};
const OverFlowText = ({ children, height, width }: OverFlowTextProps) => {
  const containerStyle: React.CSSProperties = {
    height: height ? `${height}px` : "unset",
    width: width ? `${width}px` : "unset",
    overflow: "hidden",
  };
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOverflowed, setIsOverflowed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setIsOverflowed(
        container.scrollHeight > container.clientHeight ||
          container.scrollWidth > container.clientWidth
      );
    }
  }, [children, height, width]);
  const [wrap, setWrap] = useState(true);

  //   const toggleWrap = (){}
  return (
    <>
      <div
        ref={containerRef}
        style={containerStyle}
        className={`${
          wrap ? "whitespace-nowrap overflow-hidden text-ellipsis" : ""
        }`}
      >
        {children}
      </div>
      {isOverflowed && (
        <span
          onClick={() => setWrap(!wrap)}
          className="btn text-primary-600 underline text-[14px] cursor-pointer"
        >
          {wrap ? "more" : "narrow"}
        </span>
      )}
    </>
  );
};

export default OverFlowText;
