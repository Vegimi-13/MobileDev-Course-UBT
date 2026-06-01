import { useState } from "react";
import type { CreateTripPayload } from "../models/trip";
import { createTrip } from "../services/tripService";

type CreateStep = 1 | 2 | 3 | 4;

type CreateTripForm = {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  visibility: "PUBLIC" | "PRIVATE";
  joinPolicy: "OPEN" | "APPROVAL";
  maxMembers: number;
  categoryName: string;
  tags: string[];
  coverImageUrl: string;
};

const initialForm: CreateTripForm = {
  title: "",
  destination: "",
  startDate: "",
  endDate: "",
  description: "",
  visibility: "PUBLIC",
  joinPolicy: "OPEN",
  maxMembers: 8,
  categoryName: "Beach",
  tags: [],
  coverImageUrl:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=70",
};

export const categoryOptions = [
  "Beach",
  "Mountains",
  "City",
  "Adventure",
  "Road Trip",
  "Culture",
  "Festival",
  "Safari",
];

export const tagOptions = [
  "food",
  "beach",
  "hiking",
  "culture",
  "photography",
  "nightlife",
  "adventure",
  "nature",
  "luxury",
  "budget",
];

export const coverOptions = [
  {
    label: "Beach",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=70",
  },
  {
    label: "Mountains",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=70",
  },
  {
    label: "City",
    url: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=70",
  },
  {
    label: "Safari",
    url: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=70",
  },
  {
    label: "Tropical",
    url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=70",
  },
  {
    label: "Desert",
    url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70",
  },
];

const parseDateInput = (value: string) =>
  new Date(`${value}T00:00:00.000Z`).toISOString();

const isValidDateInput = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

export function useCreateTripViewModel(onCreated: () => void) {
  const [step, setStep] = useState<CreateStep>(1);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <TKey extends keyof CreateTripForm>(
    key: TKey,
    value: CreateTripForm[TKey],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const toggleTag = (tag: string) => {
    setForm((current) => ({
      ...current,
      tags: current.tags.includes(tag)
        ? current.tags.filter((item) => item !== tag)
        : [...current.tags, tag],
    }));
  };

  const canContinue =
    step === 1
      ? form.title.trim().length >= 3 &&
        form.destination.trim().length >= 2 &&
        isValidDateInput(form.startDate) &&
        isValidDateInput(form.endDate) &&
        form.endDate >= form.startDate
      : step === 2
        ? form.categoryName.trim().length > 0 && form.maxMembers > 0
        : true;

  const next = async () => {
    if (!canContinue || isSubmitting) return;

    if (step < 3) {
      setStep((current) => (current + 1) as CreateStep);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      if (form.endDate < form.startDate) {
        throw new Error("End date must be after start date");
      }

      const payload: CreateTripPayload = {
        title: form.title.trim(),
        destination: form.destination.trim(),
        description: form.description.trim() || undefined,
        startDate: parseDateInput(form.startDate),
        endDate: parseDateInput(form.endDate),
        visibility: form.visibility,
        joinPolicy: form.joinPolicy,
        maxMembers: form.maxMembers,
        coverImageUrl: form.coverImageUrl,
        categoryName: form.categoryName,
        tags: form.tags,
      };

      await createTrip(payload);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create trip");
    } finally {
      setIsSubmitting(false);
    }
  };

  const back = () => {
    if (step === 1) {
      onCreated();
      return;
    }
    setStep((current) => (current - 1) as CreateStep);
  };

  const resetAndGo = () => {
    setForm(initialForm);
    setStep(1);
    onCreated();
  };

  return {
    canContinue,
    error,
    form,
    isSubmitting,
    step,
    back,
    next,
    resetAndGo,
    toggleTag,
    updateField,
  } as const;
}
