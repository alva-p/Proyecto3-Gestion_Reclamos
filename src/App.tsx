import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginForm } from "./components/LoginForm";
import { RegistrationRequest } from "./components/RegistrationRequest";
import { Layout } from "./components/Layout";
import { ClientDashboard } from "./components/ClientDashboard";
import { EmployeeDashboard } from "./components/EmployeeDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { ClaimsList } from "./components/ClaimsList";
import { ClaimDetail } from "./components/ClaimDetail";
import { ProjectsView } from "./components/ProjectsView";
import { NewClaimForm } from "./components/NewClaimForm";
import { RegistrationRequestsView } from "./components/RegistrationRequestsView";
import { UsersManagement } from "./components/UsersManagement";
import { UserProfile } from "./components/UserProfile";
import { Toaster } from "./components/ui/sonner";

type View =
  | "dashboard"
  | "my-claims"
  | "all-claims"
  | "claim-detail"
  | "projects"
  | "new-claim"
  | "requests"
  | "users"
  | "profile";

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] =
    useState<View>("dashboard");
  const [selectedClaimId, setSelectedClaimId] = useState<
    string | null
  >(null);
  const [showRegistration, setShowRegistration] =
    useState(false);

  const handleNavigate = (view: string) => {
    setCurrentView(view as View);
    setSelectedClaimId(null);
  };

  const handleViewClaim = (claimId: string) => {
    setSelectedClaimId(claimId);
    setCurrentView("claim-detail");
  };

  const handleBackFromClaim = () => {
    setCurrentView(
      user?.role === "cliente" ? "my-claims" : "all-claims",
    );
    setSelectedClaimId(null);
  };

  if (!isAuthenticated) {
    if (showRegistration) {
      return (
        <RegistrationRequest
          onBackToLogin={() => setShowRegistration(false)}
        />
      );
    }
    return (
      <LoginForm
        onRegisterClick={() => setShowRegistration(true)}
      />
    );
  }

  const renderContent = () => {
    if (currentView === "claim-detail" && selectedClaimId) {
      return (
        <ClaimDetail
          claimId={selectedClaimId}
          onBack={handleBackFromClaim}
        />
      );
    }

    switch (currentView) {
      case "dashboard":
        if (user?.role === "cliente")
          return <ClientDashboard />;
        if (user?.role === "empleado")
          return <EmployeeDashboard />;
        if (user?.role === "administrador")
          return <AdminDashboard />;
        return null;

      case "my-claims":
        return <ClaimsList onViewClaim={handleViewClaim} />;

      case "all-claims":
        return <ClaimsList onViewClaim={handleViewClaim} />;

      case "projects":
        return <ProjectsView />;

      case "new-claim":
        return <NewClaimForm />;

      case "requests":
        return <RegistrationRequestsView />;

      case "users":
        return <UsersManagement />;

      case "profile":
        return <UserProfile />;

      default:
        return <ClientDashboard />;
    }
  };

  return (
    <Layout
      currentView={currentView}
      onNavigate={handleNavigate}
    >
      {renderContent()}
    </Layout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}