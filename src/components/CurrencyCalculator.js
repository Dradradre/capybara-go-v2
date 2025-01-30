import React, { useState, useEffect } from 'react';
import CurrencyGuide from './CurrencyGuide';
import EquationGuide from './EquationGuide';

const CURRENCY_RATES = {
    gem: { 
        name: '보석', 
        gemValue: 1,  // 기준 재화
        image: '/Jewel.webp'
    },
    petEgg: { 
        name: '펫 알', 
        gemValue: 0.857,  // 30보석/35개
        image: '/PetEgg.webp'
    },
    dragonBook: { 
        name: '드래곤 책', 
        gemValue: 120,  // 600보석/5개
        image: '/DragonBook.webp'
    },
    normalBook: { 
        name: '일반 책', 
        gemValue: 80,  // 400보석/5개
        image: '/GeneralBook.webp'
    },
    key: { 
        name: '열쇠', 
        gemValue: 298,  // 2980보석/10개
        image: '/Key.webp'
    },
    goldenHorseshoe: { 
        name: '황금 말굽쇠', 
        gemValue: 20,  // 1000보석/50개
        image: '/HorseShoe.webp'
    },
    blueprint: { 
        name: '장비 도면', 
        rate: 3249,
        image: '/equipment drawings.webp'
    },
    gemBox: {
        name: '보석 상자',
        gemValue: 920,  // 230보석 * 4회
        image: '/BosuckBox.webp'
    },
    sEquipmentPickup: {
        name: 'S급 에픽 픽업권',
        gemValue: 53640,  // 180회 보장
        image: '/SEpicEquipment_pickup.webp'
    },
    epicWeapon: {
        name: '에픽 무기',
        image: '/EpicEquipment_Weapon.webp',
        gemValue: 5960
    },
    epicArmor: {
        name: '에픽 방어구',
        image: '/EpicEquipment_Armor.webp',
        gemValue: 9933
    },
    epicAccessory: {
        name: '에픽 목걸이/반지',
        image: '/EpicEquipment_Neckless.webp',
        gemValue: 4967
    },
    younggeolContract: {
        name: '영걸의 계약',
        gemValue: 7450,  // 298/0.04
        image: '/ContractOfHero.webp'
    },
    // S급 에픽 장비
    sEquipmentWeapon: {
        name: 'S급 에픽 무기',
        gemValue: 15937,  // (0.2% + 60회보장) 기준
        image: '/SEquipment_Weapon.webp'
    },
    sEquipmentArmor: {
        name: 'S급 에픽 방어구',
        gemValue: 15937,  // (0.2% + 60회보장) 기준
        image: '/SEquipment_Armor.webp'
    },
    sEquipmentAccessory: {
        name: 'S급 에픽 장신구',
        gemValue: 14396,  // (0.4% + 60회보장) 기준
        image: '/SEquipment_Accessory.webp'
    },
    // 특수 재화 (현금 전용) - 주석 처리
    /*
    yujiStone: {
        name: '유지석',
        gemValue: 840,  // 9,100.04원 기준
        image: '/YujiStone.webp'
    },
    sinwiHammer: {
        name: '신위 망치',
        gemValue: 17.31,  // 187.505원 기준
        image: '/SinwiHammer.webp'
    },
    */
};

function CurrencyCalculator() {
    const [quantities, setQuantities] = useState(
        Object.keys(CURRENCY_RATES).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
    );
    const [activeInputs, setActiveInputs] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [showEquipmentGuide, setShowEquipmentGuide] = useState(false);
    const [showGems, setShowGems] = useState(true);
    const [showWarningModal, setShowWarningModal] = useState(false);

    useEffect(() => {
        const active = Object.entries(quantities)
            .filter(([_, value]) => value > 0)
            .map(([key]) => key);
        setActiveInputs(active);
    }, [quantities]);

    const handleQuantityChange = (currency, value) => {
        // 빈 문자열이면 0으로 처리
        if (value === '') {
            setQuantities(prev => ({ ...prev, [currency]: 0 }));
            return;
        }

        // 숫자만 허용 (음수 제외)
        const numValue = Math.max(0, Number(value));
        
        // NaN이거나 무한대인 경우 이전 값 유지
        if (isNaN(numValue) || !isFinite(numValue)) {
            return;
        }

        setQuantities(prev => ({ ...prev, [currency]: numValue }));
    };

    const calculateTotal = () => {
        return Object.entries(quantities).reduce((total, [currency, quantity]) => {
            const item = CURRENCY_RATES[currency];
            if (!item) return total; // 존재하지 않는 아이템은 건너뛰기
            
            // rate가 있으면 원화 기준, gemValue가 있으면 보석 기준
            const value = item.rate ? item.rate / 10.833 : (item.gemValue || 0);
            return total + (value * quantity);
        }, 0);
    };

    const handleReset = () => {
        setQuantities(
            Object.keys(CURRENCY_RATES).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
        );
    };

    const calculateIndividualValues = () => {
        return activeInputs.map(key => {
            const item = CURRENCY_RATES[key];
            const value = item.rate ? item.rate / 10.833 : item.gemValue;
            return {
                name: item.name,
                quantity: quantities[key],
                value: value * quantities[key],
                isRate: !!item.rate
            };
        }).sort((a, b) => b.value - a.value);
    };

    const categories = {
        basic: [
            'gem', 'petEgg', 'dragonBook', 'normalBook', 'key', 
            'goldenHorseshoe', 'blueprint', 'gemBox',
            'younggeolContract'
        ],
        epic: [
            'epicWeapon', 'epicArmor', 'epicAccessory'
        ],
        sepic: [
            'sEquipmentPickup',
            'sEquipmentWeapon',
            'sEquipmentArmor', 
            'sEquipmentAccessory'
        ]
    };

    // 주요 재화로 환산하는 함수
    const calculateEquivalents = (totalValue) => {
        return Object.entries(CURRENCY_RATES).map(([key, currency]) => {
            const rate = currency.gemValue || currency.rate;
            return {
                name: currency.name,
                image: currency.image,
                rate: rate,
                amount: Number((totalValue / rate).toFixed(2))
            }
        }).sort((a, b) => a.rate - b.rate);
    };

    const getCurrencyDescription = (name) => {
        const descriptions = {
            '보석': '캐시샵에서 구매 가능한 기본 재화입니다. (2,980원/10개)',
            '펫 알': '펫 뽑기에 사용되는 재화입니다.',
            '드래곤 책': '고대 드래곤 계승에 사용되는 재화입니다.',
            '일반 책': '해골/기사/유협/유령 계승에 사용되는 재화입니다.',
            '열쇠': '장비 뽑기에 사용되는 재화입니다.',
            '황금 말굽쇠': '탈 것 강화에 사용되는 재화입니다.',
            '장비 도면': '장비 승급에 사용되는 재화입니다.',
            '보석 상자': '보석을 대량으로 획득할 수 있는 상자입니다.',
            '유지석': '펫 육성 옵션 유지에 사용되는 재화입니다. (13만원/100개 + 12,000보석)',
            'S급 에픽 (픽업)': '픽업 시 획득할 수 있는 S급 에픽 장비입니다. (180회 보장)',
            '에픽 무기': '에픽 무기입니다. (10회당 0.5개 기댓값)',
            '에픽 방어구': '에픽 방어구입니다. (10회당 0.3개 기댓값)',
            '에픽 목걸이/반지': '에픽 장신구입니다. (10회당 0.6개 기댓값)',
            '영걸의 계약': '영걸의 계약 가치를 나타냅니다. (약 80,706원)',
        };
        return descriptions[name] || '설명이 없는 재화입니다.';
    };

    // 가치를 보석/원화로 변환하는 함수
    const formatValue = (gemValue, isRate = false) => {
        if (showGems) {
            // 원화 기준 rate를 보석으로 변환
            const value = isRate ? gemValue / 10.833 : gemValue;
            return `${value.toLocaleString('ko-KR', { maximumFractionDigits: 2 })} 보석`;
        }
        // 보석 기준 gemValue를 원화로 변환
        const value = isRate ? gemValue : gemValue * 10.833;
        return `${value.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}원`;
    };

    // 단가 표시를 위한 함수
    const formatRate = (currency) => {
        const value = CURRENCY_RATES[currency].gemValue || CURRENCY_RATES[currency].rate / 10.833;
        if (showGems) {
            return `${value.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}보석/개`;
        }
        return `${(value * 10.833).toLocaleString('ko-KR', { maximumFractionDigits: 2 })}원/개`;
    };

    return (
        <div className="relative min-h-screen pb-20">
            <h1 className="text-lg font-semibold p-4 bg-indigo-500 text-white rounded-lg">
                재화 가치 계산기
            </h1>

            <CurrencyGuide isOpen={isGuideOpen} setIsOpen={setIsGuideOpen} />
            <EquationGuide />

            {/* 고정된 버튼 그룹 */}
            <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40">
                <button
                    onClick={() => {
                        if (showGems) {  // 원화로 바꿀 때만 경고 모달 표시
                            setShowWarningModal(true);
                        } else {
                            setShowGems(true);  // 보석으로 바로 전환
                        }
                    }}
                    className="w-32 h-12 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors"
                >
                    <img 
                        src={showGems ? "/Won.webp" : "/Jewel.webp"} 
                        alt={showGems ? "원화" : "보석"} 
                        className="w-6 h-6" 
                    />
                    <span>{showGems ? "단위 변경" : "단위 변경"}</span>
                </button>
                
                <button
                    onClick={() => handleReset()}
                    className="w-32 h-12 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors"
                >
                    입력 초기화
                </button>
            </div>

            {/* 결과 표시 영역 - 스크롤에 영향받지 않도록 수정 */}
            {activeInputs.length > 0 && (
                <div className="fixed top-4 left-4 right-4 z-40 bg-blue-50 rounded-lg p-4 shadow-lg">
                    <div className="text-lg font-semibold text-blue-900">
                        총 가치: {formatValue(calculateTotal())}
                    </div>
                    <div className="text-sm text-blue-600 mt-1">
                        입력된 항목 수: {activeInputs.length}개
                    </div>
                </div>
            )}

            {activeInputs.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-md font-medium text-gray-700 mb-3">현재 입력 현황</h3>
                    <div className="space-y-2">
                        {calculateIndividualValues().map(({ name, quantity, value, isRate }) => (
                            <div key={name} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    {name} × {quantity.toLocaleString()}개
                                </span>
                                <span className="font-medium text-gray-800">
                                    {formatValue(value, isRate)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-700">기본 재화</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.basic.map(key => (
                        <div key={key} className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="w-12 h-12 flex-shrink-0 mr-4">
                                <img 
                                    src={CURRENCY_RATES[key].image} 
                                    alt={CURRENCY_RATES[key].name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-sm text-gray-600 block mb-1">
                                    {CURRENCY_RATES[key].name} ({formatRate(key)})
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={quantities[key] || ''}
                                    onChange={(e) => handleQuantityChange(key, e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="수량 입력"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-700">S급 에픽 장비</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.sepic.map(key => (
                        <div key={key} className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="w-12 h-12 flex-shrink-0 mr-4">
                                <img 
                                    src={CURRENCY_RATES[key].image} 
                                    alt={CURRENCY_RATES[key].name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-sm text-gray-600 block mb-1">
                                    {CURRENCY_RATES[key].name} ({formatRate(key)})
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={quantities[key] || ''}
                                    onChange={(e) => handleQuantityChange(key, e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="수량 입력"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-700">
                    에픽 장비
                    <span 
                        className="ml-2 text-sm font-normal text-blue-600 hover:text-blue-800 cursor-pointer inline-flex items-center"
                        onClick={() => setShowEquipmentGuide(true)}
                    >
                        <span>(특정 아이템 저격 기준 가치)</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.epic.map(key => (
                        <div key={key} className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="w-12 h-12 flex-shrink-0 mr-4">
                                <img 
                                    src={CURRENCY_RATES[key].image} 
                                    alt={CURRENCY_RATES[key].name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-sm text-gray-600 block mb-1">
                                    {CURRENCY_RATES[key].name} ({formatRate(key)})
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={quantities[key] || ''}
                                    onChange={(e) => handleQuantityChange(key, e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="수량 입력"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {activeInputs.length > 0 && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-md font-medium text-gray-700 mb-3">입력 항목 요약</h3>
                        <div className="space-y-2">
                            {calculateIndividualValues().map(({ name, quantity, value, isRate }) => (
                                <div key={name} className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        {name} × {quantity.toLocaleString()}개
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {formatValue(value, isRate)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="p-4 bg-blue-50 rounded-lg space-y-4">
                    <div className="text-lg font-semibold text-blue-900">
                        총 가치: {formatValue(calculateTotal())}
                    </div>
                    
                    {activeInputs.length > 0 && (
                        <>
                            <div className="text-sm text-blue-600">
                                입력된 항목 수: {activeInputs.length}개
                            </div>
                            
                            <div className="pt-3 border-t border-blue-100">
                                <div className="text-sm font-medium text-blue-900 mb-2">
                                    다른 재화로 환산 시:
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {calculateEquivalents(calculateTotal()).map(({ name, image, amount }) => (
                                        <button
                                            key={name}
                                            onClick={() => setSelectedCurrency(name)}
                                            className="flex items-center gap-2 bg-[#6366F1] hover:bg-[#4F46E5] p-3 rounded-lg transition-colors"
                                        >
                                            <img 
                                                src={image} 
                                                alt={name} 
                                                className="w-6 h-6 object-contain"
                                            />
                                            <div className="text-left">
                                                <span className="block text-xs text-white">
                                                    {name}
                                                </span>
                                                <span className="block text-sm font-medium text-white">
                                                    {amount.toLocaleString()}개
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* 재화 설명 모달 */}
            {selectedCurrency && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50"
                    onClick={() => setSelectedCurrency(null)}
                >
                    <div className="w-full bg-white rounded-t-xl p-4 animate-slide-up">
                        <h3 className="text-lg font-semibold mb-2">{selectedCurrency}</h3>
                        <p className="text-gray-600 text-sm">
                            {getCurrencyDescription(selectedCurrency)}
                        </p>
                        <button 
                            className="w-full mt-4 p-3 text-center text-blue-600 border-t"
                            onClick={() => setSelectedCurrency(null)}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}

            {/* 에픽 장비 가치 설명 모달 */}
            {showEquipmentGuide && (
                <div 
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowEquipmentGuide(false)}
                >
                    <div 
                        className="bg-white rounded-2xl w-full max-w-lg animate-modal-up"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-4">
                            <h3 className="text-xl font-bold">특정 아이템 저격 기준 가치</h3>
                        </div>

                        <div className="px-4 py-2 space-y-4">
                            <div className="bg-blue-50 p-4 rounded-xl">
                                <p className="text-gray-700">
                                    현재 표시된 가치는 <span className="font-medium">모든 에픽 장비를 강화 재료로 사용</span>할 때의 기준입니다.
                                    <br /><br />
                                    특정 아이템을 저격할 경우, 실제 필요한 보석은 아래 계산식에 따라 더 높아집니다.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                <h4 className="font-medium">계산 방식</h4>
                                <div className="space-y-2 text-gray-600">
                                    <p>1. 에픽 등급 내 장비 타입별 가중치</p>
                                    <ul className="ml-4 text-sm">
                                        <li>• 무기: 25% (10종)</li>
                                        <li>• 갑옷: 15% (3종)</li>
                                        <li>• 목걸이/반지: 각 30% (각 3종)</li>
                                    </ul>
                                    <p>2. 특정 아이템 저격 시 확률</p>
                                    <ul className="ml-4 text-sm">
                                        <li>• 무기: 0.25% (2.5% ÷ 10종)</li>
                                        <li>• 갑옷: 0.5% (1.5% ÷ 3종)</li>
                                        <li>• 목걸이/반지: 1% (3% ÷ 3종)</li>
                                    </ul>
                                    <p>3. 10회 보장 시스템 반영</p>
                                    <ul className="ml-4 text-sm">
                                        <li>• 10회당 해당 타입 1개 보장</li>
                                        <li>• 원하는 특정 아이템을 얻을 확률은 종류 수로 나눔</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-gray-600 mb-3">따라서 특정 아이템 저격 시 실제 가치는,</p>
                                <ul className="space-y-2">
                                    <li>
                                        • 무기: 5,960 × 10 = 59,600보석/개
                                        <br />
                                        <span className="text-sm text-gray-500 ml-4">
                                            (10종 중 원하는 무기 1개를 얻기 위해 평균적으로 필요한 보석)
                                        </span>
                                    </li>
                                    <li>
                                        • 갑옷: 9,933 × 3 = 29,799보석/개
                                        <br />
                                        <span className="text-sm text-gray-500 ml-4">
                                            (3종 중 원하는 갑옷 1개를 얻기 위해 평균적으로 필요한 보석)
                                        </span>
                                    </li>
                                    <li>
                                        • 목걸이/반지: 4,967 × 3 = 14,901보석/개
                                        <br />
                                        <span className="text-sm text-gray-500 ml-4">
                                            (3종 중 원하는 장신구 1개를 얻기 위해 평균적으로 필요한 보석)
                                        </span>
                                    </li>
                                </ul>
                                <p className="text-sm text-gray-500 mt-3">
                                    * 위 수치는 해당 타입 내에서 원하는 특정 아이템 1개를 얻기 위해 평균적으로 필요한 보석의 양입니다.
                                </p>
                            </div>
                        </div>

                        <div className="p-4">
                            <button 
                                className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors"
                                onClick={() => setShowEquipmentGuide(false)}
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 경고 모달 */}
            {showWarningModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold mb-3">⚠️ 원화 환산 주의</h3>
                        <p className="text-gray-600 mb-4">
                            원화 가치는 참고용으로만 사용해주세요. 실제 가치는 게임 내 상황과 시장 상황에 따라 크게 달라질 수 있습니다.
                            <br /><br />
                            정확한 가치 비교를 위해서는 보석 단위 사용을 권장드립니다.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowGems(false);  // 원화로 전환
                                    setShowWarningModal(false);
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                확인했습니다
                            </button>
                            <button
                                onClick={() => setShowWarningModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CurrencyCalculator; 