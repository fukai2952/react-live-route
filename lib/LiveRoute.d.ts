import { History, Location } from 'history';
import * as React from 'react';
import { match, RouteComponentProps, RouteProps } from 'react-router';
declare type CacheDom = HTMLElement | null;
declare type LivePath = string | string[] | undefined;
interface IMatchOptions {
    path?: string | string[];
    exact?: boolean;
    strict?: boolean;
    sensitive?: boolean;
}
declare enum SideEffect {
    SAVE_DOM_SCROLL = "SAVE_DOM_SCROLL",
    RESTORE_DOM_SCROLL = "RESTORE_DOM_SCROLL",
    CLEAR_DOM_SCROLL = "CLEAR_DOM_SCROLL",
    RESET_SCROLL = "RESET_SCROLL",
    HIDE_DOM = "HIDE_DOM",
    SHOW_DOM = "SHOW_DOM",
    CLEAR_DOM_DATA = "CLEAR_DOM_DATA",
    ON_REAPPEAR_HOOK = "ON_REAPPEAR_HOOK",
    ON_HIDE_HOOK = "ON_HIDE_HOOK",
    NO_SIDE_EFFECT = "NO_SIDE_EFFECT"
}
declare enum LiveState {
    NORMAL_RENDER_ON_INIT = "normal render (matched or unmatched)",
    NORMAL_RENDER_MATCHED = "normal matched render",
    HIDE_RENDER = "hide route when livePath matched",
    NORMAL_RENDER_UNMATCHED = "normal unmatched render (unmount)"
}
declare type OnRoutingHook = (location: Location, match: match | null, history: History, livePath: LivePath, alwaysLive: boolean | undefined) => any;
interface IProps extends RouteProps {
    name?: string;
    livePath?: string | string[];
    alwaysLive?: boolean;
    onHide?: OnRoutingHook;
    onReappear?: OnRoutingHook;
    forceUnmount?: OnRoutingHook;
    computedMatch?: IMatchOptions;
}
/**
 * The public API for matching a single path and rendering.
 */
declare type PropsType = RouteComponentProps<any> & IProps;
declare class LiveRoute extends React.Component<PropsType, any> {
    routeDom: CacheDom;
    scrollPosBackup: {
        left: number;
        top: number;
    } | null;
    previousDisplayStyle: string | null;
    liveState: LiveState;
    currentSideEffect: SideEffect[];
    wrapperedRef: any;
    componentDidMount(): void;
    componentDidUpdate(prevProps: any, prevState: any): void;
    componentWillUnmount(): void;
    getRouteDom: () => void;
    ensureDidMount: (ref: any) => void;
    hideRoute(): void;
    showRoute(): void;
    doesRouteEnableLive(): string | boolean | string[] | undefined;
    saveScrollPosition(): void;
    restoreScrollPosition(): void;
    resetScrollPosition(): void;
    clearDomData(): void;
    clearScroll(): void;
    isLivePathMatch(livePath: LivePath, alwaysLive: boolean | undefined, pathname: string, options: IMatchOptions): match<{}> | null;
    performSideEffects: (sideEffects: SideEffect[], range: SideEffect[]) => void;
    getSnapshotBeforeUpdate(prevProps: any, prevState: any): null;
    onHook: (hookName: 'onHide' | 'onReappear') => void;
    render(): {} | null | undefined;
}
export default LiveRoute;
