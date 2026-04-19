import { Destination, Tour } from "../models";
declare function index(userid?: string): Promise<Tour[]>;
declare function get(id: string): Promise<Tour>;
declare function create(profile: Tour): Promise<Tour>;
declare function update(id: string, tour: Tour): Promise<Tour>;
declare function getDestination(id: String, n: number): Promise<Destination>;
declare function updateDestination(id: String, n: number, newDest: Destination): Promise<Destination>;
declare const _default: {
    index: typeof index;
    get: typeof get;
    create: typeof create;
    update: typeof update;
    getDestination: typeof getDestination;
    updateDestination: typeof updateDestination;
};
export default _default;
