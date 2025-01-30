import React, { useState } from 'react';

function EquationGuide() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mt-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
                <span className="font-semibold text-indigo-900">장비 가치 산정 수식 보기</span>
                <svg
                    className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {isOpen && (
                <div className="mt-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="prose prose-sm max-w-none">
                        <h3 className="text-lg font-semibold mb-4">장비 가치 산정 방식</h3>
                        
                        <div className="space-y-6">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-2">1. S급 에픽 장비 가치</h4>
                                <p className="font-mono bg-white p-2 rounded border">
                                    픽업권 = 180회 × 298보석 = 53,640보석
                                    <br />
                                    무기/방어구 = 1/(0.2% + 1/8÷60) × 298보석 = 73,040보석
                                    <br />
                                    장신구 = 1/(0.4% + 1/4÷60) × 298보석 = 36,475보석
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    * 픽업권은 180회 보장 시스템의 가치입니다
                                    <br />
                                    * 일반 S급 계산식 설명:
                                    <br />
                                    1) 자연확률: 무기/방어구 0.2%, 장신구 0.4%
                                    <br />
                                    &nbsp;&nbsp;&nbsp;- 무기/방어구: 0.2%/1.6% = 1/8
                                    <br />
                                    &nbsp;&nbsp;&nbsp;- 장신구: 0.4%/1.6% = 1/4
                                    <br />
                                    2) 60회당 기댓값 = 자연확률 + (보장확률÷60회)
                                    <br />
                                    3) 1개 획득 기댓값 = 1/(60회당 기댓값)
                                    <br />
                                    4) 보석 가치 = 기댓값 × 뽑기비용(298보석)
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg mt-4">
                                <h4 className="font-medium mb-2">2. 일반 에픽 장비 가치</h4>
                                <p>10회 뽑기(2,980보석) 기준 기댓값:</p>
                                <p className="font-mono bg-white p-2 rounded border">
                                    무기: 5% (일반 2.5% + 보장 2.5%) = 5,960보석
                                    <br />
                                    갑옷: 3% (일반 1.5% + 보장 1.5%) = 9,933보석
                                    <br />
                                    목걸이: 6% (일반 3.0% + 보장 3.0%) = 4,967보석
                                    <br />
                                    반지: 6% (일반 3.0% + 보장 3.0%) = 4,967보석
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    * 일반 뽑기와 10회 보장 시스템을 모두 고려한 계산값입니다
                                    <br />
                                    * 에픽 등급(10%) 내에서의 장비 타입별 가중치가 반영되었습니다
                                </p>
                            </div>

                            <div className="mt-4 text-sm text-gray-500">
                                <p>* 모든 계산은 보석 기준 환율(10.833원/개)을 기준으로 합니다.</p>
                                <p>* 확률 조정은 기준 확률 대비 실제 확률의 비율로 계산됩니다.</p>
                                <p>* 강화 재료로서의 가치는 해당 종류의 전체 획득 확률을 기준으로 합니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EquationGuide; 