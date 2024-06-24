import PageNav from "@/components/page-nav";
import PageFooter from "@/components/page-footer";

const Geo = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <PageNav />

      <div className="flex flex-col gap-4 justify-center items-center w-full h-full p-8">
        <div className="animate-wiggle-waggle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="231"
            height="255"
            viewBox="0 0 231 255"
            fill="none"
            className="w-32 h-auto"
          >
            <g clip-path="url(#clip0_79_170)">
              <path
                d="M115.11 251.23C176.751 251.23 226.72 201.26 226.72 139.62C226.72 77.9795 176.751 28.01 115.11 28.01C53.4695 28.01 3.5 77.9795 3.5 139.62C3.5 201.26 53.4695 251.23 115.11 251.23Z"
                fill="#70A3FF"
              />
              <path
                d="M115.11 251.23C176.751 251.23 226.72 201.26 226.72 139.62C226.72 77.9795 176.751 28.01 115.11 28.01C53.4695 28.01 3.5 77.9795 3.5 139.62C3.5 201.26 53.4695 251.23 115.11 251.23Z"
                stroke="black"
                stroke-width="7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M115.11 251.23C159.586 251.23 195.64 201.26 195.64 139.62C195.64 77.9795 159.586 28.01 115.11 28.01C70.6346 28.01 34.5801 77.9795 34.5801 139.62C34.5801 201.26 70.6346 251.23 115.11 251.23Z"
                stroke="black"
                stroke-width="7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M115.11 251.23C132.225 251.23 146.1 201.26 146.1 139.62C146.1 77.9795 132.225 28.01 115.11 28.01C97.9948 28.01 84.1201 77.9795 84.1201 139.62C84.1201 201.26 97.9948 251.23 115.11 251.23Z"
                stroke="black"
                stroke-width="7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M132.86 41.18C143.403 41.18 151.95 32.6331 151.95 22.09C151.95 11.5469 143.403 3 132.86 3C122.317 3 113.77 11.5469 113.77 22.09C113.77 32.6331 122.317 41.18 132.86 41.18Z"
                fill="white"
                stroke="black"
                stroke-width="6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M132.04 27.3001C134.592 27.3001 136.66 25.2316 136.66 22.6801C136.66 20.1285 134.592 18.0601 132.04 18.0601C129.489 18.0601 127.42 20.1285 127.42 22.6801C127.42 25.2316 129.489 27.3001 132.04 27.3001Z"
                fill="black"
              />
              <path
                d="M94.4601 41.18C105.003 41.18 113.55 32.6331 113.55 22.09C113.55 11.5469 105.003 3 94.4601 3C83.917 3 75.3701 11.5469 75.3701 22.09C75.3701 32.6331 83.917 41.18 94.4601 41.18Z"
                fill="white"
                stroke="black"
                stroke-width="6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M96.8102 27.3001C99.3617 27.3001 101.43 25.2316 101.43 22.6801C101.43 20.1285 99.3617 18.0601 96.8102 18.0601C94.2586 18.0601 92.1902 20.1285 92.1902 22.6801C92.1902 25.2316 94.2586 27.3001 96.8102 27.3001Z"
                fill="black"
              />
              <path
                d="M106.69 55.5201C113.47 51.1801 119.09 51.7901 124 55.5201"
                stroke="black"
                stroke-width="6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M27.46 71.6799H203.71"
                stroke="black"
                stroke-width="7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.23999 139.46H226.33"
                stroke="black"
                stroke-width="7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M27.46 205.85H203.71"
                stroke="black"
                stroke-width="7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_79_170">
                <rect width="230.22" height="254.73" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <p className="font-heading text-3xl text-center max-w-96">
          Sorry! Superbridge is unavailable in your region.
        </p>
      </div>
      <PageFooter />
    </div>
  );
};

export default Geo;
