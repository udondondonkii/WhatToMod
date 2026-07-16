import { useCallback, useEffect, useState } from "react";
import { fetchProfessorProfile, type ProfessorProfile } from "../utils/api";

export function useProfessorProfile(name: string, fromModuleCode?: string) {
  const [profile, setProfile] = useState<ProfessorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (professorName: string, moduleCode?: string) => {
    setLoading(true);
    setError(null);
    setProfile(null);

    try {
      const data = await fetchProfessorProfile(professorName, moduleCode);
      setProfile(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (name) loadProfile(name, fromModuleCode);
  }, [name, fromModuleCode, loadProfile]);

  return { profile, loading, error };
}
