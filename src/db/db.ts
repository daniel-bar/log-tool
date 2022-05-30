import Dexie, { Table } from 'dexie';

interface ILog {
	id?: number;
	timestamp?: string;
	log?: string;
}

class MySubClassedDexie extends Dexie {
	readonly logs!: Table<ILog>;

	constructor() {
		super('logsDataBase');
		this.version(1).stores({
			logs: 'timestamp, log',
		});
	}
}

const db = new MySubClassedDexie();

export default db;
