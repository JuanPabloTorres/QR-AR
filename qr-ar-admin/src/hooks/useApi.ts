"use client";

import { useState, useEffect } from "react";
import { Experience } from "@/types/experience";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import {
  listExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/lib/apiClient";

export function useExperiences(params?: {
  search?: string;
  type?: string;
  page?: number;
  pageSize?: number;
  onlyActive?: boolean;
}) {
  const [data, setData] = useState<ApiResponse<
    PaginatedResponse<Experience>
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("[useExperiences] Fetching with params:", params);
      const result = await listExperiences(params);

      console.log("[useExperiences] Result received:", result);
      setData(result);
    } catch (err) {
      console.error("[useExperiences] Error:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [
    params?.search,
    params?.type,
    params?.page,
    params?.pageSize,
    params?.onlyActive,
  ]);

  return {
    data,
    loading,
    error,
    refetch: fetchExperiences,
  };
}

export function useExperience(id: string | null) {
  const [data, setData] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      setLoading(false);
      return;
    }

    const fetchExperience = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getExperienceById(id);

        if (!result || !result.data) {
          setError("Experience not found");
          setData(null);
          return;
        }

        setData(result?.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  return {
    data,
    loading,
    error,
  };
}

export function useExperienceActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: Omit<Experience, "id" | "createdAtUtc">) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createExperience(data);
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error creating experience"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    id: string,
    data: Omit<Experience, "id" | "createdAtUtc">
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateExperience(id, data);
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error updating experience"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteExperience(id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error deleting experience"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    create,
    update,
    remove,
  };
}
