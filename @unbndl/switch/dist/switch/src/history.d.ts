import { Context } from '@unbndl/html';
import { Provider, Service } from '@unbndl/service';
declare const HISTORY_CONTEXT_DEFAULT = "context:history";
interface HistoryModel {
    location: Location;
    state: object;
}
type HistoryMsg = [
    "history/navigate",
    {
        href: string;
        state?: object;
    }
] | [
    "history/redirect",
    {
        href: string;
        state?: object;
    }
];
declare class HistoryService extends Service<HistoryMsg, HistoryModel> {
    static EVENT_TYPE: string;
    constructor(context: Context<HistoryModel>);
    update(message: HistoryMsg, model: HistoryModel): HistoryModel;
}
declare class HistoryProvider extends Provider<HistoryModel> {
    constructor();
    get base(): any;
    connectedCallback(): void;
    attributeChangedCallback(): void;
}
declare const dispatch: any;
export { HISTORY_CONTEXT_DEFAULT as CONTEXT_DEFAULT, HistoryProvider as Provider, HistoryService as Service, type HistoryModel as Model, type HistoryMsg as Message, dispatch };
