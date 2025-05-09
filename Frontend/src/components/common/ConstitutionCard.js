import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Leaf, Heart, Lungs, Brain, ArrowUpRight } from 'lucide-react';

// 체질별 색상 설정
const constitutionColors = {
  "금양": { 
    gradient: "from-amber-50 to-amber-100", 
    border: "border-amber-200",
    accent: "text-amber-600",
    icon: <Heart className="w-5 h-5" />
  },
  "금음": { 
    gradient: "from-amber-50 to-amber-100", 
    border: "border-amber-200",
    accent: "text-amber-600",
    icon: <Heart className="w-5 h-5" />
  },
  "수양": { 
    gradient: "from-blue-50 to-blue-100", 
    border: "border-blue-200",
    accent: "text-blue-600",
    icon: <Brain className="w-5 h-5" />
  },
  "수음": { 
    gradient: "from-blue-50 to-blue-100", 
    border: "border-blue-200",
    accent: "text-blue-600",
    icon: <Brain className="w-5 h-5" />
  },
  "목양": { 
    gradient: "from-green-50 to-green-100", 
    border: "border-green-200",
    accent: "text-green-600",
    icon: <Leaf className="w-5 h-5" />
  },
  "목음": { 
    gradient: "from-green-50 to-green-100", 
    border: "border-green-200",
    accent: "text-green-600",
    icon: <Leaf className="w-5 h-5" />
  },
  "토양": { 
    gradient: "from-yellow-50 to-yellow-100", 
    border: "border-yellow-200",
    accent: "text-yellow-600",
    icon: <Heart className="w-5 h-5" />
  },
  "토음": { 
    gradient: "from-yellow-50 to-yellow-100", 
    border: "border-yellow-200",
    accent: "text-yellow-600",
    icon: <Heart className="w-5 h-5" />
  }
};

const summaryMap = {
  "금양": "금양체질은 폐·대장이 약하고 간·담이 강한 특징을 가집니다.",
  "금음": "금음체질은 폐·대장이 약하고 간·담이 약한 특징을 가집니다.",
  "수양": "수양체질은 신·방광이 강하고 비·위가 약한 특징을 가집니다.",
  "수음": "수음체질은 신·방광이 약하고 비·위가 강한 특징을 가집니다.",
  "목양": "목양체질은 간·담이 강하고 폐·대장이 약한 특징을 가집니다.",
  "목음": "목음체질은 간·담이 약하고 폐·대장이 강한 특징을 가집니다.",
  "토양": "토양체질은 비·위가 강하고 간·담이 약한 특징을 가집니다.",
  "토음": "토음체질은 비·위가 약하고 간·담이 강한 특징을 가집니다."
};

// 체질별 식품 정보 추가
const foodMap = {
  "금양": "어패류, 과일, 해조류 섭취를 권장하며 매운 음식, 기름진 음식은 제한하세요.",
  "금음": "단백질, 비타민이 풍부한 음식을 권장하며 찬 음식, 자극적인 음식은 제한하세요.",
  "수양": "과일, 채소를 풍부히 섭취하고 짠 음식, 육류는 적당히 제한하세요.",
  "수음": "따뜻한 음식, 곡물류를 권장하며 차가운 음식, 해산물은 제한하세요.",
  "목양": "생선, 해조류를 권장하며 기름진 육류, 튀김류는 제한하세요.",
  "목음": "단백질, 당질 섭취를 권장하며 자극적인 향신료와 술은 제한하세요.",
  "토양": "달걀, 생선, 채소를 권장하며 기름진 음식, 인스턴트는 제한하세요.",
  "토음": "따뜻한 성질의 음식을 권장하며 찬 음식, 날음식은 제한하세요."
};

export default function ConstitutionCard({ constitution }) {
  const colors = constitutionColors[constitution] || { 
    gradient: "from-primary-50 to-primary-100", 
    border: "border-primary-200",
    accent: "text-primary-600",
    icon: <Leaf className="w-5 h-5" />
  };
  
  return (
    <div className={`max-w-md w-full bg-gradient-to-br ${colors.gradient} ${colors.border} border rounded-2xl shadow-lg overflow-hidden my-4`}>
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-opacity-20">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors.accent} bg-white bg-opacity-70 mr-3`}>
            {colors.icon}
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{constitution}체질</h2>
        </div>
        
        <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-white hover:bg-opacity-20">
          <Link href={`/constitution-detail/${constitution}`}>
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
      
      {/* 내용 */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className={`text-sm font-semibold uppercase tracking-wider ${colors.accent} mb-2`}>체질 특징</h3>
          <p className="text-base text-gray-700 leading-relaxed">{summaryMap[constitution]}</p>
        </div>
        
        <div>
          <h3 className={`text-sm font-semibold uppercase tracking-wider ${colors.accent} mb-2`}>권장 식이</h3>
          <p className="text-base text-gray-700 leading-relaxed">{foodMap[constitution]}</p>
        </div>
        
        <div className="mt-6 text-center">
          <Button className="rounded-full px-6" asChild>
            <Link href={`/constitution-detail/${constitution}`}>자세히 알아보기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 