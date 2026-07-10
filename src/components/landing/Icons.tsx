import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function baseProps(props: IconProps) {
  const { title, ...rest } = props;
  return { title, rest };
}

export function IconSparkles(props: IconProps) {
  const { title, rest } = baseProps(props);
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      <path
        d="M12 2l1.2 4.2L17.4 7.4l-4.2 1.2L12 12.8l-1.2-4.2L6.6 7.4l4.2-1.2L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M19 12l.7 2.4 2.3.6-2.3.6L19 18l-.6-2.4-2.4-.6 2.4-.6L19 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M5 13l.7 2.4 2.3.6-2.3.6L5 19l-.6-2.4-2.4-.6 2.4-.6L5 13Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconBolt(props: IconProps) {
  const { title, rest } = baseProps(props);
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      <path
        d="M13 2 4 14h7l-1 8 10-14h-7l0-6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconLink(props: IconProps) {
  const { title, rest } = baseProps(props);
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      <path
        d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconMic(props: IconProps) {
  const { title, rest } = baseProps(props);
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      <path
        d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M19 11a7 7 0 0 1-14 0M12 18v3M8 21h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconChart(props: IconProps) {
  const { title, rest } = baseProps(props);
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      <path
        d="M4 19h16M7 16V9M12 16v-5M17 16V6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconMessage(props: IconProps) {
  const { title, rest } = baseProps(props);
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      <path
        d="M7 18h-.8c-1 0-1.7-.9-1.5-1.8l.5-2.3c-.7-.9-1.2-2-1.2-3.2a6 6 0 1 1 12 0c0 3.3-2.7 6-6 6H7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 11h5M9.5 13.5h3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconFolder(props: IconProps) {
  const { title, rest } = baseProps(props);
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      <path
        d="M4 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 12h8M8 15h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconPalette(props: IconProps) {
  const { title, rest } = baseProps(props);
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      <path
        d="M12 3c-4.4 0-8 3.1-8 7.5 0 2.2 1.1 4.1 2.9 5.3.6.4.9 1.1.8 1.8l-.2 1.4c-.1.7.6 1.2 1.2.9l1.6-.8c.4-.2.9-.2 1.3 0 1 .5 2.1.8 3.2.8 4.4 0 8-3.1 8-7.5S16.4 3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="10" r="1" fill="currentColor" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
      <circle cx="15.5" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

export function IconShareNetwork(props: IconProps) {
  const { title, rest } = baseProps(props);
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      <circle cx="18" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8.3 11 15.7 6.5M8.3 13l7.4 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconShield(props: IconProps) {
  const { title, rest } = baseProps(props);
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      <path
        d="M12 2 20 6v7c0 5-3.4 8.9-8 9-4.6-.1-8-4-8-9V6l8-4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m9.5 12 1.7 1.8L14.8 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

