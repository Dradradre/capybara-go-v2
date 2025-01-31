import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-blue-600">카피바라 Go 유틸리티 모음</h1>
                <p className="text-gray-600">카피바라 Go 플레이에 도움이 되는 유틸리티를 제공합니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/simulator" className="card p-6 hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-bold text-blue-600 mb-2">🎲 가챠 시뮬레이터</h2>
                    <p className="text-gray-600">실제 확률과 동일한 뽑기 시뮬레이션을 체험해보세요</p>
                </Link>

                <Link to="/calculator" className="card p-6 hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-bold text-blue-600 mb-2">📊 기댓값 계산기</h2>
                    <p className="text-gray-600">뽑기 기댓값을 계산하여 효율적인 결정을 내리세요</p>
                </Link>

                <Link to="/currency" className="card p-6 hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-bold text-blue-600 mb-2">💰 재화 계산기</h2>
                    <p className="text-gray-600">게임 재화를 효율적으로 관리하세요</p>
                </Link>

                <Link to="/package" className="card p-6 hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-bold text-blue-600 mb-2">📦 패키지 효율 계산기</h2>
                    <p className="text-gray-600">패키지 상품들의 효율을 '거침없이 돌격' 패키지와 비교하거나, 패키지 간 비교를 할 수 있습니다.</p>
                </Link>

                <div className="card p-6">
                    <h2 className="text-xl font-bold text-gray-400 mb-2">🔜 추가 기능</h2>
                    <p className="text-gray-400">더 많은 기능이 곧 추가될 예정입니다</p>
                </div>
            </div>

            <div className="text-center text-sm text-gray-500">
                <p>제작: 351서버 페이커</p>
                <p>{/*여기에 뭐 추가하징*/}</p>
            </div>
        </div>
    );
};

export default Home;
