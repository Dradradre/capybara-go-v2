// ProbabilityCalculator.js
import React, { useState, useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// 필요한 컴포넌트만 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
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

    // 검색 및 필터링을 위한 상태 추가
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [selectedType, setSelectedType] = useState('all');

    useEffect(() => {
        workerRef.current = new Worker(new URL('./simulationWorker.js', import.meta.url));
        workerRef.current.onmessage = (e) => {
            if (e.data.type === 'progress') {
                setProgress(Math.floor(e.data.progress));  // 소수점 제거
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
            alert('S급 카운터는 1에서 60 사이의 값이어야 합니다.');
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
        'S급 에픽': 'text-red-500',
        '에픽': 'text-orange-400',
        '희귀': 'text-blue-500',
        '우수': 'text-green-500',
        '일반': 'text-gray-500'
    };

    const gradeNames = {
        sGrade: 'S급 에픽',
        epic: '에픽',
        rare: '희귀',
        uncommon: '우수',
        common: '일반'
    };

    // 필터링된 아이템 목록을 계산하는 함수
    const getFilteredItems = () => {
        if (!results?.itemStats) return [];
        
        return results.itemStats.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesGrade = selectedGrade === 'all' || item.grade === selectedGrade;
            const matchesType = selectedType === 'all' || item.type === selectedType;
            
            return matchesSearch && matchesGrade && matchesType;
        });
    };

    // 아이템 타입 목록 생성
    const itemTypes = [...new Set(results?.itemStats?.map(item => item.type) || [])];

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

            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-content">
                        <div className="spinner"></div>
                        <div className="progress-text">
                            {Math.round(progress)}% 완료
                        </div>
                    </div>
                </div>
            )}

            {results && (
                <div className="results-section space-y-8">
                    {/* 등급별 획득 요약 테이블 추가 */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4">
                            <h3 className="text-lg font-medium mb-4">등급별 평균 획득량 요약</h3>
                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">등급</th>
                                            <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">수량</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {Object.entries(results)
                                            .filter(([key]) => key !== 'itemStats' && results[key]?.mean)
                                            .map(([grade, stats]) => (
                                                <tr key={grade}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`${gradeColors[gradeNames[grade]]} font-medium`}>
                                                            {gradeNames[grade]}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        {Math.round(stats.mean)}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* 아이템별 획득 기댓값 테이블 */}
                    {results.itemStats && results.itemStats.length > 0 && (
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-4">
                                <h3 className="text-lg font-medium mb-4">아이템별 획득 기댓값</h3>
                                
                                {/* 검색 및 필터 섹션 */}
                                <div className="mb-4 space-y-3">
                                    {/* 검색창 */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="아이템 이름 검색..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                    
                                    {/* 필터 옵션 */}
                                    <div className="flex gap-2">
                                        <select
                                            value={selectedGrade}
                                            onChange={(e) => setSelectedGrade(e.target.value)}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="all">모든 등급</option>
                                            <option value="S급 에픽">S급 에픽</option>
                                            <option value="에픽">에픽</option>
                                            <option value="희귀">희귀</option>
                                            <option value="우수">우수</option>
                                            <option value="일반">일반</option>
                                        </select>
                                        
                                        <select
                                            value={selectedType}
                                            onChange={(e) => setSelectedType(e.target.value)}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="all">모든 유형</option>
                                            {itemTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* 필터링된 결과 표시 */}
                                <div className="overflow-x-auto">
                                    <div className="grid grid-cols-1 gap-4">
                                        {getFilteredItems().map((item, index) => (
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
                                        
                                        {/* 검색 결과가 없을 때 */}
                                        {getFilteredItems().length === 0 && (
                                            <div className="text-center py-4 text-gray-500">
                                                검색 결과가 없습니다.
                                            </div>
                                        )}
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
