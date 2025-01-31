export const CURRENCY_RATES = {
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
        image: '/HorseShoe.webp',
        hasDiscount: true
    },
    blueprint: { 
        name: '장비 도면', 
        gemValue: 300,  // 300보석/개
        image: '/equipment drawings.webp',
        hasDiscount: true
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
        image: '/EpicEquipment_weapon.webp',
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
        gemValue: 7450,
        image: '/ContractOfHero.webp'
    },
    sEquipmentWeapon: {
        name: 'S급 에픽 무기 (저격 기준)',
        gemValue: 73040,
        image: '/SEquipment_Weapon.webp'
    },
    sEquipmentArmor: {
        name: 'S급 에픽 방어구 (저격 기준)',
        gemValue: 73040,
        image: '/SEquipment_Armor.webp'
    },
    sEquipmentAccessory: {
        name: 'S급 에픽 장신구 (저격 기준)',
        gemValue: 36475,
        image: '/SEquipment_Accessory.webp'
    }
};

export const CURRENCY_CATEGORIES = {
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

export const CURRENCY_DESCRIPTIONS = {
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