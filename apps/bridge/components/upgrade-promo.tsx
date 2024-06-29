import { Button } from "./ui/button";

export const UpgradePromo = () => {
  return (
    <div className="w-full flex items-center justify-between px-5 py-4 bg-[#A882FD] bg-[url('/img/upgrade-grid.svg')] bg-repeat rounded-[18px] shadow-sm">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base tracking-tight font-heading leading-none text-white">
          Level up your bridge
        </h3>
        <div className="flex gap-3">
          <div className="flex gap-1 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="16"
              viewBox="0 0 15 16"
              fill="none"
              className="w-3 h-3"
            >
              <g clip-path="url(#clip0_223_4)">
                <path
                  d="M1.52649 12.4668C1.52649 12.33 1.59893 12.2146 1.71429 12.1583L3.07981 11.5412L3.72099 9.17773C3.76123 9.03286 3.90074 8.9336 4.04561 8.9336C4.20121 8.9336 4.33803 9.03018 4.37827 9.17773L5.01945 11.5412L6.38498 12.1583C6.49765 12.2146 6.57277 12.33 6.57277 12.4668C6.57277 12.5956 6.50034 12.719 6.38498 12.7673L5.01945 13.3924L4.37827 15.7559C4.33803 15.9007 4.19852 16 4.04561 16C3.90074 16 3.76123 15.9034 3.72099 15.7559L3.07981 13.3924L1.71429 12.7673C1.60161 12.719 1.52649 12.5956 1.52649 12.4668ZM0 3.84172C0 3.7049 0.0724346 3.58149 0.195842 3.5332L1.56137 2.91616L2.1945 0.552649C2.24279 0.40778 2.37425 0.300469 2.52716 0.300469C2.68008 0.300469 2.81154 0.405097 2.84373 0.552649L3.49296 2.91616L4.85044 3.5332C4.97116 3.58149 5.05433 3.7049 5.05433 3.84172C5.05433 3.97049 4.97384 4.0939 4.85044 4.15023L3.49296 4.76727L2.84373 7.13078C2.81154 7.26761 2.68008 7.37492 2.52716 7.37492C2.37425 7.37492 2.24279 7.27029 2.1945 7.13078L1.56137 4.76727L0.195842 4.15023C0.0751174 4.0939 0 3.97049 0 3.84172ZM9.59088 14.5459C9.43528 14.5459 9.29041 14.4252 9.25822 14.2777L8.14487 8.87726L4.59557 7.78806C4.4507 7.73977 4.35949 7.60832 4.35949 7.46345C4.35949 7.31858 4.44802 7.18712 4.59557 7.14688L8.14487 6.04963L9.25822 0.268276C9.29041 0.104628 9.42991 0 9.59088 0C9.75184 0 9.89135 0.104628 9.92354 0.268276L11.0449 6.04963L14.5942 7.14688C14.7311 7.18712 14.8303 7.31858 14.8303 7.46345C14.8303 7.60832 14.7337 7.73977 14.5942 7.78806L11.0369 8.87726L9.92354 14.2777C9.89135 14.4225 9.75184 14.5459 9.59088 14.5459Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_223_4">
                  <rect width="14.8303" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span className="tracking-tight text-xs text-white">Brand</span>
          </div>
          <div className="flex gap-1 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              className="w-3 h-3"
            >
              <g clip-path="url(#clip0_223_2)">
                <path
                  d="M4.81196 15.7442C3.58594 15.0279 2.61478 14.054 1.8958 12.828C1.1795 11.602 0.820007 10.266 0.820007 8.81995C0.820007 7.37394 1.1795 6.03792 1.8958 4.8119C2.61209 3.58588 3.58594 2.61472 4.81196 1.89573C6.03798 1.17944 7.374 0.819946 8.82001 0.819946C10.266 0.819946 11.602 1.17944 12.8281 1.89573C14.0541 2.61203 15.0252 3.58588 15.7442 4.8119C16.4605 6.03792 16.82 7.37394 16.82 8.81995C16.82 10.266 16.4605 11.602 15.7442 12.828C15.0279 14.054 14.0541 15.0252 12.8281 15.7442C11.602 16.4605 10.266 16.8199 8.82001 16.8199C7.374 16.8199 6.03798 16.4605 4.81196 15.7442ZM4.58929 8.33973C4.62148 7.3337 4.73684 6.39741 4.93805 5.53893H2.59063C2.12383 6.42156 1.86092 7.35516 1.79385 8.33973H4.58661H4.58929ZM2.59063 12.101H4.93805C4.73684 11.2398 4.62148 10.3062 4.58929 9.30016H1.79385C1.85824 10.2847 2.12383 11.2183 2.59063 12.101ZM5.20633 4.58118C5.36997 4.08755 5.54435 3.65831 5.73483 3.29077C5.93067 2.89641 6.15334 2.53155 6.4082 2.20157C5.76434 2.43497 5.16877 2.75422 4.62417 3.15932C4.07956 3.56441 3.60472 4.03926 3.19962 4.58118H5.20633ZM4.62417 14.4806C5.16877 14.8857 5.76166 15.2049 6.4082 15.4383C6.16407 15.1244 5.93872 14.7623 5.73483 14.3491C5.54435 13.9816 5.36997 13.5497 5.20633 13.0587H3.19962C3.60472 13.6006 4.07956 14.0728 4.62417 14.4806ZM8.33979 8.33973V5.53893H5.92799C5.70532 6.41083 5.57923 7.34443 5.54704 8.33973H8.33979ZM5.92799 12.101H8.33979V9.30016H5.54704C5.57923 10.3008 5.708 11.2371 5.92799 12.101ZM6.58527 13.9279C6.80257 14.3733 7.0628 14.7623 7.36595 15.1003C7.6691 15.4383 7.99372 15.6664 8.33979 15.7871V13.0587H6.21236C6.33577 13.3941 6.46186 13.6838 6.58527 13.9279ZM8.33979 4.58118V1.85013C7.99372 1.96817 7.6691 2.19889 7.36863 2.53691C7.06816 2.87494 6.80794 3.26663 6.58527 3.70928C6.45113 3.98024 6.32772 4.26998 6.22041 4.5785H8.33979V4.58118ZM11.4277 4.58118C11.3042 4.24584 11.1782 3.9561 11.0547 3.71197C10.8374 3.26931 10.5772 2.87763 10.2741 2.5396C9.97091 2.20157 9.6463 1.97353 9.30022 1.85281V4.58118H11.4277ZM12.093 8.33973C12.0608 7.33906 11.932 6.40546 11.712 5.53893H9.30022V8.33973H12.093ZM11.712 12.101C11.9347 11.2291 12.0608 10.2955 12.093 9.30016H9.30022V12.101H11.712ZM10.2687 15.103C10.5692 14.765 10.8294 14.3733 11.0521 13.9306C11.1862 13.6597 11.3096 13.3699 11.4169 13.0614H9.29754V15.7898C9.64362 15.6717 9.96823 15.441 10.2687 15.103ZM11.9052 3.28809C12.0957 3.65563 12.27 4.08755 12.4337 4.5785H14.4404C14.0353 4.03658 13.5605 3.56441 13.0158 3.15663C12.4712 2.74885 11.8784 2.43229 11.2318 2.19889C11.4759 2.51277 11.7013 2.87494 11.9052 3.28809ZM13.0158 14.4806C13.5605 14.0755 14.0353 13.6006 14.4404 13.0587H12.4337C12.27 13.5523 12.0957 13.9816 11.9052 14.3491C11.7093 14.7381 11.4867 15.103 11.2318 15.4383C11.8757 15.2049 12.4712 14.8857 13.0158 14.4806ZM13.0507 8.33973H15.8435C15.7791 7.35516 15.5135 6.42156 15.0467 5.53893H12.6993C12.9005 6.40009 13.0158 7.3337 13.048 8.33973H13.0507ZM15.0494 12.101C15.5162 11.2183 15.7791 10.2847 15.8462 9.30016H13.0534C13.0212 10.3062 12.9032 11.2425 12.7046 12.101H15.0521H15.0494Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_223_2">
                  <rect
                    width="16"
                    height="16"
                    fill="white"
                    transform="translate(0.820007 0.819946)"
                  />
                </clipPath>
              </defs>
            </svg>
            <span className="tracking-tight text-xs text-white">Domain</span>
          </div>
          <div className="flex gap-1 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="w-3 h-3"
            >
              <g clip-path="url(#clip0_223_8)">
                <path
                  d="M7.51015 12.8327C7.79198 13.1146 8.24023 13.1146 8.52206 12.8327C8.65358 12.7012 8.73411 12.516 8.72874 12.3281L8.73411 9.20919C8.73411 9.08304 8.7851 8.96225 8.87905 8.87099C8.96494 8.7851 9.08572 8.73411 9.21188 8.73411L12.3308 8.72874C12.5268 8.72874 12.7039 8.65358 12.8354 8.52206C13.1173 8.24023 13.1173 7.78124 12.8408 7.50478C12.7093 7.37326 12.5294 7.2981 12.3362 7.2981H9.20919C9.07767 7.29274 8.95689 7.24174 8.87099 7.15316C8.7851 7.06459 8.73411 6.94649 8.73411 6.82033V3.69334C8.72874 3.50277 8.65895 3.32025 8.52206 3.18068C8.26439 2.923 7.80272 2.88811 7.50478 3.18604C7.37326 3.31756 7.2981 3.4974 7.2981 3.69066V6.81765C7.2981 6.9438 7.24711 7.06459 7.16122 7.15048C7.07532 7.23637 6.95454 7.28737 6.82302 7.29542H3.69602C3.50545 7.29005 3.32293 7.37058 3.19141 7.5021C2.90421 7.7893 2.90958 8.23218 3.19141 8.51401C3.32293 8.64553 3.49472 8.72605 3.69602 8.73142H6.82302C6.94917 8.73142 7.06996 8.78242 7.15585 8.86831C7.24711 8.95957 7.30079 9.08036 7.30079 9.20651V12.3335C7.30079 12.5294 7.38131 12.7012 7.51283 12.8327H7.51015ZM3.01694 12.9804C0.265728 10.2292 0.265728 5.76816 3.01694 3.01694C5.76816 0.265728 10.2292 0.265728 12.9804 3.01694C15.7316 5.76816 15.7316 10.2292 12.9804 12.9804C10.2292 15.7316 5.76816 15.7316 3.01694 12.9804ZM2.34055 13.6595C5.45949 16.7784 10.5405 16.7784 13.6595 13.6595C16.7784 10.5405 16.7784 5.45949 13.6595 2.34055C10.5405 -0.778392 5.45949 -0.778392 2.34055 2.34055C-0.778392 5.45949 -0.778392 10.5405 2.34055 13.6595Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_223_8">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span className="tracking-tight text-xs text-white">
              Much more!
            </span>
          </div>
        </div>
      </div>
      <Button size={"xs"} className="bg-black text-white" asChild>
        <a href="https://about.superbridge.app/rollies" target="_blank">
          Learn more
        </a>
      </Button>
    </div>
  );
};
