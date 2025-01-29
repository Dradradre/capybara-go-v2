import React from 'react';

function CurrencyGuide({ isOpen, setIsOpen }) {
    return (
        <div className="mt-4">
            <button
                id="guide-button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
                <span className="font-semibold text-blue-900">재화 가치 산정 기준 보기</span>
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
                        <div className="mb-6">
                            <p className="font-bold text-red-600 mb-2">
                                * 모든 가격은 안드로이드 플레이스토어 기준, 13만원 = 12,000보석 패키지 기준으로 산정되었습니다.
                            </p>
                            <p className="text-gray-600">
                                • 일반 재화: 암시장 혹은 뽑기에서 보석을 사용하여 교환할 수 있는 기준
                                <br />
                                &nbsp;&nbsp;&nbsp;&nbsp;• 단, 보석 상자는 예외적으로 일반 재화에 포함
                                <br />
                                • 희귀 재화: 공식 패키지 가격 기준
                            </p>
                        </div>

                        <h3 className="text-lg font-semibold mb-3">기준 환율 설정</h3>
                        <p className="text-gray-600">보석을 기준 재화로 설정하여 모든 가치를 원화(KRW)로 환산합니다.</p>
                        <ul className="mt-2 space-y-2 text-gray-600">
                            <li>
                                <strong>기준 환율:</strong> 1보석 = 10.833원
                                <br />
                                <span className="text-sm text-gray-500">산출 근거: 12,000보석 = 130,000원 패키지 기준</span>
                            </li>
                        </ul>

                        <h3 className="text-lg font-semibold mt-6 mb-3">일반 재화</h3>
                        <ul className="space-y-4 text-gray-600">
                            <li>
                                <strong>열쇠</strong>
                                <br />
                                10개로 장비 뽑기 10회 가능 = 2,980보석
                                <br />
                                <span className="text-sm text-gray-500">계산식: (2,980보석 × 10.833원) ÷ 10개 = 3,227.034원/개</span>
                            </li>
                            <li>
                                <strong>황금 말굽쇠</strong>
                                <br />
                                암시장 교환 비율: 50개 = 1,000보석
                                <br />
                                <span className="text-sm text-gray-500">계산식: (1,000보석 × 10.833원) ÷ 50개 = 21.66원/개</span>
                            </li>
                            <li>
                                <strong>장비 도면</strong>
                                <br />
                                암시장 교환 비율: 1장 = 300보석
                                <br />
                                <span className="text-sm text-gray-500">계산식: (300보석 × 10.833원) = 3,249원/장</span>
                            </li>
                            <li>
                                <strong>펫 알</strong>
                                <br />
                                교환 비율: 35알 = 30보석
                                <br />
                                <span className="text-sm text-gray-500">계산식: (30보석 × 10.833원) ÷ 35알 = 9.28원/알</span>
                            </li>
                            <li>
                                <strong>드래곤 책</strong>
                                <br />
                                암시장 교환 비율: 5권 = 600보석
                                <br />
                                <span className="text-sm text-gray-500">계산식: (600보석 × 10.833원) ÷ 5권 = 1,300원/권</span>
                            </li>
                            <li>
                                <strong>일반 책</strong>
                                <br />
                                암시장 교환 비율: 5권 = 400보석
                                <br />
                                <span className="text-sm text-gray-500">계산식: (400보석 × 10.833원) ÷ 5권 = 866.4원/권</span>
                            </li>
                            <li>
                                <strong>보석 상자</strong>
                                <br />
                                4회 뽑기 (50, 100, 200, 300, 500보석)
                                <br />
                                <span className="text-sm text-gray-500">
                                    평균 가치: 9,963.6원/상자
                                    <br />
                                    계산식: (230보석 × 4회) × 10.833원 = 9,963.6원
                                    <br />
                                    * 230보석 = (50+100+200+300+500) ÷ 5
                                    <br />
                                    * 펫 조각상 및 소장품 가치 미고려
                                </span>
                            </li>
                        </ul>

                        <h3 className="text-lg font-semibold mt-6 mb-3">특수 재화</h3>
                        <ul className="space-y-4 text-gray-600">
                            <li>
                                <strong>유지석</strong>
                                <br />
                                패키지: 100개 + 12,000보석 = 130,000원
                                <br />
                                <span className="text-sm text-gray-500">
                                    순수 유지석 가치: 9,100.04원/개
                                    <br />
                                    • 계산식: ((130,000원 × 8) - (12,000보석 × 10.833원)) ÷ 100개
                                    <br />
                                    • 게임사 공식 패키지 가치 기준 (8배수 적용)
                                    <br />
                                    • 보석 가치를 제외한 순수 유지석 가치
                                    <br />
                                    • 암시장/보석 교환이 아닌 공식 패키지 기준 계산
                                </span>
                            </li>
                            <li>
                                <strong>신위 망치</strong>
                                <br />
                                패키지: 240개 + 3,600보석 = 42,000원
                                <br />
                                <span className="text-sm text-gray-500">
                                    순수 망치 가치: 187.505원/개
                                    <br />
                                    • 계산식: ((42,000원 × 2) - (3,600보석 × 10.833원)) ÷ 240개
                                    <br />
                                    • 게임사 공식 패키지 가치 기준 (2배수 적용)
                                    <br />
                                    • 보석 가치를 제외한 순수 망치 가치
                                    <br />
                                    • 암시장/보석 교환이 아닌 공식 패키지 기준 계산
                                </span>
                            </li>
                        </ul>

                        <h3 className="text-lg font-semibold mt-6 mb-3">에픽 장비 가치</h3>
                        <ul className="space-y-4 text-gray-600">
                            <li>
                                <strong>특정 아이템 저격 시 가치</strong>
                                <br />
                                10회 뽑기 = 2,980보석
                                <br />
                                <span className="text-sm text-gray-500">
                                    • 무기(0.25%): 80,680원/개
                                    <br />
                                    • 방어구(0.5%): 40,340원/개
                                    <br />
                                    • 목걸이(1%): 20,170원/개
                                    <br />
                                    • 반지(1%): 20,170원/개
                                </span>
                            </li>
                            <li>
                                <strong>강화 재료로서의 가치</strong>
                                <br />
                                종류별 전체 획득 확률 기준
                                <br />
                                <span className="text-sm text-gray-500">
                                    • 무기: 2.5% (0.25% × 10종) = 12,910원/개
                                    <br />
                                    • 방어구: 1.5% (0.5% × 3종) = 21,510원/개
                                    <br />
                                    • 목걸이: 3% (1% × 3종) = 10,760원/개
                                    <br />
                                    • 반지: 3% (1% × 3종) = 10,760원/개
                                </span>
                            </li>
                        </ul>

                        <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
                            <strong>참고사항</strong>
                            <ul className="mt-2 space-y-1">
                                <li>• S급 에픽 가치는 180회 뽑기 보장을 기준으로 산정</li>
                                <li>• 각 등급 내 개별 아이템의 가치는 해당 아이템의 확률에 반비례</li>
                                <li>• 실제 가치는 로테이션과 확률에 따라 변동될 수 있음</li>
                                <li className="text-red-600">• 재화의 희귀도(수급 난이도)는 가치 산정에 반영되지 않음</li>
                            </ul>
                        </div>

                        <div className="mt-6 text-sm text-gray-500">
                            * 본 가치 산정은 공식 교환 비율과 확률을 기준으로 계산되었으며, 실제 가치는 이와 다를 수 있습니다.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CurrencyGuide; 