"use client";

import React, { useState } from "react";
import { Star, Upload, X } from "lucide-react";
import StarRating from "./StarRating";

interface RatingCriteria {
  id: string;
  label: string;
  description: string;
  rating: number;
}

interface ReviewFormProps {
  reviewType: "service" | "explorer" | "guide";
  targetName: string;
  onSubmit: (reviewData: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  reviewType,
  targetName,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [overallRating, setOverallRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [criteria, setCriteria] = useState<RatingCriteria[]>([]);

  // Initialize criteria based on review type
  React.useEffect(() => {
    let initialCriteria: RatingCriteria[] = [];

    if (reviewType === "service") {
      initialCriteria = [
        {
          id: "quality",
          label: "Service Quality",
          description: "How well did they deliver their service?",
          rating: 0,
        },
        {
          id: "communication",
          label: "Communication",
          description: "How responsive and clear were they?",
          rating: 0,
        },
        {
          id: "value",
          label: "Value for Money",
          description: "Was the service worth the price?",
          rating: 0,
        },
        {
          id: "professionalism",
          label: "Professionalism",
          description: "How professional was their conduct?",
          rating: 0,
        },
      ];
    } else if (reviewType === "explorer") {
      initialCriteria = [
        {
          id: "communication",
          label: "Communication",
          description: "How well did they communicate?",
          rating: 0,
        },
        {
          id: "respect",
          label: "Respectfulness",
          description: "How respectful were they?",
          rating: 0,
        },
        {
          id: "reliability",
          label: "Reliability",
          description: "Did they follow through on commitments?",
          rating: 0,
        },
      ];
    } else if (reviewType === "guide") {
      initialCriteria = [
        {
          id: "knowledge",
          label: "Local Knowledge",
          description: "How knowledgeable were they about local areas?",
          rating: 0,
        },
        {
          id: "helpfulness",
          label: "Helpfulness",
          description: "How helpful were their recommendations?",
          rating: 0,
        },
        {
          id: "responsiveness",
          label: "Responsiveness",
          description: "How quickly did they respond to questions?",
          rating: 0,
        },
      ];
    }

    setCriteria(initialCriteria);
  }, [reviewType]);

  const updateCriteriaRating = (criteriaId: string, rating: number) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === criteriaId ? { ...c, rating } : c))
    );
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setPhotos((prev) => [...prev, ...files].slice(0, 5)); // Max 5 photos
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reviewData = {
      overallRating,
      title,
      comment,
      criteria: criteria.reduce(
        (acc, c) => ({
          ...acc,
          [c.id]: c.rating,
        }),
        {}
      ),
      photos,
      reviewType,
      targetName,
    };

    onSubmit(reviewData);
  };

  const isFormValid =
    overallRating > 0 &&
    title.trim() &&
    comment.trim() &&
    criteria.every((c) => c.rating > 0);

  const getReviewTypeTitle = () => {
    switch (reviewType) {
      case "service":
        return `Review ${targetName}`;
      case "explorer":
        return `Rate Your Experience with ${targetName}`;
      case "guide":
        return `Review Community Guide ${targetName}`;
      default:
        return "Write a Review";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {getReviewTypeTitle()}
        </h3>
        <button
          onClick={onCancel}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating *
          </label>
          <StarRating
            rating={overallRating}
            onRatingChange={setOverallRating}
            size="lg"
            showText={true}
          />
        </div>

        {/* Criteria Ratings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Detailed Ratings *
          </label>
          <div className="space-y-4">
            {criteria.map((criterion) => (
              <div
                key={criterion.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {criterion.label}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {criterion.description}
                  </p>
                </div>
                <div className="ml-4">
                  <StarRating
                    rating={criterion.rating}
                    onRatingChange={(rating) =>
                      updateCriteriaRating(criterion.id, rating)
                    }
                    showText={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Review Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Summarize your experience in a few words"
            maxLength={100}
          />
          <div className="text-xs text-gray-500 mt-1">
            {title.length}/100 characters
          </div>
        </div>

        {/* Review Comment */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Review *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share details about your experience..."
            maxLength={1000}
          />
          <div className="text-xs text-gray-500 mt-1">
            {comment.length}/1000 characters
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos (Optional)
          </label>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Upload ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {photos.length < 5 && (
                <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Upload up to 5 photos (JPEG, PNG)
            </p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
