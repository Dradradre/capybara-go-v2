import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GachaSimulator from './components/GachaSimulator';
import ProbabilityCalculator from './components/ProbabilityCalculator';
import { HomeIcon, CalculatorIcon } from './icons'; // 아이콘 컴포넌트 추가
import { NavLink } from 'react-router-dom';
import './App.css';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                {/* 상단 네비게이션 */}
                <nav className="sticky top-0 bg-white shadow-md">
                    <div className="max-w-lg mx-auto flex justify-between items-center px-4 py-2">
                        <div className="text-xl font-bold text-blue-600">🎲 화산 시뮬레이터</div>
                        <div className="flex space-x-4">
                            <CustomNavLink to="/" icon={<HomeIcon />}>
                                가챠 시뮬레이터
                            </CustomNavLink>
                            <CustomNavLink to="/calculator" icon={<CalculatorIcon />}>
                                확률 계산기
                            </CustomNavLink>
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
function CustomNavLink({ to, children, icon }) {
  return (
      <NavLink
          to={to}
          className={({ isActive }) =>
              `flex items-center space-x-2 px-3 py-2 rounded-lg 
              ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} 
              transition-all duration-200`
          }
      >
          {icon}
          <span>{children}</span>
      </NavLink>
  );
}

export default App;
