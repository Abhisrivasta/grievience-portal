import ReactGA from "react-ga4";

const TRACKING_ID = "G-XXXXXXXXXX"; 

export const initGA = () => {
  ReactGA.initialize(TRACKING_ID);
  console.log("🚀 Google Analytics Initialized");
};

export const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};