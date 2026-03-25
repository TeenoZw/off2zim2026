"use client";

import React from "react";
import {
  BoltIcon,
  BuildingLibraryIcon,
  HomeIcon,
  MapIcon,
  CalendarIcon,
  ShoppingBagIcon,
  CameraIcon,
  HeartIcon,
  StarIcon,
  TruckIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

interface CategoryItem {
  id: string;
  title: string;
  icon?: string;
  color?: string;
}

interface MobileCategoryListProps {
  categories: CategoryItem[];
  selectedCategory?: string;
  onCategorySelect?: (id: string) => void;
  horizontal?: boolean;
}

export function MobileCategoryList({
  categories,
  selectedCategory,
  onCategorySelect,
  horizontal = true,
}: MobileCategoryListProps) {
  const getIcon = (iconName?: string) => {
    const iconProps = { className: "w-6 h-6" };

    switch (iconName) {
      case "home":
        return <HomeIcon {...iconProps} />;
      case "map":
        return <MapIcon {...iconProps} />;
      case "calendar":
        return <CalendarIcon {...iconProps} />;
      case "shopping":
        return <ShoppingBagIcon {...iconProps} />;
      case "camera":
        return <CameraIcon {...iconProps} />;
      case "heart":
        return <HeartIcon {...iconProps} />;
      case "star":
        return <StarIcon {...iconProps} />;
      case "truck":
        return <TruckIcon {...iconProps} />;
      case "adventure":
        return <BoltIcon {...iconProps} />;
      case "heritage":
        return <BuildingLibraryIcon {...iconProps} />;
      case "nature":
        return <GlobeAltIcon {...iconProps} />;
      default:
        return <HomeIcon {...iconProps} />;
    }
  };

  return (
    <div className={`${horizontal ? "overflow-x-auto" : ""} py-4`}>
      <div
        className={`
        ${
          horizontal
            ? "flex space-x-4 px-4 min-w-max"
            : "grid grid-cols-2 gap-4 px-4"
        }
      `}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onCategorySelect?.(category.id)}
              className={`
                flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 min-w-[80px]
                ${
                  isSelected
                    ? "bg-off2zim-primary text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-600 shadow-sm hover:shadow-md border border-gray-100"
                }
                ${horizontal ? "flex-shrink-0" : "w-full"}
              `}
              style={{
                backgroundColor: isSelected
                  ? category.color || "#C95E27"
                  : undefined,
              }}
            >
              <div
                className={`
                mb-2 p-2 rounded-xl
                ${isSelected ? "bg-white/20" : "bg-gray-50"}
              `}
              >
                {getIcon(category.icon)}
              </div>

              <span
                className={`
                text-sm font-medium text-center leading-tight
                ${isSelected ? "text-white" : "text-gray-700"}
              `}
              >
                {category.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
