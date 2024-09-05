import Database from "better-sqlite3";

// 싱글 덱스 아비트리지 데이터테이블의 모든 데이터를 삭제하는 함수
export const deleteSingleArbitrageAllData = () => {
    const DATABASE = new Database("./db/data/single_arbitrage_data.db");
    const stmt = DATABASE.prepare(`DELETE FROM single_arbitrage_data`);
    try {
        stmt.run();
    } catch (err) {
        throw err;
    }
};

// 듀얼 덱스 아비트지리 데이터테이블의 모든 데이터를 삭제하는 함수
export const deleteDualArbitrageAllData = () => {
    const DATABASE = new Database("./db/data/dual_arbitrage_data.db");
    const stmt = DATABASE.prepare(`DELETE FROM dual_arbitrage_data`);
    try {
        stmt.run();
    } catch (err) {
        throw err;
    }
};

// multi 아비트리지 데이터테이블의 모든 데이터를 삭제하는 함수
export const deleteMultiArbitrageAllData = () => {
    const DATABASE = new Database("./db/data/multi_arbitrage_data.db");
    const stmt = DATABASE.prepare(`DELETE FROM multi_arbitrage_data`);
    try {
        stmt.run();
    } catch (err) {
        throw err;
    }
};
