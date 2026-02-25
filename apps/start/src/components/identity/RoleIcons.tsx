import { BetterAuthUserRoles } from "@/lib/better-auth/client";

interface RoleIconsProps {
  role: BetterAuthUserRoles;
}

export function RoleIcons({ role }: RoleIconsProps) {
  if (role === "owner") {
    return (
      <svg
        className="text-success size-10"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM12 11C10.9 11 10 10.1 10 9C10 7.9 10.9 7 12 7C13.1 7 14 7.9 14 9C14 10.1 13.1 11 12 11ZM12 17C9.33 17 7.08 15.34 6 13C6.03 10.97 10 9.9 12 9.9C13.99 9.9 17.97 10.97 18 13C16.92 15.34 14.67 17 12 17Z"
            fill="currentColor"
          />
        </g>
      </svg>
    );
  }
  if (role === "staff") {
    return (
      <svg
        className="text-success size-10"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M20 7H15V4C15 2.9 14.1 2 13 2H11C9.9 2 9 2.9 9 4V7H4C2.9 7 2 7.9 2 9V14C2 14.74 2.4 15.38 3 15.73V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V15.72C21.6 15.37 22 14.73 22 14V9C22 7.9 21.1 7 20 7ZM11 4H13V7H11V4ZM4 9H20V14H15V11H9V14H4V9ZM13 15V14H11V15H13ZM19 20H5V16H9V17H15V16H19V20Z"
            fill="currentColor"
          />
        </g>
      </svg>
    );
  }
  if (role === "manager") {
    return (
      <svg
        className="text-success size-10"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M12.25 12.5C12.25 13.6046 11.3546 14.5 10.25 14.5C9.14543 14.5 8.25 13.6046 8.25 12.5C8.25 11.3954 9.14543 10.5 10.25 10.5C11.3546 10.5 12.25 11.3954 12.25 12.5Z"
            fill="#1F2328"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.25 4.5L20 10.1893V18H16.5V20H4V11.9393L10.25 5.68933L11.625 7.06433L14.25 4.5ZM18.5 10.8107V16.5H16.5V11.9393L12.6857 8.12499L14.25 6.56065L18.5 10.8107ZM5.5 12.5607V18.5H6.78545C7.02806 16.8038 8.48677 15.5 10.25 15.5C12.0132 15.5 13.4719 16.8038 13.7146 18.5H15V12.5607L10.25 7.81065L5.5 12.5607Z"
            fill="#1F2328"
          ></path>
        </g>
      </svg>
    );
  }
  return (
    <svg
      className="text-success size-10"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z"
          fill="#000000"
        ></path>
        <path
          d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z"
          fill="#000000"
        ></path>
      </g>
    </svg>
  );
}
