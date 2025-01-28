import React, { useState } from 'react';

const gradeOrder = {
    'S급 에픽': 1,
    '에픽': 2,
    '희귀': 3,
    '우수': 4,
    '일반': 5
};

const ResultTable = ({ result }) => {
    const [filters, setFilters] = useState({
        name: '',
        grade: '',
        type: ''
    });

    // 고유한 유형 목록 추출
    const uniqueTypes = [...new Set(result.itemDetails.map(item => item.type))];
    // 고유한 등급 목록 추출
    const uniqueGrades = [...new Set(result.itemDetails.map(item => item.grade))];

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredItems = result.itemDetails.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(filters.name.toLowerCase());
        const gradeMatch = !filters.grade || item.grade === filters.grade;
        const typeMatch = !filters.type || item.type === filters.type;
        return nameMatch && gradeMatch && typeMatch;
    });

    return (
        <div className="result-container">
            <div className="result-summary">
                <h3>결과 요약</h3>
                <p>
                    남은 에픽 카운트: {result.finalEpicCount}<br />
                    남은 S급 카운트: {result.finalSGradeCount}
                </p>
            </div>

            <h4>등급별 획득</h4>
            <table>
                <thead>
                    <tr>
                        <th>등급</th>
                        <th>수량</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(result.countStats)
                        .sort(([gradeA], [gradeB]) => gradeOrder[gradeA] - gradeOrder[gradeB])
                        .map(([grade, count]) => (
                            <tr key={grade}>
                                <td className={`grade-${grade === 'S급 에픽' ? 'S' : grade}`}>{grade}</td>
                                <td>{count}</td>
                            </tr>
                        ))}
                </tbody>
            </table>

            <h4>아이템별 획득</h4>
            <div className="filter-container">
                <input
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    placeholder="아이템 이름으로 검색"
                    className="filter-input"
                />
                <select
                    name="grade"
                    value={filters.grade}
                    onChange={handleFilterChange}
                    className="filter-select"
                >
                    <option value="">모든 등급</option>
                    {uniqueGrades
                        .sort((a, b) => gradeOrder[a] - gradeOrder[b])
                        .map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                        ))
                    }
                </select>
                <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="filter-select"
                >
                    <option value="">모든 유형</option>
                    {uniqueTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>등급</th>
                        <th>유형</th>
                        <th>수량</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredItems
                        .sort((a, b) => {
                            const gradeCompare = gradeOrder[a.grade] - gradeOrder[b.grade];
                            if (gradeCompare !== 0) return gradeCompare;
                            return b.count - a.count;
                        })
                        .map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td className={`grade-${item.grade === 'S급 에픽' ? 'S' : item.grade}`}>
                                    {item.grade}
                                </td>
                                <td>{item.type}</td>
                                <td>{item.count}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResultTable; 