import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: "none",
  xmlns: "http://www.w3.org/2000/svg",
};

export function AnalyticsFilled(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="13" width="4" height="8" rx="1" />
      <rect x="10" y="8" width="4" height="13" rx="1" />
      <rect x="17" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}

export function FloorPlanFilled(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

export function OrdersFilled(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 2a2 2 0 0 0-2 2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1a2 2 0 0 0-2-2H9Zm0 2h6v2H9V4Zm-1 7h8v1.5H8V11Zm0 4h8v1.5H8V15Z" />
    </svg>
  );
}

export function KitchenFilled(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.5c-1.9 0-3.55 1.06-4.4 2.62A4.5 4.5 0 0 0 3 9.5c0 1.86 1.13 3.46 2.75 4.15V15h12.5v-1.35A4.5 4.5 0 0 0 21 9.5a4.5 4.5 0 0 0-4.6-4.38A5 5 0 0 0 12 2.5ZM5.75 16.5V20a1.5 1.5 0 0 0 1.5 1.5h9.5a1.5 1.5 0 0 0 1.5-1.5v-3.5H5.75Z" />
    </svg>
  );
}

export function SettingsFilled(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M11.3 1.8a1.6 1.6 0 0 1 1.4 0l1.6.8a1.6 1.6 0 0 0 1.6-.1 1.6 1.6 0 0 1 2.4 1l.4 1.7a1.6 1.6 0 0 0 1.1 1.1l1.7.4a1.6 1.6 0 0 1 1 2.4 1.6 1.6 0 0 0-.1 1.6l.8 1.6c.2.45.2.95 0 1.4l-.8 1.6a1.6 1.6 0 0 0 .1 1.6 1.6 1.6 0 0 1-1 2.4l-1.7.4a1.6 1.6 0 0 0-1.1 1.1l-.4 1.7a1.6 1.6 0 0 1-2.4 1 1.6 1.6 0 0 0-1.6-.1l-1.6.8a1.6 1.6 0 0 1-1.4 0l-1.6-.8a1.6 1.6 0 0 0-1.6.1 1.6 1.6 0 0 1-2.4-1l-.4-1.7a1.6 1.6 0 0 0-1.1-1.1l-1.7-.4a1.6 1.6 0 0 1-1-2.4 1.6 1.6 0 0 0 .1-1.6l-.8-1.6a1.6 1.6 0 0 1 0-1.4l.8-1.6a1.6 1.6 0 0 0-.1-1.6 1.6 1.6 0 0 1 1-2.4l1.7-.4a1.6 1.6 0 0 0 1.1-1.1l.4-1.7a1.6 1.6 0 0 1 2.4-1 1.6 1.6 0 0 0 1.6.1l1.6-.8ZM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
    </svg>
  );
}
