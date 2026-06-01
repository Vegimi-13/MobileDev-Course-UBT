import { useEffect, useMemo, useState } from "react";
import { initialAuthForm, type AuthForm, type AuthMode } from "../models/auth";
import { API_URL, AuthService } from "../services/AuthService";
import { clearSession, getSession, saveSession } from "../storage/session";

export function useAuthViewModel() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState<AuthForm>(initialAuthForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [message, setMessage] = useState("");

  const copy = useMemo(() => {
    if (mode === "login") {
      return {
        title: "Welcome back",
        subtitle: "Sign in and continue planning your next trip.",
        buttonTitle: "Sign in",
      };
    }

    return {
      title: "Create account",
      subtitle: "Create trips, join plans, and invite people into the journey.",
      buttonTitle: "Register",
    };
  }, [mode]);

  const canSubmit = useMemo(() => {
    const hasLoginFields =
      form.email.trim().length > 0 && form.password.length > 0;

    if (mode === "login") {
      return hasLoginFields;
    }

    return (
      hasLoginFields &&
      form.password.length >= 6 &&
      form.firstName.trim().length > 0 &&
      form.lastName.trim().length > 0
    );
  }, [form, mode]);

  useEffect(() => {
    getSession()
      .then((session) => {
        setIsSignedIn(Boolean(session));
      })
      .finally(() => setIsBooting(false));
  }, []);

  const updateForm = (key: keyof AuthForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage("");
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setMessage("");
  };

  const submit = async () => {
    if (!canSubmit || isLoading) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const email = form.email.trim().toLowerCase();
      const tokens =
        mode === "login"
          ? await AuthService.login({ email, password: form.password })
          : await AuthService.register({
              email,
              password: form.password,
              firstName: form.firstName.trim(),
              lastName: form.lastName.trim(),
            });

      await saveSession(tokens);
      setIsSignedIn(true);
      setForm(initialAuthForm);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not connect. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await clearSession();
    setIsSignedIn(false);
    setMessage("");
  };

  return {
    apiUrl: API_URL,
    canSubmit,
    copy,
    form,
    isBooting,
    isLoading,
    isSignedIn,
    message,
    mode,
    logout,
    submit,
    switchMode,
    updateForm,
  };
}
