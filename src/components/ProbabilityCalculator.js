import React, { useState, useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    LineController,
    Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { sGradeRotation } from '../data/itemData';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    LineController,
    Title,
    Tooltip,
    Legend
);

const ProbabilityCalculator = () => {
    const [inputs, setInputs] = useState({
        gachaCount: '',    // 총 뽑기 횟수
        epicCount: '10',   // 현재 에픽 카운터
        sGradeCount: '60', // 현재 S급 카운터
        rotation: 'A',     // 로테이션
        targetItem: '',   // 목표 장비
        targetGrade: ''   // 목표 등급
    });
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const runSingleSimulation = () => {
        let obtained = 0;
        let epicPity = parseInt(inputs.epicCount);
        let sGradePity = parseInt(inputs.sGradeCount);
        const pulls = parseInt(inputs.gachaCount);
        const targetItem = sGradeRotation[inputs.rotation].find(i => i.name === inputs.targetItem);
        
        // 전체 S급 에픽 가중치 합 계산
        const totalSGradeWeight = sGradeRotation[inputs.rotation].reduce((sum, item) => sum + item.rate, 0);
        
        for (let i = 0; i < pulls; i++) {
            // S급 천장
            if (sGradePity <= 0) {
                // 천장에서는 전체 S급 중 특정 아이템이 나올 확률
                if (Math.random() < (targetItem.rate / totalSGradeWeight)) obtained++;
                sGradePity = 60;
                epicPity = 10;
                continue;
            }
            
            // 에픽 천장
            if (epicPity <= 0) {
                // 에픽 천장에서 S급이 나올 확률 (1.6%)에서 특정 S급이 나올 확률
                if (Math.random() < (0.016 * targetItem.rate / totalSGradeWeight)) obtained++;
                epicPity = 10;
                continue;
            }

            // 일반 확률
            const random = Math.random();
            if (random < 0.016) { // S급 에픽이 나올 경우
                // 해당 S급 에픽이 나올 확률
                if (Math.random() < (targetItem.rate / totalSGradeWeight)) obtained++;
                sGradePity = 60;
                epicPity = 10;
            }

            sGradePity--;
            epicPity--;
        }

        return obtained;
    };

    const validateInputs = () => {
        if (!inputs.gachaCount || inputs.gachaCount <= 0) {
            alert('뽑기 횟수를 입력해주세요.');
            return false;
        }
        if (!inputs.epicCount || inputs.epicCount < 1 || inputs.epicCount > 10) {
            alert('에픽 카운트는 1에서 10 사이의 값이어야 합니다.');
            return false;
        }
        if (!inputs.sGradeCount || inputs.sGradeCount < 1 || inputs.sGradeCount > 60) {
            alert('S급 카운트는 1에서 60 사이의 값이어야 합니다.');
            return false;
        }
        if (!inputs.rotation) {
            alert('로테이션을 선택해주세요.');
            return false;
        }
        if (!inputs.targetItem) {
            alert('목표 장비를 선택해주세요.');
            return false;
        }
        return true;
    };

    const calculateDistribution = () => {
        if (!validateInputs()) return;
        const SIMULATION_COUNT = 10000;
        const results = [];
        
        // 몬테카를로 시뮬레이션
        for (let i = 0; i < SIMULATION_COUNT; i++) {
            results.push(runSingleSimulation());
        }

        // 평균과 표준편차 계산
        const mean = results.reduce((a, b) => a + b, 0) / SIMULATION_COUNT;
        const variance = results.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / SIMULATION_COUNT;
        const stdDev = Math.sqrt(variance);

        // 히스토그램 데이터 생성
        const histogram = results.reduce((acc, val) => {
            const key = val;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        // 정규분포 근사 데이터 생성
        const normalPoints = [];
        const minX = Math.max(0, Math.floor(mean - 4 * stdDev));
        const maxX = Math.ceil(mean + 4 * stdDev);
        
        for (let x = minX; x <= maxX; x++) {
            const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
                     Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)) *
                     SIMULATION_COUNT; // 히스토그램과 스케일 맞추기
            normalPoints.push({ x, y });
        }

        setResult({
            mean: mean.toFixed(2),
            stdDev: stdDev.toFixed(2),
            confidence95: {
                lower: Math.max(0, mean - 1.96 * stdDev).toFixed(2),
                upper: (mean + 1.96 * stdDev).toFixed(2)
            },
            confidence99: {
                lower: Math.max(0, mean - 2.576 * stdDev).toFixed(2),
                upper: (mean + 2.576 * stdDev).toFixed(2)
            },
            chartData: {
                labels: Object.keys(histogram),
                datasets: [
                    {
                        label: '실제 분포',
                        data: Object.values(histogram),
                        type: 'bar',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: '정규분포 근사',
                        data: normalPoints.map(p => p.y),
                        borderColor: 'rgb(54, 162, 235)',
                        borderWidth: 2,
                        fill: false,
                        type: 'line'
                    }
                ]
            }
        });
    };

    const handleGradeChange = (e) => {
        setInputs(prev => ({ ...prev, targetGrade: e.target.value }));
    };

    // 차트 컴포넌트를 useRef로 관리
    const chartRef = useRef(null);

    useEffect(() => {
        // 이전 차트 정리
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    return (
        <div className="calculator-container">
            <div className="input-group">
                <div className="input-field">
                    <label className="input-label">
                        장비 등급
                        <select value={inputs.targetGrade} onChange={handleGradeChange}>
                            <option value="">등급 선택</option>
                            <option value="S급 에픽">S급 에픽</option>
                            {/* ... 다른 옵션들 ... */}
                        </select>
                        <span className="input-hint">원하는 장비의 등급을 선택하세요</span>
                    </label>
                </div>
                <div className="input-wrapper">
                    <input
                        type="number"
                        value={inputs.gachaCount}
                        onChange={(e) => setInputs(prev => ({ ...prev, gachaCount: e.target.value }))}
                        placeholder="뽑기 횟수"
                        min="1"
                    />
                </div>

                <div className="input-wrapper">
                    <input
                        type="number"
                        value={inputs.epicCount}
                        onChange={(e) => setInputs(prev => ({ ...prev, epicCount: e.target.value }))}
                        placeholder="현재 에픽 카운트 (1~10)"
                        min="1"
                        max="10"
                    />
                    <div className="input-helper">n회 내에 에픽 장비 획득의 n을 입력해주세요 (1~10)</div>
                </div>

                <div className="input-wrapper">
                    <input
                        type="number"
                        value={inputs.sGradeCount}
                        onChange={(e) => setInputs(prev => ({ ...prev, sGradeCount: e.target.value }))}
                        placeholder="현재 S급 카운트 (1~60)"
                        min="1"
                        max="60"
                    />
                    <div className="input-helper">n회 내의 S급 에픽 장비 획득의 n을 입력해주세요 (1~60)</div>
                </div>

                <div className="input-wrapper">
                    <select
                        value={inputs.rotation}
                        onChange={(e) => setInputs(prev => ({ ...prev, rotation: e.target.value, targetItem: '' }))}
                    >
                        <option value="">로테이션 선택</option>
                        <option value="A">열공검 로테이션</option>
                        <option value="B">천활 로테이션</option>
                        <option value="C">죽지 로테이션</option>
                        <option value="D">윈토 로테이션</option>
                    </select>
                    <div className="input-helper">원하는 장비가 포함된 로테이션을 선택해주세요</div>
                </div>

                <div className="input-wrapper">
                    <select
                        value={inputs.targetItem}
                        onChange={(e) => setInputs(prev => ({ ...prev, targetItem: e.target.value }))}
                    >
                        <option value="">장비 선택</option>
                        {inputs.rotation && sGradeRotation[inputs.rotation].map(item => (
                            <option key={item.name} value={item.name}>{item.name}</option>
                        ))}
                    </select>
                    <div className="input-helper">획득을 원하는 S급 에픽 장비를 선택해주세요</div>
                </div>

                <button onClick={calculateDistribution}>계산하기</button>
            </div>

            <div className="result-section">
                {isLoading ? (
                    <div className="loading-spinner">계산 중...</div>
                ) : result && (
                    <div className="space-y-6 mt-6">
                        <div className="grid grid-cols-2 gap-4">
                            {/* 기댓값 카드 */}
                            <div className="bg-blue-50 p-4 rounded-2xl">
                                <div className="text-blue-600 mb-1">기댓값</div>
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-bold text-blue-900">
                                        {!isNaN(result.mean) ? Number(result.mean).toFixed(2) : '0.00'}
                                    </span>
                                    <span className="text-blue-600 ml-1">개</span>
                                </div>
                            </div>

                            {/* 표준편차 카드 */}
                            <div className="bg-purple-50 p-4 rounded-2xl">
                                <div className="text-purple-600 mb-1">표준편차</div>
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-bold text-purple-900">
                                        ±{!isNaN(result.stdDev) ? Number(result.stdDev).toFixed(2) : '0.00'}
                                    </span>
                                    <span className="text-purple-600 ml-1">개</span>
                                </div>
                            </div>

                            {/* 95% 신뢰구간 카드 */}
                            <div className="bg-green-50 p-4 rounded-2xl">
                                <div className="text-green-600 mb-1">95% 신뢰구간</div>
                                <div className="flex items-baseline">
                                    <span className="text-2xl font-bold text-green-900">
                                        {!isNaN(result.confidence95.lower) ? Number(result.confidence95.lower).toFixed(2) : '0.00'} 
                                        {' ~ '} 
                                        {!isNaN(result.confidence95.upper) ? Number(result.confidence95.upper).toFixed(2) : '0.00'}
                                    </span>
                                    <span className="text-green-600 ml-1">개</span>
                                </div>
                            </div>

                            {/* 99% 신뢰구간 카드 */}
                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <div className="text-gray-600 mb-1">99% 신뢰구간</div>
                                <div className="flex items-baseline">
                                    <span className="text-2xl font-bold text-gray-900">
                                        {!isNaN(result.confidence99.lower) ? Number(result.confidence99.lower).toFixed(2) : '0.00'} 
                                        {' ~ '} 
                                        {!isNaN(result.confidence99.upper) ? Number(result.confidence99.upper).toFixed(2) : '0.00'}
                                    </span>
                                    <span className="text-gray-600 ml-1">개</span>
                                </div>
                            </div>
                        </div>

                        {/* 차트 */}
                        <div className="mt-8">
                            <h3 className="text-lg font-medium mb-4">획득 개수 분포</h3>
                            <Bar 
                                ref={chartRef}
                                data={result.chartData}
                                options={{
                                    responsive: true,
                                    scales: {
                                        y: { 
                                            beginAtZero: true,
                                            title: {
                                                display: true,
                                                text: '빈도'
                                            }
                                        },
                                        x: { 
                                            title: { 
                                                display: true,
                                                text: '획득 개수'
                                            }
                                        }
                                    },
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: '획득 개수 분포'
                                        },
                                        legend: {
                                            display: false
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProbabilityCalculator; 