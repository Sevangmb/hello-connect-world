
import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEvents } from "@/hooks/useEvents";

interface ModuleStatusAlertProps {
  onDismiss: () => void;
}

export const ModuleStatusAlert: React.FC<ModuleStatusAlertProps> = ({ onDismiss }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "warning" | "error">("success");
  const [message, setMessage] = useState("");
  const { subscribe, EVENT_TYPES } = useEvents();

  // Listen for module status change events
  useEffect(() => {
    const showSuccessAlert = () => {
      setAlertType("success");
      setMessage("Statut des modules mis à jour avec succès.");
      setShowAlert(true);
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setShowAlert(false);
        onDismiss();
      }, 5000);
    };

    const unsubscribe = subscribe(EVENT_TYPES.MODULE_STATUS_CHANGED, showSuccessAlert);
    return unsubscribe;
  }, [onDismiss, subscribe, EVENT_TYPES]);

  if (!showAlert) return null;

  return (
    <Alert 
      variant={alertType === "success" ? "default" : "destructive"} 
      className="mt-4 border-green-500 bg-green-50"
    >
      {alertType === "success" ? (
        <CheckCircle2 className="h-4 w-4 text-green-600" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertTitle className={alertType === "success" ? "text-green-700" : ""}>
        {alertType === "success" ? "Succès" : "Erreur"}
      </AlertTitle>
      <AlertDescription className={alertType === "success" ? "text-green-600" : ""}>
        {message}
      </AlertDescription>
    </Alert>
  );
};
