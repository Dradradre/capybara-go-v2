import React, { useState } from 'react';

function GordolCalculator({ isOpen, onClose }) {
    const [packagePrice, setPackagePrice] = useState(0);
    const [gems, setGems] = useState(0);
    const [keys, setKeys] = useState(0);
    const [petEggs, setPetEggs] = useState(0);
    const [gemBoxes, setGemBoxes] = useState(0);
    const [efficiency, setEfficiency] = useState(null);

    const calculateEfficiency = () => {
        // 거돌 패키지 기준 가치 (13만원)
        const GORDOL_VALUE = 926920.08;
        const GORDOL_PRICE = 130000;
        const GORDOL_RATIO = GORDOL_VALUE / GORDOL_PRICE;

        // 입력된 패키지의 가치 계산
        const totalValue = 
            gems * 10.833 +
            keys * 3227.034 +
            petEggs * 9.28 +
            gemBoxes * 9963.6;

        // 효율 계산
        const ratio = totalValue / packagePrice;
        const gordolEfficiency = ratio / GORDOL_RATIO;

        setEfficiency(gordolEfficiency);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
                {/* 헤더 */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-bold">거돌 효율 계산기</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* 거돌 패키지 정보 */}
                <div className="p-4 bg-blue-50 mx-4 mt-4 rounded-lg">
                    <h4 className="font-bold mb-2">거돌 패키지 (13만원)</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>• 보석 12,000개</div>
                        <div>• 열쇠 120개</div>
                        <div>• 펫 알 1,200개</div>
                        <div>• 보석 상자 40개</div>
                    </div>
                </div>

                {/* 입력 폼 */}
                <div className="p-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            패키지 가격 (원)
                        </label>
                        <input
                            type="number"
                            value={packagePrice}
                            onChange={(e) => setPackagePrice(Number(e.target.value))}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="예: 130000"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {[
                            { label: '보석 개수', value: gems, setter: setGems },
                            { label: '열쇠 개수', value: keys, setter: setKeys },
                            { label: '펫 알 개수', value: petEggs, setter: setPetEggs },
                            { label: '보석 상자 개수', value: gemBoxes, setter: setGemBoxes }
                        ].map(({ label, value, setter }) => (
                            <div key={label}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {label}
                                </label>
                                <input
                                    type="number"
                                    value={value}
                                    onChange={(e) => setter(Number(e.target.value))}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0"
                                />
                            </div>
                        ))}
                    </div>

                    {/* 계산 버튼 */}
                    <button
                        onClick={calculateEfficiency}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
                    >
                        효율 계산하기
                    </button>

                    {/* 결과 표시 */}
                    {efficiency !== null && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                            <p className="font-medium">
                                이 패키지는 거돌 대비{' '}
                                <span className={`font-bold ${efficiency >= 1 ? 'text-blue-600' : 'text-red-600'}`}>
                                    {efficiency.toFixed(2)}배
                                </span>
                                의 효율을 가집니다.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GordolCalculator; 