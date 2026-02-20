import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface FatigueEvent {
    id?: number;
    timestamp: number;
    durationSeconds: number;
    slouchCount: number;
    eyeFatigueCount: number;
}

interface FatigueDB extends DBSchema {
    sessions: {
        key: number;
        value: FatigueEvent;
        indexes: { 'by-date': number };
    };
}

const DB_NAME = 'fatigue-tracker-db';
const STORE_NAME = 'sessions';

let dbPromise: Promise<IDBPDatabase<FatigueDB>>;

function initDB() {
    if (!dbPromise) {
        dbPromise = openDB<FatigueDB>(DB_NAME, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true,
                    });
                    store.createIndex('by-date', 'timestamp');
                }
            },
        });
    }
    return dbPromise;
}

export async function addSession(session: Omit<FatigueEvent, 'id'>) {
    const db = await initDB();
    return db.add(STORE_NAME, session);
}

export async function getHistory(): Promise<FatigueEvent[]> {
    const db = await initDB();
    // Return descending order
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('by-date');
    const allEntries = await index.getAll();
    return allEntries.sort((a, b) => b.timestamp - a.timestamp);
}
