import { Traveler } from "../models/traveler";
declare function index(): Promise<Traveler[]>;
declare function get(userid: string): Promise<Traveler>;
declare function update(userid: string, traveler: Traveler): Promise<Traveler>;
declare function create(traveler: Traveler): Promise<Traveler>;
declare function remove(userid: string): Promise<void>;
declare const _default: {
    index: typeof index;
    get: typeof get;
    create: typeof create;
    update: typeof update;
    remove: typeof remove;
};
export default _default;
