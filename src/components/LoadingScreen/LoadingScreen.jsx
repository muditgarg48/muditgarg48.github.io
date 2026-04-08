import LoadingLogo from "../LoadingLogo/LoadingLogo";
import "./LoadingScreen.css";

const SPLASH_MESSAGES = [
  "Initializing portfolio...",
  "Gathering data assets...",
  "Preparing experience...",
  "Powering up systems..."
];

const LoadingScreen = () => {
  return (
    <div id="loading-screen">
      <LoadingLogo isMajor={true} textArray={SPLASH_MESSAGES} />
    </div>
  );
}

export default LoadingScreen;