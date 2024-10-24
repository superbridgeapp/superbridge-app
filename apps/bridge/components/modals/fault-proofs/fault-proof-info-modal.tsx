import { optimismFaultProofsUpgrade } from "@/constants/links";
import { useModal } from "@/hooks/use-modal";

import { Button } from "../../ui/button";
import { Dialog, DialogContent } from "../../ui/dialog";

export const FaultProofInfoModal = () => {
  const modal = useModal("FaultProofInfo");

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.close}>
      <DialogContent>
        <div className="flex flex-col gap-8 p-6">
          <div className="flex flex-col gap-4 pt-6">
            <div className="animate-wiggle-waggle origin-center mx-auto">
              {/* <IconAlert className="w-16 h-16" /> */}
              <svg
                width="319"
                height="254"
                viewBox="0 0 319 254"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-auto shrink-0"
              >
                <rect width="252" height="252" rx="56" fill="#2362EB" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M198 126C198 165.77 165.714 198 125.876 198C86.0378 198 57.0755 168.991 54 132.048H149.341V119.939L54 119.939C57.0755 83.0095 88.0794 54 125.876 54C165.714 54 198 86.2298 198 126Z"
                  fill="#EFF6FF"
                />

                <path
                  d="M245.896 168.068C245.896 164.881 247.332 163.109 250.316 163.109C253.301 163.109 254.804 164.881 254.804 168.068C254.804 171.254 251.551 199.326 250.855 204.622C250.788 205.227 250.653 205.833 250.316 205.833C249.98 205.833 249.845 205.362 249.778 204.532C249.172 199.304 245.896 171.12 245.896 168.045V168.068ZM245.896 229.327C245.896 226.949 247.871 224.974 250.316 224.974C252.762 224.974 254.67 226.949 254.67 229.327C254.67 231.706 252.695 233.748 250.316 233.748C247.938 233.748 245.896 231.773 245.896 229.327ZM192.894 253.247H307.626C316.468 253.247 320.731 246.246 316.602 238.639L258.933 132.12C254.311 123.638 246.435 123.638 241.812 132.053L183.941 238.572C179.857 246.179 184.076 253.247 192.917 253.247H192.894Z"
                  fill="#FFFF55"
                />
                <path
                  d="M237.729 168.068C237.729 171.658 241.251 199.864 242.149 205.901C242.89 211.061 246.098 213.979 250.295 213.979C254.782 213.979 257.633 210.658 258.373 205.901C259.877 196.521 262.928 171.658 262.928 168.068C262.928 161.336 257.767 154.963 250.295 154.963C242.822 154.963 237.729 161.426 237.729 168.068ZM250.362 241.96C257.228 241.96 262.861 236.328 262.861 229.26C262.861 222.191 257.228 216.761 250.362 216.761C243.495 216.761 237.661 222.394 237.661 229.26C237.661 236.127 243.294 241.96 250.362 241.96Z"
                  fill="white"
                />
                <path
                  d="M245.896 168.068C245.896 164.881 247.332 163.109 250.316 163.109C253.301 163.109 254.804 164.881 254.804 168.068C254.804 171.254 251.551 199.326 250.855 204.622C250.788 205.227 250.653 205.833 250.316 205.833C249.98 205.833 249.845 205.362 249.778 204.532C249.172 199.303 245.896 171.119 245.896 168.045V168.068ZM245.896 229.327C245.896 226.949 247.871 224.974 250.316 224.974C252.762 224.974 254.67 226.949 254.67 229.327C254.67 231.706 252.695 233.748 250.316 233.748C247.938 233.748 245.896 231.773 245.896 229.327ZM237.728 168.068C237.728 171.658 241.251 199.865 242.149 205.9C242.889 211.062 246.098 213.979 250.294 213.979C254.782 213.979 257.632 210.657 258.372 205.9C259.876 196.521 262.927 171.658 262.927 168.068C262.927 161.336 257.766 154.963 250.294 154.963C242.822 154.963 237.728 161.426 237.728 168.068ZM237.661 229.26C237.661 236.328 243.293 241.961 250.362 241.961C257.43 241.961 262.86 236.328 262.86 229.26C262.86 222.191 257.228 216.761 250.362 216.761C243.495 216.761 237.661 222.393 237.661 229.26ZM191.144 242.522L249.015 136.002C250.855 132.546 249.89 132.546 251.73 135.935L309.399 242.454C310.97 245.304 311.105 245.101 307.626 245.101H192.894C189.439 245.101 189.573 245.304 191.122 242.522H191.144ZM192.894 253.247H307.626C316.468 253.247 320.731 246.246 316.602 238.639L258.933 132.12C254.311 123.638 246.435 123.638 241.812 132.053L183.941 238.572C179.857 246.179 184.076 253.247 192.917 253.247H192.894Z"
                  fill="black"
                />
              </svg>
            </div>
            <h1 className="font-heading text-xl  text-left">
              Base Mainnet Fault Proof upgrade
            </h1>
            <div className="text-xs text-left md:text-sm prose-sm  leading-relaxed  text-muted-foreground text-pretty">
              <p>
                The Base Mainnet Fault Proof upgrade has been targeted for
                October 30th.
              </p>
              <p>
                Withdrawals submitted now cannot be proved and therefore
                finalized until the upgrade is complete.
              </p>
              <p>
                We highly recommend you do not initiate or prove any withdrawals
                until the upgrade is complete.
              </p>
              <p>
                If you have withdrawals that are ready to finalize, you should
                do it before the upgrade is complete or you will need to prove
                again then wait a further 7 days.
              </p>
              <p>
                Find out more at{" "}
                <a
                  href={optimismFaultProofsUpgrade}
                  target="_blank"
                  className="text-foreground underline"
                >
                  optimism.io
                </a>{" "}
                or check the{" "}
                <a
                  href="https://help.superbridge.app/en/articles/9759328-fault-proof-upgrade"
                  target="_blank"
                  className="text-foreground underline"
                >
                  FAQs
                </a>
                .
              </p>
            </div>
          </div>

          <Button onClick={modal.close}>Ok</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
