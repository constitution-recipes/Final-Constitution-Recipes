'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, ChevronUp, ChevronDown, Clock, Users, HeartPulse, Leaf, ShoppingBag, ChefHat, Check, DollarSign, Coins } from 'lucide-react';

export default function ExperimentPage() {
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('gpt-4.1-2025-04-14');
  const [qaJson, setQaJson] = useState('');
  const [promptStr, setPromptStr] = useState('');
  const [experiments, setExperiments] = useState([]);  // 전체 실험 리스트
  const [selectedExp, setSelectedExp] = useState(null);  // 선택된 실험
  const [loading, setLoading] = useState(false);

  // 공급자 변경 시 해당 공급자의 첫 번째 모델 자동 선택
  useEffect(() => {
    if (provider === 'openai') {
      setModel('gpt-4.1-2025-04-14');
    } else if (provider === 'gemini') {
      setModel('gemini-2.5-flash-preview-04-17');
    } else if (provider === 'claude') {
      setModel('claude-3-7-sonnet-20250219');
    }
  }, [provider]);

  const handleExperiment = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      // QA 히스토리 JSON 유효성 검사
      let basePayload;
      try {
        basePayload = JSON.parse(qaJson);
      } catch (e) {
        console.error('QA 히스토리 JSON 파싱 오류:', e);
        alert('QA 히스토리 JSON 형식이 올바르지 않습니다. 파일을 확인해주세요.');
        return;
      }
      const payload = {
        ...basePayload,
        provider,
        model,
        prompt_str: promptStr,
      };
      const res = await fetch('/api/v1/experiment/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      // HTTP 응답 상태 확인
      if (!res.ok) {
        const errorText = await res.text();
        console.error('실험 오류 (서버):', errorText);
        alert(`실험 중 서버 오류가 발생했습니다:\n${errorText}`);
        return;
      }
      // JSON 파싱 시도
      let data;
      try {
        data = await res.json();
      } catch (e) {
        const text = await res.text();
        console.error('JSON 파싱 오류:', text);
        alert(`서버 응답이 올바른 JSON이 아닙니다:\n${text}`);
        return;
      }
      // POST 응답으로 생성된 실험 전체 데이터 (TestResponse) 반환됨
      // 요청 시간 계산
      const endTime = Date.now();
      const duration = endTime - startTime; // ms
      // 메시지당 평균 시간
      const timePerMessage = data.results.length ? (duration / data.results.length) : 0;
      // 실험 데이터에 시간 필드 추가
      data.duration = duration;
      data.time_per_message = timePerMessage;
      const newExp = data;
      // 실험 리스트에 최상단 추가
      setExperiments(prev => [newExp, ...prev]);
      // 선택된 실험 갱신
      setSelectedExp(newExp);
    } catch (error) {
      console.error('실험 오류:', error);
      alert('실험 중 오류가 발생했습니다. 콘솔을 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 마운트 시 전체 실험 기록 조회
  useEffect(() => {
    const fetchExps = async () => {
      try {
        const res = await fetch('/api/v1/experiment');
        if (!res.ok) {
          const text = await res.text();
          console.error('실험 기록 로드 서버 오류:', text);
          return;
        }
        const data = await res.json();
        console.log('Fetched experiments data:', data);
        // API가 배열을 반환하지 않을 경우 단일 객체를 배열로 감싸기
        const arr = Array.isArray(data) ? data : [data];
        setExperiments(arr);
      } catch (e) {
        console.error('실험 기록 로드 오류:', e);
      }
    };
    fetchExps();
  }, []);

  // 실험 삭제 핸들러
  async function handleDeleteExperiment(experimentId) {
    try {
      const res = await fetch(`/api/v1/experiment/${experimentId}`, { method: 'DELETE' });
      if (!res.ok) {
        alert('삭제에 실패했습니다.');
        return;
      }
      setExperiments(prev => prev.filter(exp => exp.experiment_id !== experimentId));
      if (selectedExp?.experiment_id === experimentId) setSelectedExp(null);
    } catch (e) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  }

  return (
    <div className="flex h-screen">
      {/* 좌측: 전체 실험 기록 */}
      <div className="w-1/4 p-4 border-r overflow-auto">
        <h2 className="text-2xl font-bold mb-4">실험 기록</h2>
        {!Array.isArray(experiments) ? (
          <p className="text-muted">실험 기록을 로드 중입니다...</p>
        ) : experiments.length === 0 ? (
          <p className="text-muted">실험 기록이 없습니다.</p>
        ) : (
          [...experiments].sort((a, b) => 
            (b.combined_score != null ? b.combined_score : b.overall_average) - 
            (a.combined_score != null ? a.combined_score : a.overall_average)
          ).map(exp => {
            // 가장 첫 result의 timestamp 사용 (없으면 '-')
            let createdAt = '-';
            if (exp.results && exp.results.length > 0 && exp.results[0].timestamp) {
              const d = new Date(exp.results[0].timestamp);
              try {
                createdAt = new Intl.DateTimeFormat('ko-KR', {
                  year: 'numeric', month: '2-digit', day: '2-digit',
                  hour: '2-digit', minute: '2-digit', second: '2-digit',
                  hour12: false,
                  timeZone: 'Asia/Seoul'
                }).format(d);
              } catch {
                createdAt = d.toLocaleString('ko-KR');
              }
            }
            
            // 총 비용 계산
            const totalCost = exp.total_cost ? exp.total_cost.toFixed(4) : '-';
            // 비용 점수와 종합 점수
            const costScore = exp.cost_score != null ? exp.cost_score.toFixed(2) : '-';
            const combinedScore = exp.combined_score != null ? exp.combined_score.toFixed(2) : '-';
            
            return (
              <div
                key={exp.experiment_id}
                className={`mb-3 p-3 rounded-lg cursor-pointer group relative ${selectedExp?.experiment_id === exp.experiment_id ? 'bg-primary/10' : 'bg-card'} border border-border`}
                onClick={() => setSelectedExp(exp)}
              >
                {/* 삭제 버튼 (우측 상단) */}
                <button
                  className="absolute top-2 right-2 z-10 p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                  title="실험 삭제"
                  onClick={e => {
                    e.stopPropagation();
                    if (window.confirm('정말 이 실험 기록을 삭제하시겠습니까?')) {
                      handleDeleteExperiment(exp.experiment_id);
                    }
                  }}
                >
                  <Trash2 size={16} />
                </button>
                <div className="flex justify-between text-sm mb-1">
                  <span>ID: {exp.experiment_id.slice(0, 8)}</span>
                  <span>
                    {combinedScore !== '-' ? (
                      <span title="종합 점수 = 레시피 점수(70%) + 비용 점수(30%)">
                        종합: <span className="text-green-600 font-bold">{combinedScore}</span>
                      </span>
                    ) : (
                      <span>평균(Recipe): {exp.overall_average.toFixed(2)}</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-700 font-semibold mb-1">
                  <span>실험시각: {createdAt}</span>
                  <div className="flex items-center gap-2">
                    {exp.cost_score != null && (
                      <span title="비용 점수 (낮은 비용=높은 점수)" className="text-blue-600">
                        비용점수: {costScore}
                      </span>
                    )}
                    {exp.total_cost && (
                      <span className="flex items-center text-amber-600">
                        <DollarSign size={10} className="mr-0.5" />
                        {totalCost} {exp.avg_cost_per_message != null && `(msg: $${exp.avg_cost_per_message.toFixed(5)})`}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xs font-semibold text-primary">모델: <span className="text-foreground font-bold">{exp.model}</span> / 공급자: <span className="text-foreground font-bold">{exp.provider}</span></div>
                <div className="text-xs mt-1">
                  <span className="font-semibold text-foreground">프롬프트:</span> <span className="font-semibold text-foreground"><PromptPreview text={exp.prompt_str} /></span>
                </div>
                <div className="text-xs text-muted">Convs: {exp.results.length}</div>
              </div>
            );
          })
        )}
      </div>
      {/* 우측: 선택된 실험 상세 및 입력 폼 */}
      <div className="w-3/4 flex flex-col">
        <div className="flex-grow p-4 overflow-auto space-y-6">
          {selectedExp ? (
            <>
              <h2 className="text-2xl font-bold mb-2">실험: {selectedExp.experiment_id}</h2>
              <div className="flex flex-wrap gap-4 items-center mb-2">
                <span className="text-base font-semibold text-primary">모델: <span className="text-foreground font-bold">{selectedExp.model}</span></span>
                <span className="text-base font-semibold text-primary">공급자: <span className="text-foreground font-bold">{selectedExp.provider}</span></span>
                <span className="text-base font-semibold text-accent">평균(Recipe): <span className="font-bold">{selectedExp.overall_average.toFixed(2)}</span></span>
              </div>
              <div className="mb-4">
                <span className="text-sm font-semibold text-foreground">프롬프트: <PromptPreview text={selectedExp.prompt_str} /></span>
              </div>
              {/* 토큰 및 비용 정보 섹션 */}
              {selectedExp.total_cost && (
                <div className="mb-4 p-3 bg-amber-50 rounded-md border border-amber-100">
                  <h3 className="text-sm font-semibold text-amber-700 flex items-center mb-2">
                    <Coins size={16} className="mr-1.5" />
                    토큰 및 비용 정보
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white p-2 rounded shadow-sm">
                      <div className="text-gray-600">입력 토큰</div>
                      <div className="font-semibold text-primary">{selectedExp.total_input_tokens?.toLocaleString() || '-'}</div>
                    </div>
                    <div className="bg-white p-2 rounded shadow-sm">
                      <div className="text-gray-600">출력 토큰</div>
                      <div className="font-semibold text-primary">{selectedExp.total_output_tokens?.toLocaleString() || '-'}</div>
                    </div>
                    <div className="bg-white p-2 rounded shadow-sm">
                      <div className="text-gray-600">총 토큰</div>
                      <div className="font-semibold text-primary">
                        {selectedExp.total_input_tokens && selectedExp.total_output_tokens 
                          ? (selectedExp.total_input_tokens + selectedExp.total_output_tokens).toLocaleString() 
                          : '-'}
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded shadow-sm">
                      <div className="text-gray-600">총 비용</div>
                      <div className="font-semibold text-amber-600">
                        ${selectedExp.total_cost?.toFixed(4) || '-'} USD
                      </div>
                    </div>
                    
                    {selectedExp.avg_cost_per_message != null && (
                      <div className="bg-white p-2 rounded shadow-sm">
                        <div className="text-gray-600">메시지당 비용</div>
                        <div className="font-semibold text-amber-600">
                          ${selectedExp.avg_cost_per_message.toFixed(5)} USD
                        </div>
                      </div>
                    )}
                    
                    {selectedExp.cost_score != null && (
                      <div className="bg-white p-2 rounded shadow-sm">
                        <div className="text-gray-600">비용 점수</div>
                        <div className="font-semibold text-blue-600">
                          {selectedExp.cost_score.toFixed(2)} 
                          <span className="text-xs text-gray-500 ml-1" title="낮은 비용일수록 높은 점수">(min-max 정규화)</span>
                        </div>
                      </div>
                    )}
                    {selectedExp.combined_score != null && (
                      <div className="bg-white p-2 rounded shadow-sm">
                        <div className="text-gray-600">종합 점수</div>
                        <div className="font-semibold text-green-600">
                          {selectedExp.combined_score.toFixed(2)}
                          <span className="text-xs text-gray-500 ml-1" title="레시피 점수(70%) + 비용 점수(30%)">(가중치 적용)</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {(selectedExp.cost_score != null || selectedExp.combined_score != null) && (
                    <div className="mt-2 text-xs text-gray-500">
                      <p>* 비용 점수: 메시지당 0.00001~0.01 USD 범위 내 min-max 정규화 적용 (낮은 비용=높은 점수)</p>
                      <p>* 종합 점수: 레시피 품질 점수(70%)와 비용 점수(30%)의 가중합</p>
                    </div>
                  )}
                </div>
              )}
              <p className="text-sm text-muted">
                총 소요 시간: {selectedExp.duration ?? '-'}ms {selectedExp.duration != null ? `(${(selectedExp.duration/1000).toFixed(2)}s)` : ''}
                {' '}
                (메시지당: {selectedExp.time_per_message != null ? selectedExp.time_per_message.toFixed(1) : '-'}ms {selectedExp.time_per_message != null ? `(${(selectedExp.time_per_message/1000).toFixed(2)}s)` : ''})
              </p>
              {selectedExp.results.map((conv, idx) => (
                <div key={conv.conversation_id} className="p-4 bg-card rounded border border-border mb-6 shadow-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-primary">Conv ID: {conv.conversation_id}</span>
                    <span className="text-sm text-muted">Messages: {conv.messages.length}</span>
                  </div>
                  {/* 토큰 및 비용 정보 표시 */}
                  {conv.input_tokens && (
                    <div className="mb-3 text-xs p-2 bg-gray-50 rounded flex flex-wrap gap-3">
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-1">입력 토큰:</span>
                        <span className="font-semibold">{conv.input_tokens.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-1">출력 토큰:</span>
                        <span className="font-semibold">{conv.output_tokens.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-amber-600">
                        <DollarSign size={12} className="mr-0.5" />
                        <span className="font-semibold">{conv.cost?.toFixed(4) || '0.0000'} USD</span>
                      </div>
                      {conv.cost_score != null && (
                        <div className="flex items-center text-blue-600">
                          <span className="text-gray-500 mr-1">비용 점수:</span>
                          <span className="font-semibold">{conv.cost_score.toFixed(2)}</span>
                        </div>
                      )}
                      {conv.combined_score != null && (
                        <div className="flex items-center text-green-600">
                          <span className="text-gray-500 mr-1">종합:</span>
                          <span className="font-semibold">{conv.combined_score.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {/* 레시피 토글 카드 */}
                  <RecipeToggleCard recipe={conv.recipe_json} />
                  {/* 대화 내용 */}
                  <div className="bg-muted p-2 rounded mb-3">
                    {conv.messages.map((m, i) => (
                      <p key={i}><span className={`font-bold ${m.role === 'user' ? 'text-primary' : 'text-accent'}`}>{m.role}:</span> <span className="text-foreground">{m.content}</span></p>
                    ))}
                  </div>
                  {/* Recipe 평가 먼저 */}
                  <div className="mb-2">
                    <h5 className="font-semibold text-green-700 mb-1">Recipe 평가 <span className="text-xs">(Score: {conv.recipe_score?.toFixed(2)})</span></h5>
                    <div className="grid md:grid-cols-2 gap-2">
                      {conv.recipe_result.map((r, i) => (
                        <div key={i} className="bg-white rounded border border-border p-2 mb-1 shadow-sm">
                          <div className="font-bold text-primary">Q: <span className="font-normal text-foreground">{r.question}</span></div>
                          <div className="font-bold text-accent">A: <span className="font-normal text-foreground">{r.answer}</span></div>
                          <div className="text-xs font-semibold text-gray-700 mt-1">{r.reason}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* QA 평가 */}
                  <div>
                    <h5 className="font-semibold text-blue-700 mb-1">QA 평가 <span className="text-xs">(Score: {conv.qa_score?.toFixed(2)})</span></h5>
                    <div className="grid md:grid-cols-2 gap-2">
                      {conv.qa_result.map((r, i) => (
                        <div key={i} className="bg-white rounded border border-border p-2 mb-1 shadow-sm">
                          <div className="font-bold text-primary">Q: <span className="font-normal text-foreground">{r.question}</span></div>
                          <div className="font-bold text-accent">A: <span className="font-normal text-foreground">{r.answer}</span></div>
                          <div className="text-xs font-semibold text-gray-700 mt-1">{r.reason}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p className="text-muted">왼쪽에서 실험을 선택하세요.</p>
          )}
        </div>
        {/* 입력 폼 영역 */}
        <div className="p-4 border-t space-y-4">
          <h3 className="text-xl font-bold">새 실험 실행</h3>
          {/* QA JSON, Prompt, Provider/Model 선택, 실행 버튼 */}
          <div className="space-y-2">
            <Label htmlFor="promptStr">프롬프트 문자열</Label>
            <Textarea
              id="promptStr"
              className="w-full h-20"
              value={promptStr}
              onChange={e => setPromptStr(e.target.value)}
            />
            <Label htmlFor="qaJsonFile">QA 히스토리 JSON 파일 업로드</Label>
            <input
              id="qaJsonFile"
              type="file"
              accept="application/json"
              onChange={async e => {
                const file = e.target.files?.[0]; if (!file) return;
                const text = await file.text();
                try {
                  const data = JSON.parse(text);
                  setQaJson(JSON.stringify(data, null, 2));
                } catch {
                  alert('올바른 JSON 파일을 업로드해주세요.');
                }
              }}
            />
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label>AI 공급자</Label>
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="공급자 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                    <SelectItem value="claude">Anthropic Claude</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label>모델</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="모델 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {provider === 'openai' && (
                      <>
                        <SelectItem value="gpt-4.1-2025-04-14">GPT-4.1 (2.00$, 8.00$)</SelectItem>
                        <SelectItem value="gpt-4.1-nano-2025-04-14">GPT-4.1 Nano (0.10$, 0.40$)</SelectItem>
                        <SelectItem value="gpt-4o-mini-2024-07-18">GPT-4o Mini (0.40$, 1.60$)</SelectItem>
                        <SelectItem value="gpt-4o">GPT-4o (5.00$, 15.00$)</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (0.50$, 1.50$)</SelectItem>
                      </>
                    )}
                    {provider === 'gemini' && (
                      <>
                        <SelectItem value="gemini-2.5-flash-preview-04-17">Gemini 2.5 Flash (0.15$, 0.60$)</SelectItem>
                        <SelectItem value="gemini-2.5-pro-preview-03-25">Gemini 2.5 Pro (1.25$, 10.00$)</SelectItem>
                        <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash (0.10$, 0.40$)</SelectItem>
                        <SelectItem value="gemini-pro">Gemini Pro (0.25$, 0.75$)</SelectItem>
                      </>
                    )}
                    {provider === 'claude' && (
                      <>
                        <SelectItem value="claude-3-7-sonnet-20250219">Claude 3.7 Sonnet (3.00$, 15.00$)</SelectItem>
                        <SelectItem value="claude-3-5-haiku-20241022">Claude 3.5 Haiku (0.80$, 4.00$)</SelectItem>
                        <SelectItem value="claude-2">Claude 2 (8.00$, 24.00$)</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleExperiment} disabled={loading || !promptStr || !qaJson}>
              {loading ? '실행 중...' : '실험 실행'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 프롬프트 토글 컴포넌트
function PromptPreview({ text }) {
  const [show, setShow] = React.useState(false);
  if (!text) return <span>-</span>;
  if (text.length <= 30) return <span>{text}</span>;
  return (
    <span>
      {show ? text : text.slice(0, 30) + '...'}
      <button
        className="ml-2 text-xs text-blue-600 underline hover:text-blue-800"
        onClick={e => { e.stopPropagation(); setShow(v => !v); }}
      >
        {show ? '간략히' : '전체보기'}
      </button>
    </span>
  );
}

// 레시피 토글 카드 컴포넌트
function RecipeToggleCard({ recipe }) {
  const [open, setOpen] = React.useState(false);
  if (!recipe || Object.keys(recipe).length === 0) return <div className="text-xs text-gray-500 mb-4">레시피 정보가 없습니다.</div>;
  return (
    <div className="mb-3">
      <button
        className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80 text-white text-xs font-semibold hover:from-primary/90 hover:to-primary/70 transition-all duration-300 mb-3 shadow-md flex items-center mx-auto"
        onClick={() => setOpen(v => !v)}
      >
        {open ? (
          <>
            <ChevronUp size={14} className="mr-1" />
            레시피 닫기
          </>
        ) : (
          <>
            <ChevronDown size={14} className="mr-1" />
            레시피 보기
          </>
        )}
      </button>
      {open && (
        <div className="bg-gradient-to-b from-white to-gray-50 border border-border rounded-lg shadow-lg p-4 text-sm w-full max-w-xl mx-auto mb-4 transition-all duration-300 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 pb-2 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">{recipe.title || '레시피 제목 없음'}</h3>
              <p className="text-muted text-xs mb-1">{recipe.description || '설명 없음'}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2 md:mt-0">
              {recipe.difficulty && (
                <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                  {recipe.difficulty}
                </span>
              )}
              {recipe.suitableFor && (
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {recipe.suitableFor}
                </span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            <div className="flex items-center">
              <Clock size={16} className="text-primary mr-1.5" />
              <span className="text-xs text-gray-700">조리 {recipe.cookTime || '-'}</span>
            </div>
            <div className="flex items-center">
              <Users size={16} className="text-primary mr-1.5" />
              <span className="text-xs text-gray-700">인분 {recipe.servings || '-'}</span>
            </div>
            <div className="flex items-center">
              <HeartPulse size={16} className="text-primary mr-1.5" />
              <span className="text-xs text-gray-700 truncate">
                {Array.isArray(recipe.suitableBodyTypes) 
                  ? recipe.suitableBodyTypes.join(', ') 
                  : (recipe.suitableBodyTypes || '-')}
              </span>
            </div>
          </div>
          
          {recipe.nutritionalInfo && (
            <div className="bg-green-50 rounded-md p-2 mb-4 text-xs">
              <div className="font-semibold text-green-700 flex items-center mb-1">
                <Leaf size={14} className="mr-1" />
                영양 정보
              </div>
              <p className="text-gray-700">{recipe.nutritionalInfo}</p>
            </div>
          )}
          
          <div className="mb-4">
            <div className="font-semibold text-gray-800 flex items-center mb-2">
              <ShoppingBag size={16} className="text-primary mr-1.5" />
              재료
            </div>
            <div className="bg-gray-50 rounded-md p-3">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? recipe.ingredients.map((ing, i) => (
                  <li key={i} className="text-xs text-gray-700 flex items-start">
                    <Check size={12} className="text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                    <span>{ing}</span>
                  </li>
                )) : <li className="text-xs text-gray-500">재료 정보 없음</li>}
              </ul>
            </div>
          </div>
          
          <div>
            <div className="font-semibold text-gray-800 flex items-center mb-2">
              <ChefHat size={16} className="text-primary mr-1.5" />
              조리 단계
            </div>
            <div className="bg-gray-50 rounded-md p-3">
              <ol className="space-y-2">
                {Array.isArray(recipe.steps) && recipe.steps.length > 0 ? recipe.steps.map((step, i) => (
                  <li key={i} className="text-xs text-gray-700 flex">
                    <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0 font-semibold">
                      {i+1}
                    </span>
                    <span>{step}</span>
                  </li>
                )) : <li className="text-xs text-gray-500">조리 단계 정보 없음</li>}
              </ol>
            </div>
          </div>
          
          {Array.isArray(recipe.tags) && recipe.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {recipe.tags.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 