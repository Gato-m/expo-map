import * as React from "react";
import Svg, { Ellipse, Path } from "react-native-svg";

const MARKER_PATH_D =
  "M252.08 725.43c17.02-36.05 32.73-69.05 49.74-105.11 24.58-51.99 49.18-103.97 73.69-155.99 14.82-31.25 29.53-62.56 44.34-93.82C546.84 165.98 349.78-77.74 124.89 23.8-2.64 85.33-29.51 240.45 30.65 363.29c6.54 13.35 176.14 359.6 178.66 364.74 9.95 20.31 33.08 17.86 42.77-2.6ZM1061.55 696.61c31.14-24.89 59.77-47.61 90.9-72.51 44.94-35.88 89.9-71.74 134.8-107.68 27.06-21.55 54.04-43.19 81.09-64.75 204.01-127.81 134.24-433.38-112.39-441.11-141.6-.84-233.96 126.64-233.96 263.43v406.14c0 22.61 21.85 30.59 39.55 16.48Z";

export function getMarkerSvgDataUri({
  color = "#F19020",
  shadowColor = "#777b7f",
} = {}) {
  const svg = `<svg viewBox="0 0 1487.94 759.07" xmlns="http://www.w3.org/2000/svg"><ellipse cx="236.19" cy="736.07" rx="156.7" ry="23" fill="${shadowColor}" fill-opacity="0.27"/><path d="${MARKER_PATH_D}" fill="${color}"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const Marker = React.memo(function Marker({
  width = 48,
  height = 24,
  color = "#F19020",
  shadowColor = "#777b7f",
  ...props
}) {
  return (
    <Svg viewBox="0 0 1487.94 759.07" width={width} height={height} {...props}>
      <Ellipse
        cx={236.19}
        cy={736.07}
        rx={156.7}
        ry={23}
        fill={shadowColor}
        fillOpacity={0.27}
      />
      <Path d={MARKER_PATH_D} fill={color} />
    </Svg>
  );
});

export default Marker;
