export class User {
    constructor(
        public id: number,
        public unitname: string,
        public mtm: string,
        public recoveryName: string,
        public os: string,
        public mediaTypes: string,
        public location: string
    ) { }
}
