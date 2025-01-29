// ProbabilityCalculator.js
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
import { Bar } from 'react-chartjs-2';
import { sGradeRotation, itemTypes } from '../data/itemData';

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
        gachaCount: '',
        epicCount: '',
        sGradeCount: '',
        rotation: 'A'
    });
    
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const workerRef = useRef();

    useEffect(() => {
        workerRef.current = new Worker(new URL('./simulationWorker.js', import.meta.url));
        workerRef.current.onmessage = (e) => {
            if (e.data.type === 'progress') {
                setProgress(e.data.progress);
            } else {
                const processedData = {
                    ...e.data,
                    itemStats: e.data.itemStats.map(item => ({
                        ...item,
                        grade: item.grade || '일반',  // 등급이 없는 경우 기본값 설정
                        name: item.name || '알 수 없음',  // 이름이 없는 경우 기본값 설정
                        type: item.type || '기타'  // 타입이 없는 경우 기본값 설정
                    }))
                };
                setResults(processedData);
                setIsLoading(false);
                setProgress(0);
            }
        };

        return () => workerRef.current.terminate();
    }, []);

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
        return true;
    };

    const calculateAllProbabilities = () => {
        if (!validateInputs()) return;
        
        setIsLoading(true);
        
        const simulationParams = {
            pulls: parseInt(inputs.gachaCount),
            epicPity: parseInt(inputs.epicCount),
            sGradePity: parseInt(inputs.sGradeCount),
            rotation: inputs.rotation
        };

        workerRef.current.postMessage({ simulationParams });
    };

    const gradeColors = {
        sGrade: 'rgb(255, 215, 0)',
        epic: 'rgb(148, 0, 211)',
        rare: 'rgb(0, 0, 255)',
        uncommon: 'rgb(0, 128, 0)',
        common: 'rgb(128, 128, 128)'
    };

    const gradeNames = {
        sGrade: 'S급 에픽',
        epic: '에픽',
        rare: '희귀',
        uncommon: '우수',
        common: '일반'
    };

    return (
        <div className="calculator-container p-4">
            <div className="input-section space-y-4 bg-white p-6 rounded-lg shadow mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="input-field">
                        <label className="block text-sm font-medium text-gray-700">뽑기 횟수</label>
                        <input
                            type="number"
                            value={inputs.gachaCount}
                            onChange={(e) => setInputs(prev => ({ ...prev, gachaCount: e.target.value }))}
                            placeholder="뽑기 횟수 입력"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            min="1"
                        />
                    </div>

                    <div className="input-field">
                        <label className="block text-sm font-medium text-gray-700">에픽 카운터</label>
                        <input
                            type="number"
                            value={inputs.epicCount}
                            onChange={(e) => setInputs(prev => ({ ...prev, epicCount: e.target.value }))}
                            placeholder="1-10"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            min="1"
                            max="10"
                        />
                    </div>

                    <div className="input-field">
                        <label className="block text-sm font-medium text-gray-700">S급 카운터</label>
                        <input
                            type="number"
                            value={inputs.sGradeCount}
                            onChange={(e) => setInputs(prev => ({ ...prev, sGradeCount: e.target.value }))}
                            placeholder="1-60"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            min="1"
                            max="60"
                        />
                    </div>

                    <div className="input-field">
                        <label className="block text-sm font-medium text-gray-700">로테이션</label>
                        <select
                            value={inputs.rotation}
                            onChange={(e) => setInputs(prev => ({ ...prev, rotation: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="A">열공검 로테이션</option>
                            <option value="B">천활 로테이션</option>
                            <option value="C">죽지 로테이션</option>
                            <option value="D">윈토 로테이션</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-center mt-4">
                    <button
                        onClick={calculateAllProbabilities}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        계산하기
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow p-8">
                    <div className="w-full max-w-md">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">시뮬레이션 진행중...</span>
                            <span className="text-sm font-medium text-indigo-600">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="mt-4 text-center text-sm text-gray-500">
                            {progress < 100 ? (
                                <>
                                    <p>총 10,000회 시뮬레이션 중 {Math.floor(progress * 100)}회 완료</p>
                                    <p className="mt-2">잠시만 기다려주세요...</p>
                                </>
                            ) : (
                                <p>결과 처리중...</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : results && (
                <div className="results-section space-y-8">
                    {/* 아이템별 획득 기댓값 테이블 */}
                    {results.itemStats && results.itemStats.length > 0 && (
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-4">
                                <h3 className="text-lg font-medium mb-4">아이템별 획득 기댓값</h3>
                                <div className="overflow-x-auto">
                                    <div className="grid grid-cols-1 gap-4">
                                        {results.itemStats.map((item, index) => (
                                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex flex-col space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium">{item?.name || '알 수 없음'}</span>
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getGradeStyle(item?.grade || '일반')}`}>
                                                            {item?.grade || '일반'}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        <div className="flex justify-between">
                                                            <span>유형:</span>
                                                            <span>{item?.type || '기타'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>기댓값:</span>
                                                            <span className="font-medium">
                                                                {(item?.mean || 0).toFixed(2)} ± {((item?.confidence95?.upper - item?.confidence95?.lower) / 3.92).toFixed(2)}개
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>95% 신뢰구간:</span>
                                                            <span>
                                                                {(item?.confidence95?.lower || 0).toFixed(2)} ~ {(item?.confidence95?.upper || 0).toFixed(2)}개
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 등급별 획득 분포 차트 */}
                    <div className="grid grid-cols-1 gap-8">
                        {Object.entries(results)
                            .filter(([key]) => key !== 'itemStats' && results[key]?.chartData)
                            .map(([grade, stats]) => (
                                <div key={grade} className="bg-white p-4 rounded-lg shadow">
                                    <h3 className="text-lg font-medium mb-4">{gradeNames[grade]} 획득 분포</h3>
                                    <div className="aspect-w-16 aspect-h-9">
                                        <Bar
                                            data={stats.chartData}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: true,
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        title: {
                                                            display: true,
                                                            text: '횟수'
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
                                                        text: `${gradeNames[grade]} 획득 분포`
                                                    },
                                                    legend: {
                                                        display: true
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="mt-4 text-sm space-y-1">
                                        <p className="flex justify-between">
                                            <span>평균:</span>
                                            <span>{stats?.mean?.toFixed(2) || '0.00'}개</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span>95% 신뢰구간:</span>
                                            <span>
                                                {stats?.confidence95?.lower?.toFixed(2) || '0.00'} ~ {stats?.confidence95?.upper?.toFixed(2) || '0.00'}개
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// 등급별 스타일 헬퍼 함수
const getGradeStyle = (grade) => {
    switch (grade) {
        case 'S급 에픽':
            return 'bg-yellow-100 text-yellow-800';
        case '에픽':
            return 'bg-purple-100 text-purple-800';
        case '희귀':
            return 'bg-blue-100 text-blue-800';
        case '우수':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default ProbabilityCalculator;
