export class ElementIdPool {
    public maxId = 1e6;

    private _curId = 0;

    private _recycleIds: number[] = [];

    public generateId(): number {
        // 优先使用回收的id
        let id = this._recycleIds.pop();
        if (id) {
            return id;
        }

        id = ++this._curId;
        if (id > this.maxId) {
            throw Error('id larger than max id');
        }

        return id;
    }

    public recycleIds(...ids: number[]): void {
        this._recycleIds.push(...ids);
    }
}
