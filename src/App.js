import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GachaSimulator from './components/GachaSimulator';
import ProbabilityCalculator from './components/ProbabilityCalculator';
import './App.css';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                {/* 상단 네비게이션 */}
                <nav className="sticky top-0 bg-white border-b border-gray-200 backdrop-blur-lg bg-opacity-80">
                    <div className="max-w-lg mx-auto">
                        <div className="flex p-1 gap-1">
                            <NavLink to="/">가챠 시뮬레이터</NavLink>
                            <NavLink to="/calculator">확률 계산기</NavLink>
                        </div>
                    </div>
                </nav>

                {/* 메인 컨텐츠 */}
                <main className="max-w-lg mx-auto p-4">
                    <div className="card mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-blue-500">ℹ️</span>
                            <h2 className="font-medium">도움말</h2>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• 가챠 시뮬레이터: 실제 뽑기와 동일한 환경에서 시뮬레이션</li>
                            <li>• 확률 계산기: 특정 아이템의 획득 확률 분석, 현재는 S급 에픽만 제공</li>
                        </ul>
                    </div>

                    <div className="card">
                        <Routes>
                            <Route path="/" element={<GachaSimulator />} />
                            <Route path="/calculator" element={<ProbabilityCalculator />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </Router>
    );
}

// 커스텀 NavLink 컴포넌트
function NavLink({ to, children }) {
    return (
        <Link
            to={to}
            className={({ isActive }) => `
                relative flex-1 px-4 py-2.5 text-center transition-all duration-200
                ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'}
                before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full 
                before:h-0.5 before:bg-blue-600 before:transition-transform before:duration-200
                ${isActive ? 'before:scale-x-100' : 'before:scale-x-0 hover:before:scale-x-100'}
            `}
        >
            {children}
        </Link>
    );
}

export default App;
