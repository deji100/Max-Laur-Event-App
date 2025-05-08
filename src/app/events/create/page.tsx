"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const router = useRouter(); // Hook to navigate programmatically
  const [form, setForm] = useState({
    title: "", // Event title
    date: "", // Event date
    location: "", // Event location
    description: "", // Event description
    image: null as File | null, // Event image file
  });
  const [preview, setPreview] = useState<string | null>(null); // Image preview URL
  const [loading, setLoading] = useState(false); // Loading state for the submit button
  const [error, setError] = useState<string | null>(null); // Error message state

  // Handle change for text input and textarea fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file change and generate preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file)); // Set preview for the selected image
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when the form is submitted
    setError(null); // Reset error message

    const formData = new FormData();
    // Append form values to FormData object
    Object.entries(form).forEach(([key, val]) => {
      if (val) formData.append(key, val as any);
    });

    try {
      const res = await fetch("/api/events/create", {
        // API call to create an event
        method: "POST",
        body: formData, // Sending form data including image
      });

      if (!res.ok) {
        // If the request is not successful
        const err = await res.text();
        throw new Error(err);
      }

      router.push("/"); // Redirect to the homepage after successful creation
    } catch (err: any) {
      setError(err.message || "Something went wrong"); // Handle error
    } finally {
      setLoading(false); // Set loading state to false after the request is completed
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Create New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          required
          className="w-full border p-2"
          onChange={handleChange} // Handle title change
        />
        <input
          name="date"
          type="date"
          required
          className="w-full border p-2"
          onChange={handleChange} // Handle date change
        />
        <input
          name="location"
          placeholder="Location"
          required
          className="w-full border p-2"
          onChange={handleChange} // Handle location change
        />
        <textarea
          name="description"
          placeholder="Description"
          required
          className="w-full border p-2"
          rows={4}
          onChange={handleChange} // Handle description change
        />
        <input type="file" accept="image/*" onChange={handleImageChange} /> 
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover mt-2"
          />
        )}{" "}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Submitting..." : "Create Event"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
