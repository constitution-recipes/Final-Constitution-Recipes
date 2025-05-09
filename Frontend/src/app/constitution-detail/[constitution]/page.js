import SidebarLayout from '@/components/layout/SidebarLayout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Leaf, Heart, Lungs, Brain, ArrowUpRight, CircleUser, Droplets, FlameKindling, Sparkles, ChefHat } from 'lucide-react';

const constitutionColors = {
  "금양": { 
    gradient: "from-amber-100 via-yellow-50 to-orange-50", 
    border: "border-amber-200",
    accent: "text-amber-600",
    bgAccent: "bg-amber-500",
    icon: <FlameKindling className="w-6 h-6" />,
    bgColor: "bg-amber-50"
  },
  "금음": { 
    gradient: "from-amber-50 via-yellow-50 to-orange-50", 
    border: "border-amber-200",
    accent: "text-amber-600",
    bgAccent: "bg-amber-400",
    icon: <Lungs className="w-6 h-6" />,
    bgColor: "bg-amber-50"
  },
  "수양": { 
    gradient: "from-blue-100 via-blue-50 to-cyan-50", 
    border: "border-blue-200",
    accent: "text-blue-600",
    bgAccent: "bg-blue-500",
    icon: <Droplets className="w-6 h-6" />,
    bgColor: "bg-blue-50"
  },
  "수음": { 
    gradient: "from-blue-50 via-blue-50 to-cyan-50", 
    border: "border-blue-200",
    accent: "text-blue-600",
    bgAccent: "bg-blue-400",
    icon: <Brain className="w-6 h-6" />,
    bgColor: "bg-blue-50"
  },
  "목양": { 
    gradient: "from-green-100 via-green-50 to-emerald-50", 
    border: "border-green-200",
    accent: "text-green-600",
    bgAccent: "bg-green-500",
    icon: <Leaf className="w-6 h-6" />,
    bgColor: "bg-green-50"
  },
  "목음": { 
    gradient: "from-green-50 via-green-50 to-emerald-50", 
    border: "border-green-200",
    accent: "text-green-600",
    bgAccent: "bg-green-400",
    icon: <Sparkles className="w-6 h-6" />,
    bgColor: "bg-green-50"
  },
  "토양": { 
    gradient: "from-yellow-100 via-yellow-50 to-amber-50", 
    border: "border-yellow-200",
    accent: "text-yellow-600",
    bgAccent: "bg-yellow-500",
    icon: <Heart className="w-6 h-6" />,
    bgColor: "bg-yellow-50"
  },
  "토음": { 
    gradient: "from-yellow-50 via-yellow-50 to-amber-50", 
    border: "border-yellow-200",
    accent: "text-yellow-600",
    bgAccent: "bg-yellow-400",
    icon: <CircleUser className="w-6 h-6" />,
    bgColor: "bg-yellow-50"
  }
};

// 체질별 상세 정보 확장
const detailsMap = {
  "금양": {
    description: "폐·대장이 강하고 간·담이 약한 특징을 가집니다. 신체에 열이 많아 뜨거운 음식은 자제하고, 시원한 과일과 녹황색 채소를 섭취하세요.",
    longDescription: "금양체질은 폐와 대장이 강하고 간과 담이 약한 체질입니다. 체온이 높은 편이며 열이 많아 땀이 잘 납니다. 소화력이 좋고 활력이 넘치는 반면, 과식이나 매운 음식을 먹으면 쉽게 체열이 상승할 수 있습니다. 평소 냉성 식품과 시원한 음식을 통해 체내 열을 조절하는 것이 중요합니다.",
    personality: "활동적이고 적극적인 성격으로, 결단력이 강하고 직관력이 발달했습니다. 대체로 외향적이며 사교성이 좋아 인간관계가 원만한 편입니다. 다만 감정의 기복이 있을 수 있고, 때로는 성급한 결정을 내릴 수 있습니다.",
    healthTips: "적절한 수분 섭취와 규칙적인 운동이 중요합니다. 체내 열을 조절하기 위해 가벼운 수영이나 산책이 좋습니다. 과로와 스트레스를 피하고 충분한 휴식을 취하세요.",
    beneficialFoods: ["사과", "배", "오이", "브로콜리", "상추", "녹차", "미역", "다시마", "배추", "양배추", "푸른채소", "해산물", "물고기", "저지방 음식", "냉성 음식"],
    harmfulFoods: ["매운 음식", "카페인", "알코올", "찬 음료", "튀긴 음식", "기름진 음식", "양념이 강한 음식", "자극적인 음식"]
  },
  "금음": {
    description: "폐·대장이 약하고 간·담이 약한 특징을 가집니다. 따뜻한 곡류와 단백질 위주의 식사를 추천합니다.",
    longDescription: "금음체질은 폐와 대장이 약하고 간과 담도 약한 체질입니다. 체온이 낮은 편이며 소화력이 약해 소화불량을 겪기 쉽습니다. 호흡기가 약해 감기에 걸리기 쉬우며, 면역력을 강화하는 식이요법이 중요합니다.",
    personality: "조용하고 온화한 성격으로, 신중하고 체계적인 성향을 가졌습니다. 내성적이며 깊이 생각하는 경향이 있고, 세심한 관찰력을 지녔습니다. 때로는 우유부단하거나 결정을 내리는 데 시간이 걸릴 수 있습니다.",
    healthTips: "규칙적인 생활습관과 따뜻한 환경 유지가 중요합니다. 가벼운 요가나 맞춤형 호흡 운동이 도움이 됩니다. 과로를 피하고 충분한 수면을 취하세요.",
    beneficialFoods: ["닭고기", "오리고기", "따뜻한 우유", "귀리", "통곡물", "생강", "계피", "대추", "인삼", "호두", "밤", "달걀", "당근", "버섯", "온성 식품"],
    harmfulFoods: ["해산물", "찬 채소", "차가운 음료", "날음식", "과도한 소금", "인공 조미료", "너무 찬 음식", "과도한 생과일"]
  },
  "수양": {
    description: "신·방광 기능이 강하고 비·위 기능이 약한 특징을 가집니다. 소화가 잘 되는 따뜻한 죽이나 스프를 자주 드세요.",
    longDescription: "수양체질은 신장과 방광 기능이 강하고 비장과 위 기능이 약한 체질입니다. 체내 수분이 많고 소화기능이 약해 소화불량이나 설사를 겪기 쉽습니다. 신장 기능은 좋은 편이나, 비위가 약해 음식 섭취에 주의가 필요합니다.",
    personality: "지적이고 분석적인 성격으로, 논리적이고 객관적인 판단을 잘합니다. 침착하고 신중한 편이며, 상황을 빠르게 파악하는 능력이 있습니다. 다만 때로는 감정 표현이 부족하거나 지나치게 이성적일 수 있습니다.",
    healthTips: "소화력 강화를 위한 가벼운 운동과 규칙적인 식사가 중요합니다. 과식을 피하고 적정 체온 유지를 위한 노력이 필요합니다. 스트레스 관리에 신경 쓰세요.",
    beneficialFoods: ["고구마", "호박", "닭죽", "생강차", "쌀죽", "당근", "도라지", "복숭아", "귤", "파인애플", "간단한 조리식", "소화가 잘 되는 음식"],
    harmfulFoods: ["기름진 음식", "매운 양념", "과당", "찬 음식", "과도한 육류", "인스턴트 음식", "과식", "자극적인 음식"]
  },
  "수음": {
    description: "신·방광 기능이 약하고 비·위 기능이 강한 특징을 가집니다. 수분 섭취를 조절하고, 따뜻한 성질의 식품을 섭취하세요.",
    longDescription: "수음체질은 신장과 방광 기능이 약하고 비장과 위 기능이 강한 체질입니다. 소화력은 좋은 편이나 신장 기능이 약해 무리한 활동이나 과도한 수분 섭취에 주의해야 합니다. 체온 유지와 신장 기능 강화를 위한 섭생이 중요합니다.",
    personality: "책임감이 강하고 성실한 성격으로, 꼼꼼하고 계획적입니다. 실용적이고 현실적인 판단을 잘하며, 인내심이 강합니다. 때로는 경직되거나 변화를 두려워할 수 있습니다.",
    healthTips: "신장 기능 강화를 위한 적절한 운동과 수분 조절이 중요합니다. 과로를 피하고 충분한 휴식을 취하세요. 특히 허리와 무릎을 보호하는 것이 중요합니다.",
    beneficialFoods: ["육류", "뿌리채소", "약간의 허브차", "생강", "마늘", "부추", "양파", "검은콩", "검은깨", "호두", "밤", "대추", "따뜻한 성질의 음식"],
    harmfulFoods: ["찬 음식", "과다한 수분", "찌개류", "날 음식", "차가운 과일", "알코올", "카페인", "자극적인 음식"]
  },
  "목양": {
    description: "간·담 기능이 강하고 폐·대장이 약한 특징을 가집니다. 과도한 해산물과 찬 음식은 피하고, 온열 음식으로 균형을 맞추세요.",
    longDescription: "목양체질은 간과 담이 강하고 폐와 대장이 약한 체질입니다. 간 기능이 활발하여 에너지가 넘치지만, 이로 인해 오히려 약한 폐와 대장에 부담을 줄 수 있습니다. 과도한 열을 내리고 약한 장기를 보호하는 식이요법이 중요합니다.",
    personality: "과묵하고 단순하며 결정이 빨라 일에 추진력이 강합니다. 대인관계가 넓고 다양하여 사회성이 뛰어나지만, 불건강 상태에서는 우울해지고 나태해질 수 있습니다. 계획적이고 세심한 부분을 놓치지 않으려는 노력이 필요합니다.",
    healthTips: "숙면을 취하는 것이 중요하며, 수면 시에는 몸을 따뜻하게 유지하세요. 땀을 내는 것이 간 기능 안정에 도움이 됩니다. 온수욕이 유익하며, 더운 계절에도 수면 시 따뜻하게 입는 것이 중요합니다.",
    beneficialFoods: ["쇠고기", "닭고기", "오리고기", "따뜻한 우유", "흰쌀", "대두콩", "땅콩", "호두", "은행", "견과류", "밀가루", "뿌리채소", "마늘", "호박", "버섯", "설탕", "배", "사과"],
    harmfulFoods: ["바다 생선", "해물", "배추류", "양배추", "상추", "오이", "브로콜리", "푸른채소", "포도", "포도주", "메밀", "고사리", "모과", "복숭아", "체리", "냉수", "냉음료"]
  },
  "목음": {
    description: "간·담 기능이 약하고 폐·대장이 강한 특징을 가집니다. 따뜻한 단백질과 기름진 음식 위주로 드세요.",
    longDescription: "목음체질은 간과 담이 약하고 폐와 대장이 강한 체질입니다. 소화기능이 양호한 편이나 간 기능이 약해 영양분 대사에 어려움이 있을 수 있습니다. 간 기능을 보호하고 강화하는 식이요법이 중요합니다.",
    personality: "차분하고 섬세한 성격으로, 타인을 배려하며 정서적 지능이 높습니다. 예술적 감각과 창의력이 뛰어나며, 공감 능력이 발달했습니다. 때로는 우유부단하거나 지나치게 감정적일 수 있습니다.",
    healthTips: "규칙적인 식사와 충분한 단백질 섭취가 중요합니다. 과로를 피하고 적절한 휴식을 취하세요. 특히 간 기능 보호를 위해 알코올과 자극적인 음식을 제한하는 것이 좋습니다.",
    beneficialFoods: ["소고기", "돼지고기", "버터", "우유", "유제품", "견과류", "버섯", "뿌리채소", "따뜻한 음식", "단백질", "온갖 열을 내는 음식", "밀가루", "현미", "호두"],
    harmfulFoods: ["매운 음식", "찬 음식", "술", "차", "커피", "해산물", "차가운 과일", "냉음료", "자극적인 음식", "신맛이 강한 음식"]
  },
  "토양": {
    description: "비·위 기능이 강하고 간·담 기능이 약한 특징을 가집니다. 소화에 좋은 곡류와 채소를 중심으로 드세요.",
    longDescription: "토양체질은 비장과 위 기능이 강하고 간과 담 기능이 약한 체질입니다. 소화력이 매우 좋지만, 간 기능이 약해 독소 배출이나 에너지 대사에 어려움이 있을 수 있습니다. 영양 균형을 맞추고 간 기능을 보호하는 식이요법이 중요합니다.",
    personality: "온화하고 부드러운 성격으로, 배려심이 많고 안정적입니다. 화합을 중시하며 조화로운 관계를 유지하는 데 뛰어납니다. 때로는 너무 타인의 의견에 맞추거나 갈등을 회피할 수 있습니다.",
    healthTips: "규칙적인 식사와 적절한 운동이 중요합니다. 과식을 피하고 간 기능 강화를 위한 식이요법에 신경 쓰세요. 스트레스 관리와 충분한 휴식도 중요합니다.",
    beneficialFoods: ["쌀밥", "보리", "호박", "버섯", "달걀", "생선", "채소", "과일", "가벼운 음식", "규칙적인 식사", "콩류", "견과류", "당근", "도라지"],
    harmfulFoods: ["기름진 음식", "과도한 육류", "튀김", "매운 음식", "인스턴트 식품", "과식", "늦은 저녁 식사", "불규칙한 식사", "자극적인 음식"]
  },
  "토음": {
    description: "비·위 기능이 약하고 간·담 기능이 강한 특징을 가집니다. 소화에 부드러운 죽과 야채류를 섭취하세요.",
    longDescription: "토음체질은 비장과 위 기능이 약하고 간과 담 기능이 강한 체질입니다. 소화력이 약해 소화불량이나 복통을 겪기 쉬우며, 간 기능이 활발하여 에너지 소모가 많습니다. 소화를 돕고 영양 흡수를 촉진하는 식이요법이 중요합니다.",
    personality: "진중하고 사려 깊은 성격으로, 분석력과 통찰력이 뛰어납니다. 목표 지향적이며 집중력이 강하고, 체계적인 사고를 합니다. 때로는 완벽주의적 성향이나 과도한 자기 비판이 있을 수 있습니다.",
    healthTips: "소화력 강화를 위한 가벼운 음식과 규칙적인 식사가 중요합니다. 과식을 피하고 소화를 돕는 따뜻한 차나 음료를 섭취하세요. 적절한 휴식과 스트레스 관리도 중요합니다.",
    beneficialFoods: ["따뜻한 음식", "뿌리채소", "죽", "호박죽", "나물류", "생강차", "계피차", "부드러운 식감의 음식", "잘 익힌 음식", "소화가 잘 되는 식품"],
    harmfulFoods: ["찬 음식", "날음식", "기름진 음식", "매운 음식", "과도한 당분", "인스턴트 식품", "늦은 저녁 식사", "과식", "자극적인 음식"]
  }
};

export default function ConstitutionDetailPage({ params }) {
  // URL 파라미터 디코딩 및 공백 제거
  const raw = decodeURIComponent(params.constitution).trim();
  // '체질' 접미사 제거
  const key = raw.endsWith('체질') ? raw.replace(/체질$/, '').trim() : raw;
  // 키 매핑
  const detail = detailsMap[key];
  const colors = constitutionColors[key] || {
    gradient: "from-gray-100 to-gray-50",
    border: "border-gray-200",
    accent: "text-gray-600",
    bgAccent: "bg-gray-500",
    icon: <Leaf className="w-6 h-6" />,
    bgColor: "bg-gray-50"
  };

  if (!detail) {
    return (
      <SidebarLayout>
        <div className="p-6 text-center space-y-4">
          <p className="text-lg">유효하지 않은 체질입니다: <strong>{raw}</strong></p>
          <p>지원되는 체질: {Object.keys(detailsMap).join(', ')}</p>
          <Link href="/constitution-diagnosis">
            <Button className="mt-4">진단 페이지로 돌아가기</Button>
          </Link>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className={`min-h-screen ${colors.bgColor}`}>
        {/* 헤더 영역 */}
        <div className={`bg-gradient-to-r ${colors.gradient} border-b ${colors.border} px-4 sm:px-6 py-8 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
            {colors.icon}
          </div>
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white ${colors.bgAccent} shadow-lg`}>
                {colors.icon}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{key} 체질</h1>
            </div>
            <p className="text-lg text-gray-700 max-w-3xl">{detail.longDescription}</p>
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* 성격 특성 카드 */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${colors.accent}`}>
                <CircleUser className="w-5 h-5" />
                성격 특성
              </h2>
              <p className="text-gray-700 leading-relaxed">{detail.personality}</p>
            </div>

            {/* 건강 관리 팁 카드 */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${colors.accent}`}>
                <Heart className="w-5 h-5" />
                건강 관리 팁
              </h2>
              <p className="text-gray-700 leading-relaxed">{detail.healthTips}</p>
            </div>
          </div>

          {/* 식이 권장사항 */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
            <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${colors.accent}`}>
              <ChefHat className="w-5 h-5" />
              식이 권장사항
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className={`text-base font-medium mb-3 ${colors.accent}`}>유익한 음식</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  {detail.beneficialFoods.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className={`mr-2 text-xs ${colors.accent} mt-1.5`}>●</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-base font-medium mb-3 text-red-500">제한해야 할 음식</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  {detail.harmfulFoods.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2 text-xs text-red-400 mt-1.5">●</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 추천 버튼 */}
          <div className="flex justify-center gap-4 my-6">
            <Button 
              className={`rounded-lg px-6 ${colors.bgAccent} hover:opacity-90 text-white gap-2`} 
              asChild
            >
              <Link href="/chatbot">
                나만의 레시피 생성하기
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
} 