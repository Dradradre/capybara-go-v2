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
                                {/* • 희귀 재화: 공식 패키지 가격 기준 */}
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
                                <span className="text-sm text-gray-500">계산식: 298보석/개</span>
                            </li>
                            <li>
                                <strong>황금 말굽쇠</strong>
                                <br />
                                암시장 교환 비율: 50개 = 1,000보석
                                <br />
                                <span className="text-sm text-gray-500">계산식: 1,000보석 ÷ 50개 = 20보석/개</span>
                            </li>
                            <li>
                                <strong>장비 도면</strong>
                                <br />
                                암시장 교환 비율: 1장 = 300보석
                            </li>
                            <li>
                                <strong>펫 알</strong>
                                <br />
                                교환 비율: 35알 = 30보석
                                <br />
                                <span className="text-sm text-gray-500">계산식: 30보석 ÷ 35알 = 0.857보석/알</span>
                            </li>
                            <li>
                                <strong>드래곤 책</strong>
                                <br />
                                암시장 교환 비율: 5권 = 600보석
                                <br />
                                <span className="text-sm text-gray-500">계산식: 600보석 ÷ 5권 = 120보석/권</span>
                            </li>
                            <li>
                                <strong>일반 책</strong>
                                <br />
                                암시장 교환 비율: 5권 = 400보석
                                <br />
                                <span className="text-sm text-gray-500">계산식: 400보석 ÷ 5권 = 80보석/권</span>
                            </li>
                            <li>
                                <strong>브론즈 보물상자</strong>
                                <br />
                                암시장 교환 비율: 3개 = 120보석
                                <br />
                                <span className="text-sm text-gray-500">계산식: 120보석 ÷ 3개 = 40보석/개</span>
                            </li>
                            <li>
                                <strong>실버 보물상자</strong>
                                <br />
                                암시장 교환 비율: 1개 = 400보석
                            </li>
                            <li>
                                <strong>골드 보물상자</strong>
                                <br />
                                암시장 교환 비율: 1개 = 800보석
                            </li>
                            <li>
                                <strong>펫 보물상자</strong>
                                <br />
                                암시장 교환 비율: 1개 = 1800보석
                            </li>
                            <li>
                                <strong>보석 상자</strong>
                                <br />
                                <span className="text-sm text-gray-500">
                                    계산식: 펫 상자(1800보석) × 2 = 3600보석
                                    <br /><br />
                                    <div className="p-3 bg-gray-50 rounded">
                                        <strong>보석 가치 추론 근거</strong>
                                        <br />
                                        기존에는 보석 상자의 가치를 920 보석으로 계산하였습니다.
                                        <br />
                                        &nbsp;&nbsp;• 230보석 × 4회 = 920보석
                                        <br />
                                        &nbsp;&nbsp;&nbsp;&nbsp;• 230보석 = (50+100+200+300+500) ÷ 5
                                        <br />
                                        &nbsp;&nbsp;• <strong>펫 조각상 및 소장품 가치 미고려</strong>
                                        <br /><br />
                                        <strong>그러나 펫 보물상자의 가치를 1800 보석으로 산정하는데 보석 상자의 가치를 920 보석으로 환산하는 것은 모순입니다.</strong>
                                        따라서 각 상자간의 포인트 체계를 추론하여 보석 상자의 가치를 3,600 보석으로 환산하였습니다.

                                        <br />
                                        <br />
                                        1) 상자별 포인트와 로마 숫자의 연관성
                                        <br />
                                        &nbsp;&nbsp;• 브론즈 = 1포인트 (I)
                                        <br />
                                        &nbsp;&nbsp;• 실버 = 10포인트 (X)
                                        <br />
                                        &nbsp;&nbsp;• 골드 = 20포인트 (XX)
                                        <br />
                                        &nbsp;&nbsp;• 펫 = 50포인트 (L)
                                        <br />
                                        &nbsp;&nbsp;• 보석 = 100포인트 (C)
                                        <br /><br />
                                        2) 로마 숫자의 기본 단위 체계
                                        <br />
                                        &nbsp;&nbsp;• I(1) → V(5) → X(10) → L(50) → C(100) → D(500) → M(1000)
                                    </div>
                                </span>
                            </li>
                            <li>
                                <strong>소원의 두루마리</strong>
                                <br />
                                기원 뽑기 1회 = 298보석
                            </li>
                        </ul>

                        <h3 className="text-lg font-semibold mt-6 mb-3">S급 에픽 장비 가치</h3>
                        <ul className="space-y-4 text-gray-600">
                            <li>
                                <strong>장비 타입별 가치</strong>
                                <br />
                                <span className="text-sm">
                                    • 픽업권: 53,640보석 (180회 보장)
                                    <br />
                                    • 무기/방어구: 73,040보석 (0.2% + 60회 1/8확률)
                                    <br />
                                    • 장신구: 36,475보석 (0.4% + 60회 1/4확률)
                                </span>
                            </li>
                            <li>
                                <strong>계산 방식 상세 설명</strong>
                                <br />
                                <span className="text-sm text-gray-500">
                                    1) 픽업권
                                    <br />
                                    &nbsp;&nbsp;• 180회 보장 × 298보석 = 53,640보석
                                    <br /><br />
                                    2) 무기/방어구 (0.2%)
                                    <br />
                                    &nbsp;&nbsp;• 자연확률: 0.2% = 0.002
                                    <br />
                                    &nbsp;&nbsp;• 60회 보장: S급 전체(1.6%) 중 해당 장비(0.2%) 비율 = 1/8
                                    <br />
                                    &nbsp;&nbsp;• 60회당 기댓값 = 0.002 + (1/8 ÷ 60) = 0.00408
                                    <br />
                                    &nbsp;&nbsp;• 1개 획득에 필요한 횟수 = 1/0.00408 ≈ 245.1회
                                    <br />
                                    &nbsp;&nbsp;• 보석 가치 = 245.1회 × 298보석 = 73,040보석
                                    <br /><br />
                                    3) 장신구 (0.4%)
                                    <br />
                                    &nbsp;&nbsp;• 자연확률: 0.4% = 0.004
                                    <br />
                                    &nbsp;&nbsp;• 60회 보장: S급 전체(1.6%) 중 해당 장비(0.4%) 비율 = 1/4
                                    <br />
                                    &nbsp;&nbsp;• 60회당 기댓값 = 0.004 + (1/4 ÷ 60) = 0.00817
                                    <br />
                                    &nbsp;&nbsp;• 1개 획득에 필요한 횟수 = 1/0.00817 ≈ 122.4회
                                    <br />
                                    &nbsp;&nbsp;• 보석 가치 = 122.4회 × 298보석 = 36,475보석
                                </span>
                            </li>
                            <li>
                                <strong>참고사항</strong>
                                <br />
                                <span className="text-sm text-gray-500">
                                    • 자연확률과 60회 보장 시스템이 모두 반영된 기댓값 기준
                                    <br />
                                    • S급 전체(1.6%) 내에서 각 장비의 비중에 따라 60회 보장 확률이 결정됨
                                    <br />
                                    • 픽업권은 원하는 장비를 선택할 수 있는 프리미엄이 반영된 가치
                                </span>
                            </li>
                        </ul>

                        <h3 className="text-lg font-semibold mt-6 mb-3">일반 에픽 장비 가치</h3>
                        <ul className="space-y-4 text-gray-600">
                            <li>
                                <strong>장비 타입별 가치</strong>
                                <br />
                                <span className="text-sm">
                                    • 무기: 5,960보석 (10회당 0.5개)
                                    <br />
                                    • 갑옷: 9,933보석 (10회당 0.3개)
                                    <br />
                                    • 목걸이/반지: 4,967보석 (10회당 0.6개)
                                </span>
                            </li>
                            <li>
                                <strong>계산 방식 상세 설명</strong>
                                <br />
                                <span className="text-sm text-gray-500">
                                    1) 무기 (25% = 2.5%)
                                    <br />
                                    &nbsp;&nbsp;• 자연확률: 2.5% = 0.025
                                    <br />
                                    &nbsp;&nbsp;• 10회당 기댓값 = 0.5개
                                    <br />
                                    &nbsp;&nbsp;• 1개당 필요한 횟수 = 20회
                                    <br />
                                    &nbsp;&nbsp;• 보석 가치 = 20회 × 298보석 = 5,960보석
                                    <br /><br />
                                    2) 갑옷 (15% = 1.5%)
                                    <br />
                                    &nbsp;&nbsp;• 자연확률: 1.5% = 0.015
                                    <br />
                                    &nbsp;&nbsp;• 10회당 기댓값 = 0.3개
                                    <br />
                                    &nbsp;&nbsp;• 1개당 필요한 횟수 = 33.33회
                                    <br />
                                    &nbsp;&nbsp;• 보석 가치 = 33.33회 × 298보석 = 9,933보석
                                    <br /><br />
                                    3) 목걸이/반지 (30% = 3%)
                                    <br />
                                    &nbsp;&nbsp;• 자연확률: 3% = 0.03
                                    <br />
                                    &nbsp;&nbsp;• 10회당 기댓값 = 0.6개
                                    <br />
                                    &nbsp;&nbsp;• 1개당 필요한 횟수 = 16.67회
                                    <br />
                                    &nbsp;&nbsp;• 보석 가치 = 16.67회 × 298보석 = 4,967보석
                                </span>
                            </li>
                            <li>
                                <strong>참고사항</strong>
                                <br />
                                <span className="text-sm text-gray-500">
                                    • 에픽 등급(10%) 내 장비 타입별 가중치가 반영됨
                                    <br />
                                    • 무기(25%), 갑옷(15%), 목걸이(30%), 반지(30%)
                                    <br />
                                    • 10회 보장 시스템이 반영된 기댓값 기준
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