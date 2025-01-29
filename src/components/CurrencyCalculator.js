import React, { useState, useEffect } from 'react';
import CurrencyGuide from './CurrencyGuide';
import EquationGuide from './EquationGuide';

const CURRENCY_RATES = {
    gem: { 
        name: '보석', 
        rate: 10.833,
        image: '/Jewel.webp'
    },
    petEgg: { 
        name: '펫 알', 
        rate: 9.28,
        image: '/PetEgg.webp'
    },
    dragonBook: { 
        name: '드래곤 책', 
        rate: 1300,
        image: '/DragonBook.webp'
    },
    normalBook: { 
        name: '일반 책', 
        rate: 866.4,
        image: '/GeneralBook.webp'
    },
    key: { 
        name: '열쇠', 
        rate: 3227.03,
        image: '/Key.webp'
    },
    goldenHorseshoe: { 
        name: '황금 말굽쇠', 
        rate: 21.66,
        image: '/HorseShoe.webp'
    },
    divineHammer: { 
        name: '신위 망치', 
        rate: 187.5,
        image: '/Hammer.webp'
    },
    blueprint: { 
        name: '장비 도면', 
        rate: 3249,
        image: '/equipment drawings.webp'
    },
    gemBox: {
        name: '보석 상자',
        rate: 9963.6,
        image: '/BosuckBox.webp'
    },
    sEquipmentPickup: {
        name: 'S급 에픽 (픽업)',
        rate: 580930,
        image: '/SEquipment0.2prob.webp'
    },
    sEquipment02: {
        name: 'S급 에픽 (0.2%)',
        rate: 726160,
        image: '/SEquipment0.2prob.webp'
    },
    sEquipment04: {
        name: 'S급 에픽 (0.4%)',
        rate: 363080,
        image: '/SEquipment0.4prob.webp'
    },
    epicWeapon: {
        name: '에픽 무기',
        rate: 80680,
        image: '/EpicEquipment_weapon.webp'
    },
    epicArmor: {
        name: '에픽 방어구',
        rate: 40340,
        image: '/EpicEquipment_Armor.webp'
    },
    epicAccessory: {
        name: '에픽 목걸이/반지',
        rate: 20170,
        image: '/EpicEquipment_Neckless.webp'
    },
    maintanenceStone: {
        name: '유지석',
        rate: 9100.04,
        image: '/Maintanence Stone.webp'
    },
};

function CurrencyCalculator() {
    const [quantities, setQuantities] = useState(
        Object.keys(CURRENCY_RATES).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
    );
    const [activeInputs, setActiveInputs] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [showEquipmentGuide, setShowEquipmentGuide] = useState(false);

    useEffect(() => {
        const active = Object.entries(quantities)
            .filter(([_, value]) => value > 0)
            .map(([key]) => key);
        setActiveInputs(active);
    }, [quantities]);

    const handleQuantityChange = (currency, value) => {
        setQuantities(prev => ({
            ...prev,
            [currency]: value === '' ? 0 : parseInt(value, 10)
        }));
    };

    const calculateTotal = () => {
        return Object.entries(quantities).reduce((total, [currency, quantity]) => {
            return total + (CURRENCY_RATES[currency].rate * quantity);
        }, 0);
    };

    const handleReset = () => {
        setQuantities(
            Object.keys(CURRENCY_RATES).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
        );
    };

    const calculateIndividualValues = () => {
        return activeInputs.map(key => ({
            name: CURRENCY_RATES[key].name,
            quantity: quantities[key],
            value: CURRENCY_RATES[key].rate * quantities[key],
        })).sort((a, b) => b.value - a.value);
    };

    const categories = {
        basic: [
            'gem', 'petEgg', 'dragonBook', 'normalBook', 'key', 
            'goldenHorseshoe', 'divineHammer', 'blueprint', 'gemBox',
            'maintanenceStone'
        ],
        sEquipment: ['sEquipmentPickup', 'sEquipment02', 'sEquipment04'],
        epicEquipment: ['epicWeapon', 'epicArmor', 'epicAccessory']
    };

    // 주요 재화로 환산하는 함수
    const calculateEquivalents = (totalValue) => {
        // 모든 재화 포함
        return Object.entries(CURRENCY_RATES).map(([key, currency]) => ({
            name: currency.name,
            image: currency.image,
            rate: currency.rate,
            amount: Number((totalValue / currency.rate).toFixed(2))  // 소수점 둘째자리까지 반올림
        })).sort((a, b) => a.rate - b.rate);  // 가치가 낮은 순으로 정렬
    };

    const getCurrencyDescription = (name) => {
        const descriptions = {
            '보석': '캐시샵에서 구매 가능한 기본 재화입니다. (2,980원/10개)',
            '펫 알': '펫 뽑기에 사용되는 재화입니다.',
            '드래곤 책': '고대 드래곤 계승에 사용되는 재화입니다.',
            '일반 책': '해골/기사/유협/유령 계승에 사용되는 재화입니다.',
            '열쇠': '장비 뽑기에 사용되는 재화입니다.',
            '황금 말굽쇠': '탈 것 강화에 사용되는 재화입니다.',
            '신위 망치': '아티팩트 강화에 사용되는 재화입니다.',
            '장비 도면': '장비 승급에 사용되는 재화입니다.',
            '보석 상자': '보석을 대량으로 획득할 수 있는 상자입니다.',
            '유지석': '펫 육성 옵션 유지에 사용되는 재화입니다. (13만원/100개 + 12,000보석)',
            'S급 에픽 (픽업)': '픽업 시 획득할 수 있는 S급 에픽 장비입니다. (180회 보장)',
            'S급 에픽 (0.2%)': '0.2% 확률의 S급 에픽 장비입니다.',
            'S급 에픽 (0.4%)': '0.4% 확률의 S급 에픽 장비입니다.',
            '에픽 무기': '0.25% 확률의 에픽 무기입니다.',
            '에픽 방어구': '0.5% 확률의 에픽 방어구입니다.',
            '에픽 목걸이/반지': '1% 확률의 에픽 장신구입니다.',
        };
        return descriptions[name] || '설명이 없는 재화입니다.';
    };

    return (
        <div className="space-y-4 relative">
            <h1 className="text-lg font-semibold p-4 bg-indigo-500 text-white rounded-lg">
                재화 가치 계산기
            </h1>

            <CurrencyGuide isOpen={isGuideOpen} setIsOpen={setIsGuideOpen} />
            <EquationGuide />

            {/* 실제 우측 하단에 떠있는 초기화 버튼 */}
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={handleReset}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs px-3 py-1.5 rounded shadow-sm"
                >
                    입력 초기화
                </button>
            </div>

            {activeInputs.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-md font-medium text-gray-700 mb-3">현재 입력 현황</h3>
                    <div className="space-y-2">
                        {calculateIndividualValues().map(({ name, quantity, value }) => (
                            <div key={name} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    {name} × {quantity.toLocaleString()}개
                                </span>
                                <span className="font-medium text-gray-800">
                                    {value.toLocaleString()}원
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
                                    {CURRENCY_RATES[key].name} ({CURRENCY_RATES[key].rate.toLocaleString()}원/개)
                                </label>
                                <input
                                    type="number"
                                    min="0"
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
                    {categories.sEquipment.map(key => (
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
                                    {CURRENCY_RATES[key].name} ({CURRENCY_RATES[key].rate.toLocaleString()}원/개)
                                </label>
                                <input
                                    type="number"
                                    min="0"
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
                    {categories.epicEquipment.map(key => (
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
                                    {CURRENCY_RATES[key].name} ({CURRENCY_RATES[key].rate.toLocaleString()}원/개)
                                </label>
                                <input
                                    type="number"
                                    min="0"
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
                            {calculateIndividualValues().map(({ name, quantity, value }) => (
                                <div key={name} className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        {name} × {quantity.toLocaleString()}개
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {value.toLocaleString()}원
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="p-4 bg-blue-50 rounded-lg space-y-4">
                    <div className="text-lg font-semibold text-blue-900">
                        총 가치: {calculateTotal().toLocaleString()}원
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
                                            className="flex items-center gap-2 bg-[#6366F1] p-3 rounded-lg"
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
                        {/* 모달 헤더 */}
                        <div className="p-4">
                            <h3 className="text-xl font-bold">에픽 장비 가치 기준</h3>
                        </div>

                        {/* 모달 컨텐츠 */}
                        <div className="px-4 py-2 space-y-4">
                            <div>
                                <h4 className="text-lg font-medium mb-3">1. 특정 아이템 저격 시 가치</h4>
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <p className="text-gray-600 mb-3">원하는 특정 아이템을 얻기 위한 기대 가치</p>
                                    <ul className="space-y-2">
                                        <li>• 무기(0.25%): 80,680원/개</li>
                                        <li>• 방어구(0.5%): 40,340원/개</li>
                                        <li>• 목걸이(1%): 20,170원/개</li>
                                        <li>• 반지(1%): 20,170원/개</li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-medium mb-3">2. 강화 재료로서의 가치</h4>
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <p className="text-gray-600 mb-3">종류별 전체 획득 확률 기준 (10회 보장 기준: 32,270원)</p>
                                    <ul className="space-y-2">
                                        <li>• 무기: 2.5% (0.25% × 10종) = 12,910원/개</li>
                                        <li>• 방어구: 1.5% (0.5% × 3종) = 21,510원/개</li>
                                        <li>• 목걸이: 3% (1% × 3종) = 10,760원/개</li>
                                        <li>• 반지: 3% (1% × 3종) = 10,760원/개</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 모달 푸터 */}
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
        </div>
    );
}

export default CurrencyCalculator; 