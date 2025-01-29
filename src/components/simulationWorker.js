/* eslint-disable no-restricted-globals */
// simulationWorker.js
import { sGradeRotation, normalWeapons, normalArmors, normalNecklaces, normalRings } from '../data/itemData';

// 아이템 선택 로직
function getRandomItem(grade, rotation) {
    if (grade === 'S급 에픽') {
        const items = sGradeRotation[rotation];
        const totalRate = items.reduce((sum, item) => sum + item.rate, 0);
        const random = Math.random() * totalRate;
        let sum = 0;
        for (const item of items) {
            sum += item.rate;
            if (random <= sum) {
                return { ...item, grade };
            }
        }
    } else {
        // 장비 타입별 가중치
        let weights;
        switch (grade) {
            case '에픽':
                weights = [2.5, 1.5, 3, 3]; // 무기, 갑옷, 목걸이, 반지
                break;
            case '희귀':
                weights = [2.5, 1.5, 3, 3];
                break;
            case '우수':
                weights = [6.25, 3.75, 7.5, 7.5];
                break;
            case '일반':
                weights = [13.4, 8.01, 16.02, 16.02];
                break;
            default:
                weights = [];
        }

        const totalWeight = weights.reduce((a, b) => a + b, 0);
        const random = Math.random() * totalWeight;
        let sum = 0;
        let typeIndex = 0;
        const types = ['무기', '갑옷', '목걸이', '반지'];
        
        for (let i = 0; i < weights.length; i++) {
            sum += weights[i];
            if (random <= sum) {
                typeIndex = i;
                break;
            }
        }

        const type = types[typeIndex];
        let pool;
        switch (type) {
            case '무기':
                pool = normalWeapons;
                break;
            case '갑옷':
                pool = normalArmors;
                break;
            case '목걸이':
                pool = normalNecklaces;
                break;
            case '반지':
                pool = normalRings;
                break;
        }
        const name = pool[Math.floor(Math.random() * pool.length)];
        return { name, type, grade };
    }
}

// 단일 시뮬레이션 실행
function runSingleSimulation(gachaCount, currentEpicCount, currentSGradeCount, rotation) {
    let epicCount = currentEpicCount;
    let sGradeCount = currentSGradeCount;
    const results = [];
    const countStats = { 'S급 에픽': 0, '에픽': 0, '희귀': 0, '우수': 0, '일반': 0 };

    for (let i = 0; i < gachaCount; i++) {
        sGradeCount--;
        epicCount--;

        let selectedGrade = null;
        let isPityS = false;
        let isPityEpic = false;

        // 천장 시스템 체크
        if (sGradeCount <= 0) {
            selectedGrade = 'S급 에픽';
            isPityS = true;
        } else if (epicCount <= 0) {
            selectedGrade = '에픽';
            isPityEpic = true;
        } else {
            // 일반 확률 뽑기
            const random = Math.random() * 100;
            if (random < 1.6) {
                selectedGrade = 'S급 에픽';
            } else if (random < 11.6) {
                selectedGrade = '에픽';
            } else if (random < 21.6) {
                selectedGrade = '희귀';
            } else if (random < 46.6) {
                selectedGrade = '우수';
            } else {
                selectedGrade = '일반';
            }
        }

        // 카운터 초기화
        if (isPityS) {
            sGradeCount = 60;
            epicCount = 10;
        } else if (isPityEpic) {
            epicCount = 10;
        }

        const item = getRandomItem(selectedGrade, rotation);

        // 일반 뽑기에서 나온 S급/에픽의 카운터 초기화
        if (!isPityS && !isPityEpic) {
            if (selectedGrade === 'S급 에픽') {
                sGradeCount = 60;
                epicCount = 10;
            } else if (selectedGrade === '에픽') {
                epicCount = 10;
            }
        }

        results.push(item);
        countStats[item.grade]++;
    }

    // 아이템별 상세 통계
    const itemDetails = {};
    results.forEach(item => {
        const key = `${item.grade}|${item.name}|${item.type}`;
        if (!itemDetails[key]) {
            itemDetails[key] = { ...item, count: 0 };
        }
        itemDetails[key].count++;
    });

    return {
        countStats,
        itemDetails: Object.values(itemDetails)
    };
}

// 신뢰구간 계산을 위한 유틸리티 함수
const calculateConfidenceInterval = (mean, stdDev, n, confidence = 0.95) => {
    const zValues = {
        0.90: 1.645,
        0.95: 1.96,
        0.99: 2.576
    };
    const z = zValues[confidence] || 1.96;
    const SE = stdDev / Math.sqrt(n);
    
    return {
        lower: Math.max(0, mean - z * SE),
        upper: mean + z * SE
    };
};

function calculateStats(results) {
    const n = results.length;
    const mean = results.reduce((a, b) => a + b, 0) / n;
    
    const variance = results.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    
    const confidence95 = calculateConfidenceInterval(mean, stdDev, n, 0.95);

    // 차트 데이터 생성 (정규분포 근사 사용)
    const counts = {};
    results.forEach(value => {
        counts[value] = (counts[value] || 0) + 1;
    });

    const chartData = {
        labels: Object.keys(counts),
        datasets: [{
            label: '획득 횟수',
            data: Object.values(counts).map(v => v / n), // 상대 빈도로 변환
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };

    return {
        mean,
        stdDev,
        confidence95,
        chartData
    };
}

// Worker 메시지 핸들러
self.onmessage = (e) => {
    const { simulationParams } = e.data;
    const SIMULATION_COUNT = 10000;
    
    const gradeResults = {
        sGrade: [],
        epic: [],
        rare: [],
        uncommon: [],
        common: []
    };
    
    const itemResults = new Map();

    // 진행 상태 보고 함수
    const reportProgress = (current) => {
        const progress = (current / SIMULATION_COUNT) * 100;
        self.postMessage({
            type: 'progress',
            progress: Math.min(progress, 99) // 100%는 최종 결과 처리 후에 표시
        });
    };

    // 몬테카를로 시뮬레이션 실행
    for (let i = 0; i < SIMULATION_COUNT; i++) {
        const simResult = runSingleSimulation(
            simulationParams.pulls,
            simulationParams.epicPity,
            simulationParams.sGradePity,
            simulationParams.rotation
        );

        // 등급별 결과 저장
        gradeResults.sGrade.push(simResult.countStats['S급 에픽']);
        gradeResults.epic.push(simResult.countStats['에픽']);
        gradeResults.rare.push(simResult.countStats['희귀']);
        gradeResults.uncommon.push(simResult.countStats['우수']);
        gradeResults.common.push(simResult.countStats['일반']);

        // 아이템별 결과 저장
        simResult.itemDetails.forEach(item => {
            const key = `${item.grade}|${item.name}|${item.type}`;
            if (!itemResults.has(key)) {
                itemResults.set(key, []);
            }
            itemResults.get(key).push(item.count);
        });

        // 매 1%마다 진행 상태 보고
        if (i % 100 === 0) {
            reportProgress(i);
        }
    }

    // 등급별 통계 계산
    const stats = {
        sGrade: calculateStats(gradeResults.sGrade),
        epic: calculateStats(gradeResults.epic),
        rare: calculateStats(gradeResults.rare),
        uncommon: calculateStats(gradeResults.uncommon),
        common: calculateStats(gradeResults.common)
    };

    // 아이템별 통계 계산
    const itemStats = Array.from(itemResults.entries()).map(([key, counts]) => {
        const [grade, name, type] = key.split('|');
        const mean = counts.reduce((a, b) => a + b, 0) / SIMULATION_COUNT;
        const variance = counts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / SIMULATION_COUNT;
        const stdDev = Math.sqrt(variance);

        return {
            grade,
            name,
            type,
            mean,
            stdDev,
            confidence95: {
                lower: Math.max(0, mean - 1.96 * stdDev),
                upper: mean + 1.96 * stdDev
            }
        };
    }).sort((a, b) => {
        const gradeOrder = { 'S급 에픽': 0, '에픽': 1, '희귀': 2, '우수': 3, '일반': 4 };
        const gradeCompare = gradeOrder[a.grade] - gradeOrder[b.grade];
        if (gradeCompare !== 0) return gradeCompare;
        return b.mean - a.mean;
    });

    self.postMessage({
        ...stats,
        itemStats
    });
};