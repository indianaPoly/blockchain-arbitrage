import Database from "better-sqlite3";

// single dex 아비트리지 데이터를 모두 가져옴.
export const fetchSingleArbitrageAllData = () => {
    const DATABASE = new Database("./db/data/single_arbitrage_data.db");
    const stmt = DATABASE.prepare(`SELECT * FROM single_arbitrage_data`);
    return stmt.all();
};

// dual dex 아비트리지 데이터를 모두 가져옴,
export const fetchDualArbitrageAllData = () => {
    const DATABASE = new Database("./db/data/dual_arbitrage_data.db");
    const stmt = DATABASE.prepare(`SELECT * FROM dual_arbitrage_data`);
    return stmt.all();
};
