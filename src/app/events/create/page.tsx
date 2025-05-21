"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

type FormValues = {
  title: string;
  date: string;
  location: string;
  description: string;
  image: FileList | null;
};

export default function CreateEventPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const watchImage = watch("image");

  // Update image preview
  useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      const objectUrl = URL.createObjectURL(watchImage[0]);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreview(null);
  }, [watchImage]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("date", data.date);
      formData.append("location", data.location);
      formData.append("description", data.description);
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const res = await fetch("/api/events/create", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to create event");
      }

      toast.success("Event created successfully!");

      setTimeout(() => {
        router.push("/");
      }, 1000); // Wait 2s before redirect
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Toaster />
      <h1 className="text-xl font-bold mb-4">Create New Event</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="Title"
          className={`w-full border p-2 ${errors.title ? "border-red-500" : ""}`}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <input
          {...register("date", { required: "Date is required" })}
          type="date"
          className={`w-full border p-2 ${errors.date ? "border-red-500" : ""}`}
        />
        {errors.date && <p className="text-red-500">{errors.date.message}</p>}

        <input
          {...register("location", { required: "Location is required" })}
          placeholder="Location"
          className={`w-full border p-2 ${errors.location ? "border-red-500" : ""}`}
        />
        {errors.location && <p className="text-red-500">{errors.location.message}</p>}

        <textarea
          {...register("description", { required: "Description is required" })}
          placeholder="Description"
          rows={4}
          className={`w-full border p-2 ${errors.description ? "border-red-500" : ""}`}
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}

        <input
          {...register("image", { required: "Image is required" })}
          type="file"
          accept="image/*"
        />
        {errors.image && <p className="text-red-500">{errors.image.message}</p>}

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover mt-2 rounded"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
