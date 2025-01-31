import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import GachaSimulator from './components/GachaSimulator';
// import ProbabilityCalculator from './components/ProbabilityCalculator';
import ProbCaculatorTest from './components/ProbCaculatorTest';
import CurrencyCalculator from './components/CurrencyCalculator';
import { CalculatorIcon, CurrencyIcon } from './icons'; // CurrencyIcon 추가 필요
import { NavLink } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import { FaDice } from 'react-icons/fa';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                {/* 상단 네비게이션 */}
                <nav className="sticky top-0 bg-white shadow-md">
                    <div className="max-w-lg mx-auto flex flex-col sm:flex-row justify-between items-center px-4 py-2">
                        <Link to="/home" className="text-xl font-bold text-blue-600 mb-2 sm:mb-0 hover:text-blue-800 transition-colors">
                            🎲 화산 유틸리티
                        </Link>
                        <div className="flex w-full sm:w-auto justify-center space-x-2 sm:space-x-4">
                            <CustomNavLink to="/simulator" icon={<FaDice />}>
                                <span className="hidden sm:inline">가챠 시뮬레이터</span>
                                <span className="sm:hidden">시뮬레이터</span>
                            </CustomNavLink>
                            <CustomNavLink to="/calculator" icon={<CalculatorIcon />}>
                                <span className="hidden sm:inline">기댓값 계산기</span>
                                <span className="sm:hidden">계산기</span>
                            </CustomNavLink>
                            <CustomNavLink to="/currency" icon={<CurrencyIcon />}>
                                <span className="hidden sm:inline">재화 계산기</span>
                                <span className="sm:hidden">재화</span>
                            </CustomNavLink>
                        </div>
                    </div>
                </nav>

                {/* 메인 컨텐츠 */}
                <main className="max-w-lg mx-auto p-2 sm:p-4">
                    {/* <div className="card mb-4 p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-blue-500">ℹ️</span>
                            <h2 className="font-medium text-sm sm:text-base">도움말</h2>
                        </div>
                        <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                            <li>• 가챠 시뮬레이터: 실제 뽑기와 동일한 환경에서 시뮬레이션</li>
                            <li>• 기댓값 계산기: 특정 조건 뽑기의 10,000번 시뮬레이션을 통한 기댓값 확인</li>
                        </ul>
                    </div> */}

                    <div className="card p-2 sm:p-4">
                        <Routes>
                            <Route path="/" element={<Navigate to="/home" replace />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/simulator" element={<GachaSimulator />} />
                            <Route path="/calculator" element={<ProbCaculatorTest />} />
                            <Route path="/currency" element={<CurrencyCalculator />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </Router>
    );
}

// CustomNavLink 컴포넌트 수정
function CustomNavLink({ to, children, icon }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg text-sm sm:text-base
                ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} 
                transition-all duration-200 flex-1 sm:flex-auto`
            }
        >
            {icon}
            <span>{children}</span>
        </NavLink>
    );
}

export default App;
