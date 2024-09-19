import './LoadingScreen.css'; // For styling the modal and backdrop

export default function LoadingScreen() {
  return (
    <div className="loading-overlay">
      <div className="loading-modal">
        <div className="spinner"></div>
        <p>The Genie is granting your wishes. Please wait...</p>
      </div>
    </div>
  );
}