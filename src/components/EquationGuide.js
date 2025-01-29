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
                                <h4 className="font-medium mb-2">1. S급 에픽 기본 가치</h4>
                                <div className="text-sm space-y-2">
                                    <p>기준: 180회 뽑기 보장</p>
                                    <p className="font-mono bg-white p-2 rounded border">
                                        기본 가치 = 180회 × (2,980 ÷ 10) × 10.833
                                        <br />
                                        = 180 × 298 × 10.833
                                        <br />
                                        = 580,930원
                                    </p>
                                </div>

                                <div className="mt-4">
                                    <p>A. 특정 아이템 저격 시 가치:</p>
                                    <p className="font-mono bg-white p-2 rounded border">
                                        0.2% 아이템 = 580,930 × (1 ÷ 0.2) = 726,160원
                                        <br />
                                        0.4% 아이템 = 580,930 × (1 ÷ 0.4) = 363,080원
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-2">2. 에픽 장비 가치</h4>
                                <p>A. 특정 아이템 저격 시 가치:</p>
                                <p className="font-mono bg-white p-2 rounded border">
                                    무기(0.25%) = 32,270 × (1 ÷ 0.25) = 80,680원
                                    <br />
                                    방어구(0.5%) = 32,270 × (1 ÷ 0.5) = 40,340원
                                    <br />
                                    목걸이(1%) = 32,270 × (1 ÷ 1) = 20,170원
                                    <br />
                                    반지(1%) = 32,270 × (1 ÷ 1) = 20,170원
                                </p>
                                <p className="mt-4">B. 강화 재료로서의 가치 (종류별 전체 획득 확률 기준):</p>
                                <p className="font-mono bg-white p-2 rounded border">
                                    무기: 2.5% (0.25% × 10종) = 32,270 × (1 ÷ 2.5) = 12,910원
                                    <br />
                                    방어구: 1.5% (0.5% × 3종) = 32,270 × (1 ÷ 1.5) = 21,510원
                                    <br />
                                    목걸이: 3% (1% × 3종) = 32,270 × (1 ÷ 3) = 10,760원
                                    <br />
                                    반지: 3% (1% × 3종) = 32,270 × (1 ÷ 3) = 10,760원
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