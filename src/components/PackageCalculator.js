import React, { useState, useEffect } from 'react';
import { CURRENCY_RATES, CURRENCY_CATEGORIES } from '../data/currencyData';

// 거돌 패키지의 보석당 원화 가치
const GORDOL_EFFICIENCY = 1.4883; // 193,480 보석 / 130,000원

function PackageCalculator() {
    const [packagePrice, setPackagePrice] = useState('');
    const [quantities, setQuantities] = useState(
        Object.keys(CURRENCY_RATES).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
    );
    const [discounts, setDiscounts] = useState(
        Object.keys(CURRENCY_RATES).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
    );
    const [activeInputs, setActiveInputs] = useState([]);

    useEffect(() => {
        const active = Object.entries(quantities)
            .filter(([_, value]) => value > 0)
            .map(([key]) => key);
        setActiveInputs(active);
    }, [quantities]);

    const handleQuantityChange = (currency, value) => {
        if (value === '') {
            setQuantities(prev => ({ ...prev, [currency]: 0 }));
            return;
        }

        const numValue = parseInt(value, 10);
        
        if (isNaN(numValue) || !isFinite(numValue)) {
            return;
        }

        const finalValue = Math.max(0, numValue);
        
        setQuantities(prev => ({ ...prev, [currency]: finalValue }));
    };

    const handleDiscountChange = (currency, value) => {
        if (value === '') {
            setDiscounts(prev => ({ ...prev, [currency]: 0 }));
            return;
        }

        const numValue = Math.min(100, Math.max(0, Number(value)));
        if (isNaN(numValue) || !isFinite(numValue)) {
            return;
        }

        setDiscounts(prev => ({ ...prev, [currency]: numValue }));
    };

    const calculateValue = (currency, quantity) => {
        const item = CURRENCY_RATES[currency];
        if (!item) return 0;
        
        const baseValue = item.gemValue;
        const discount = item.hasDiscount ? discounts[currency] / 100 : 0;
        
        return baseValue * (1 - discount) * quantity;
    };

    const calculateTotal = () => {
        return Object.entries(quantities).reduce((total, [currency, quantity]) => {
            return total + calculateValue(currency, quantity);
        }, 0);
    };

    const calculateIndividualValues = () => {
        return activeInputs.map(key => {
            const item = CURRENCY_RATES[key];
            const value = calculateValue(key, quantities[key]);
            return {
                name: item.name,
                quantity: quantities[key],
                value: value
            };
        }).sort((a, b) => b.value - a.value);
    };

    const formatRate = (currency) => {
        const item = CURRENCY_RATES[currency];
        const baseValue = item.gemValue;
        const discount = item.hasDiscount ? discounts[currency] / 100 : 0;
        const discountedValue = baseValue * (1 - discount);
        
        return `${discountedValue.toLocaleString()}보석/개`;
    };

    const renderCurrencyInput = (currency) => {
        const item = CURRENCY_RATES[currency];
        return (
            <div key={currency} className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="w-12 h-12 flex-shrink-0 mr-4">
                    <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="flex-1 space-y-2">
                    <label className="text-sm text-gray-600 block">
                        {item.name} ({formatRate(currency)})
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={quantities[currency] || ''}
                            onChange={(e) => handleQuantityChange(currency, e.target.value)}
                            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="수량"
                        />
                        {item.hasDiscount && (
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={discounts[currency] || ''}
                                    onChange={(e) => handleDiscountChange(currency, e.target.value)}
                                    className="w-20 border rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="할인율"
                                />
                                <span className="text-sm text-gray-500">%</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const handleReset = () => {
        setPackagePrice('');
        setQuantities(Object.keys(CURRENCY_RATES).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}));
        setDiscounts(Object.keys(CURRENCY_RATES).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}));
        setActiveInputs([]);
    };

    return (
        <div className="relative min-h-screen pb-20">
            <h1 className="text-lg font-semibold p-4 bg-indigo-500 text-white rounded-lg">
                패키지 효율 계산기 (베타)
            </h1>

            <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h2 className="font-medium mb-2">기준 패키지: 거침없이 돌격</h2>
                    <p className="text-sm text-gray-600">
                        130,000원 = 보석 상자 40개 + 열쇠 120개 + 펫 알 1200개 + 보석 12,000개
                        <br />
                        (총 139,480 보석 가치)
                    </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                    <h2 className="font-medium text-yellow-800 mb-2">⚠️ 계산기 사용 시 주의사항</h2>
                    <ul className="text-sm text-yellow-700 space-y-1.5">
                        <li>• 보석으로 교환 가능한 재화들만을 기준으로 계산됩니다.</li>
                        <li>• 기본적으로 가치 산정은 암시장 교환비를 기준으로 하며, 실제 수급 난도는 고려되지 않았습니다.</li>
                        <li>• 보석 상자의 경우, 각 상자의 가치에 따른 포인트 체계를 추론하여 보석 상자의 가치를 3,600 보석으로 환산하였습니다.</li>
                    </ul>
                    <p className="text-xs text-yellow-600 mt-2">
                        따라서 실제 패키지의 가치는 계산된 수치와 다를 수 있습니다.
                    </p>
                </div>
            </div>

            {/* 모바일에서는 우측 하단 FAB, 데스크톱에서는 우측에 고정 */}
            <div className="fixed sm:right-4 sm:top-1/2 sm:-translate-y-1/2 
                          right-4 bottom-4 
                          flex flex-col gap-2 z-40">
                <button
                    onClick={() => handleReset()}
                    className="w-12 sm:w-32 h-12 flex items-center justify-center 
                             bg-indigo-500 hover:bg-indigo-600 text-white rounded-full sm:rounded-xl 
                             shadow-lg transition-colors"
                >
                    <span className="block sm:hidden">↺</span>
                    <span className="hidden sm:inline">입력 초기화</span>
                </button>
            </div>

            <div className="space-y-6">
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <label className="block text-sm text-gray-600 mb-2">
                        패키지 가격 (원)
                    </label>
                    <input
                        type="number"
                        value={packagePrice}
                        onChange={(e) => setPackagePrice(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 130000"
                        min="0"
                    />
                </div>

                {/* 기본 재화 */}
                <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-700">기본 재화</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {CURRENCY_CATEGORIES.basic.map(key => renderCurrencyInput(key))}
                    </div>
                </div>

                {/* S급 에픽 장비 */}
                <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-700">S급 에픽 장비</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {CURRENCY_CATEGORIES.sepic.map(key => renderCurrencyInput(key))}
                    </div>
                </div>

                {/* 에픽 장비 */}
                <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-700">에픽 장비</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {CURRENCY_CATEGORIES.epic.map(key => renderCurrencyInput(key))}
                    </div>
                </div>

                {/* 결과 표시 */}
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
                                        {value.toLocaleString()} 보석
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {packagePrice > 0 && (
                    <div className="p-4 bg-blue-50 rounded-lg space-y-4">
                        <div className="text-lg font-semibold text-blue-900">
                            총 보석 가치: {calculateTotal().toLocaleString()} 보석
                        </div>
                        {(() => {
                            const efficiency = (calculateTotal() / packagePrice) / GORDOL_EFFICIENCY;
                            const percentage = (efficiency * 100).toFixed(2);
                            const multiplier = efficiency.toFixed(2);
                            const isMoreEfficient = efficiency > 1;

                            return (
                                <>
                                    <div className="text-lg font-semibold text-blue-900">
                                        거돌 대비 효율: {percentage}%
                                    </div>
                                    <div className="text-md text-blue-800">
                                        {isMoreEfficient ? (
                                            `거돌보다 ${multiplier}배 더 효율이 좋습니다`
                                        ) : (
                                            `거돌보다 ${(1/efficiency).toFixed(2)}배 더 효율이 안 좋습니다`
                                        )}
                                    </div>
                                    <div className="text-sm text-blue-600">
                                        보석당 가격: {(packagePrice / calculateTotal()).toFixed(2)}원
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PackageCalculator; 