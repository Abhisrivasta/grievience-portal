import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1f2937",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
              },
            }}
          />

          <AppRoutes />

        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;