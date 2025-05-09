"use client";
// import Image from 'next/image';
import { useState } from 'react';
import { Clock, UtensilsCrossed, User, ShieldCheck } from 'lucide-react';

export function ChatRecipeCard({ recipe }) {
  const { title, description, reason, suitableBodyTypes, ingredients, steps, cookTime, servings, suitableFor, image, nutritionalInfo } = recipe;
  const [imgError, setImgError] = useState(false);
  const [showAllSteps, setShowAllSteps] = useState(false);
  
  return (
    <div className="space-y-4">
      {image && !imgError && (
        <div className="relative h-48 rounded-lg overflow-hidden bg-card">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        </div>
      )}
      
      <div>
        <h3 className="font-bold text-lg text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
        {reason && (
          <p className="text-xs text-gray-500 mt-2">생성 이유: {reason}</p>
        )}
        {Array.isArray(suitableBodyTypes) && suitableBodyTypes.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">적합 체질: {suitableBodyTypes.join(', ')}</p>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3 text-sm text-gray-700">
        <div className="flex items-center">
          <Clock size={16} className="mr-1 text-teal-500" />
          <span>{cookTime}</span>
        </div>
        <div className="flex items-center">
          <User size={16} className="mr-1 text-teal-500" />
          <span>{servings}</span>
        </div>
        <div className="flex items-center">
          <ShieldCheck size={16} className="mr-1 text-teal-500" />
          <span className="line-clamp-1">{suitableFor}</span>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
          <UtensilsCrossed size={16} className="mr-1.5 text-teal-500" />
          재료
        </h4>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
          {ingredients.map((ingredient, i) => (
            <li key={i} className="text-sm text-gray-700 list-disc list-inside">
              {ingredient}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-2">만드는 방법</h4>
        <ol className="space-y-1">
          {(showAllSteps ? steps : steps.slice(0, 3)).map((step, i) => (
            <li key={i} className="text-sm text-gray-700 flex">
              <span className="bg-teal-100 text-teal-800 rounded-full h-5 w-5 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5 text-xs font-medium">
                {i+1}
              </span>
              <span>{step}</span>
            </li>
          ))}
          {steps.length > 3 && !showAllSteps && (
            <li
              onClick={() => setShowAllSteps(true)}
              className="text-sm text-teal-600 font-medium cursor-pointer"
            >
              +{steps.length - 3}단계 더 보기
            </li>
          )}
          {showAllSteps && steps.length > 3 && (
            <li
              onClick={() => setShowAllSteps(false)}
              className="text-sm text-teal-600 font-medium cursor-pointer"
            >
              접기
            </li>
          )}
        </ol>
      </div>

      {nutritionalInfo && (
        <div className="text-xs text-gray-500 border-t pt-3">
          <p className="font-medium mb-1">영양 정보</p>
          <p>{nutritionalInfo}</p>
        </div>
      )}
    </div>
  );
} 