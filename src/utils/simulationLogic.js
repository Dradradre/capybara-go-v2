import { sGradeRotation, normalWeapons, normalArmors, normalNecklaces, normalRings } from '../data/itemData';

export const getRandomItem = (grade, rotation) => {
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
};

export const simulate = (gachaCount, currentEpicCount, currentSGradeCount, rotation) => {
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

        if (sGradeCount <= 0) {
            selectedGrade = 'S급 에픽';
            isPityS = true;
        } else if (epicCount <= 0) {
            selectedGrade = '에픽';
            isPityEpic = true;
        } else {
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

        if (isPityS) {
            sGradeCount = 60;
            epicCount = 10;
        } else if (isPityEpic) {
            epicCount = 10;
        }

        const item = getRandomItem(selectedGrade, rotation);

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

    const itemDetails = {};
    results.forEach(item => {
        const key = `${item.grade}|${item.name}`;
        if (!itemDetails[key]) {
            itemDetails[key] = { ...item, count: 0 };
        }
        itemDetails[key].count++;
    });

    return {
        countStats,
        itemDetails: Object.values(itemDetails),
        finalEpicCount: epicCount,
        finalSGradeCount: sGradeCount,
    };
}; 