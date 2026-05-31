import { useAuthViewModel } from "./src/viewmodels/useAuthViewModel";
import { AuthScreen } from "./src/views/AuthScreen";
import { LoadingScreen } from "./src/views/LoadingScreen";
import { MainApp } from "./src/views/MainApp";

export default function App() {
  const auth = useAuthViewModel();

  if (auth.isBooting) {
    return <LoadingScreen />;
  }

  if (auth.isSignedIn) {
    return <MainApp apiUrl={auth.apiUrl} onLogout={auth.logout} />;
  }

  return (
    <AuthScreen
      apiUrl={auth.apiUrl}
      canSubmit={auth.canSubmit}
      copy={auth.copy}
      form={auth.form}
      isLoading={auth.isLoading}
      message={auth.message}
      mode={auth.mode}
      onSubmit={auth.submit}
      onSwitchMode={auth.switchMode}
      onUpdateForm={auth.updateForm}
    />
  );
}
