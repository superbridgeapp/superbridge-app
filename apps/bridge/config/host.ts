// change this as needed
export const developmentHost = "renzo.superbridge.app";

export let host = "";
if (typeof window === "undefined") {
  // can't do anything
} else if (window.location.host.includes("localhost")) {
  host = developmentHost;
} else {
  host = window.location.host;
}
