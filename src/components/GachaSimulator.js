import React, { useState } from 'react';
import { simulate } from '../utils/simulationLogic';
import ResultTable from './ResultTable';

const GachaSimulator = () => {
    const [inputs, setInputs] = useState({
        gachaCount: '',
        epicCount: '',
        sGradeCount: '',
        rotation: 'A'
    });
    const [result, setResult] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateInputs = () => {
        const epicCount = parseInt(inputs.epicCount);
        const sGradeCount = parseInt(inputs.sGradeCount);

        if (epicCount < 1 || epicCount > 10) {
            alert('에픽 카운트는 1에서 10 사이의 값이어야 합니다.');
            return false;
        }

        if (sGradeCount < 1 || sGradeCount > 60) {
            alert('S급 카운트는 1에서 60 사이의 값이어야 합니다.');
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        if (!validateInputs()) return;

        const result = simulate(
            parseInt(inputs.gachaCount) || 0,
            parseInt(inputs.epicCount) || 0,
            parseInt(inputs.sGradeCount) || 0,
            inputs.rotation
        );
        setResult(result);
    };

    return (
        <div>
            <div className="header">
                <h1>카피바라 Go 뽑기 시뮬레이터</h1>
                <p>제작: 351서버 페이커</p>
            </div>
            
            <div className="description-box">
                <h3>시뮬레이터 설명</h3>
                <ul>
                    <li>
                        <span className="highlight">등급별 확률</span>
                        <ul>
                            <li><span className="grade-S">S급 에픽</span>: 1.6%</li>
                            <li><span className="grade-에픽">에픽</span>: 10%</li>
                            <li><span className="grade-희귀">희귀</span>: 10%</li>
                            <li><span className="grade-우수">우수</span>: 25%</li>
                            <li><span className="grade-일반">일반</span>: 53.4%</li>
                        </ul>
                    </li>
                    <li>
                        <span className="highlight">보장 시스템</span>
                        <ul>
                            <li>에픽 카운트(1~10): n회 내 에픽 장비 1개 확정</li>
                            <li>S급 카운트(1~60): n회 내 S급 에픽 장비 1개 확정</li>
                        </ul>
                    </li>
                    <li>
                        <span className="highlight">로테이션 설명</span>
                        <ul>
                            <li>열공검 로테이션: 열공의 검 등 출현</li>
                            <li>천활 로테이션: 천사의 활 등 출현</li>
                            <li>죽지 로테이션: 죽음의 지팡이 등 출현</li>
                            <li>윈토 로테이션: 윈드토커 등 출현</li>
                        </ul>
                    </li>
                </ul>
            </div>

            <div className="input-container">
                <div className="input-wrapper">
                    <input
                        type="number"
                        name="gachaCount"
                        value={inputs.gachaCount}
                        onChange={handleInputChange}
                        placeholder="뽑기 횟수"
                        min="1"
                    />
                </div>
                <div className="input-wrapper">
                    <input
                        type="number"
                        name="epicCount"
                        value={inputs.epicCount}
                        onChange={handleInputChange}
                        placeholder="에픽 카운트 (1~10)"
                        min="1"
                        max="10"
                        title="n회 내에 에픽 장비 획득의 n을 입력해주세요"
                    />
                    <div className="input-helper">n회 내에 에픽 장비 획득의 n을 입력해주세요 (1~10)</div>
                </div>
                <div className="input-wrapper">
                    <input
                        type="number"
                        name="sGradeCount"
                        value={inputs.sGradeCount}
                        onChange={handleInputChange}
                        placeholder="S급 카운트 (1~60)"
                        min="1"
                        max="60"
                        title="n회 내의 S급 에픽 장비 획득의 n을 입력해주세요"
                    />
                    <div className="input-helper">n회 내의 S급 에픽 장비 획득의 n을 입력해주세요 (1~60)</div>
                </div>
                <select
                    name="rotation"
                    value={inputs.rotation}
                    onChange={handleInputChange}
                >
                    <option value="A">열공검 로테이션</option>
                    <option value="B">천활 로테이션</option>
                    <option value="C">죽지 로테이션</option>
                    <option value="D">윈토 로테이션</option>
                </select>
                <button onClick={handleSubmit}>실행하기</button>
            </div>
            {result && <ResultTable result={result} />}
        </div>
    );
};

export default GachaSimulator; 