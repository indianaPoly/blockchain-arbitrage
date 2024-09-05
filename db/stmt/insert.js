import Database from "better-sqlite3";

// 사이클링 아비트리지의 모니터링 데이터를 데이터 테이블에 저장하는 함수
export const insertSingleArbitrageData = (data) => {
    const {
        timestamp,
        network_name,
        dex_name,
        depth,
        path,
        start_token,
        input,
        output,
        profit,
        profit_status,
    } = data;

    const DATABASE = new Database("./db/data/single_arbitrage_data.db");

    const stmt = DATABASE.prepare(`
        INSERT OR REPLACE INTO single_arbitrage_data (
            timestamp, 
            network_name, 
            dex_name, 
            depth, 
            path, 
            start_token,
            input,
            output, 
            profit, 
            profit_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    try {
        stmt.run(
            timestamp,
            network_name,
            dex_name,
            depth,
            path,
            start_token,
            input,
            output,
            profit,
            profit_status
        );
        console.log("Data inserted successfully.");
    } catch (err) {
        console.error("Error inserting data:", err);
    }
};

// dual 아비트리지의 모니터링 데이터를 데이터 테이블에 저장하는 함수
export const insertDualArbitrageData = (data) => {
    const {
        timestamp,
        network_name,
        first_dex_name,
        second_dex_name,
        start_token,
        swap_token,
        input,
        output,
        profit,
        profit_status,
    } = data;

    const DATABASE = new Database("./db/data/dual_arbitrage_data.db");

    const stmt = DATABASE.prepare(`
        INSERT OR REPLACE INTO dual_arbitrage_data (
            timestamp,
            network_name,
            first_dex_name,
            second_dex_name,
            start_token,
            swap_token,
            input,
            output,
            profit,
            profit_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    try {
        stmt.run(
            timestamp,
            network_name,
            first_dex_name,
            second_dex_name,
            start_token,
            swap_token,
            input,
            output,
            profit,
            profit_status
        );
        console.log("Data inserted successfully");
    } catch (err) {
        console.error("Error inserting data: ", err);
    }
};

// Multi 아비트리지의 모니터링 데이터를 데이터 테이블에 저장하는 함수
export const insertMultiArbitrageData = (data) => {
    const {
        timestamp,
        network_name,
        first_dex_name,
        final_dax_name,
        path,
        start_token,
        input,
        output,
        profit,
        profit_status,
    } = data;

    const DATABASE = new Database("./db/data/multi_arbitrage_data.db");

    const stmt = DATABASE.prepare(`
        INSERT OR REPLACE INTO multi_arbitrage_data (
            timestamp,
            network_name,
            first_dex_name,
            final_dex_name,
            path,
            start_token,
            input,
            output,
            profit,
            profit_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    try {
        stmt.run(
            timestamp,
            network_name,
            first_dex_name,
            final_dax_name,
            path,
            start_token,
            input,
            output,
            profit,
            profit_status
        );
        console.log("Data inserted successfully");
    } catch (err) {
        console.error("Error inserting data: ", err);
    }
};
