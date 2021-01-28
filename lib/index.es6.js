import { Component, createElement, Children } from 'react';
import { findDOMNode } from 'react-dom';
import { matchPath } from 'react-router';

var prefix = 'Invariant failed';
function invariant(condition, message) {
  if (condition) {
    return;
  }

  {
    throw new Error(prefix);
  }
}

/* tslint:disable:cyclomatic-complexity */

function debugLog(...message) {
}

function isEmptyChildren(children) {
  return Children.count(children) === 0;
}

var SideEffect;

(function (SideEffect) {
  SideEffect["SAVE_DOM_SCROLL"] = "SAVE_DOM_SCROLL";
  SideEffect["RESTORE_DOM_SCROLL"] = "RESTORE_DOM_SCROLL";
  SideEffect["CLEAR_DOM_SCROLL"] = "CLEAR_DOM_SCROLL";
  SideEffect["RESET_SCROLL"] = "RESET_SCROLL";
  SideEffect["HIDE_DOM"] = "HIDE_DOM";
  SideEffect["SHOW_DOM"] = "SHOW_DOM";
  SideEffect["CLEAR_DOM_DATA"] = "CLEAR_DOM_DATA";
  SideEffect["ON_REAPPEAR_HOOK"] = "ON_REAPPEAR_HOOK";
  SideEffect["ON_HIDE_HOOK"] = "ON_HIDE_HOOK";
  SideEffect["NO_SIDE_EFFECT"] = "NO_SIDE_EFFECT";
})(SideEffect || (SideEffect = {}));

var LiveState;

(function (LiveState) {
  LiveState["NORMAL_RENDER_ON_INIT"] = "normal render (matched or unmatched)";
  LiveState["NORMAL_RENDER_MATCHED"] = "normal matched render";
  LiveState["HIDE_RENDER"] = "hide route when livePath matched";
  LiveState["NORMAL_RENDER_UNMATCHED"] = "normal unmatched render (unmount)";
})(LiveState || (LiveState = {}));

class LiveRoute extends Component {
  constructor() {
    super(...arguments);
    this.routeDom = null;
    this.scrollPosBackup = null;
    this.previousDisplayStyle = null;
    this.liveState = LiveState.NORMAL_RENDER_ON_INIT;
    this.currentSideEffect = [SideEffect.NO_SIDE_EFFECT];
    this.wrapperedRef = null; // get DOM of Route

    this.getRouteDom = () => {
      let routeDom = null;

      try {
        routeDom = findDOMNode(this);
      } catch (_a) {// TODO:
      }

      this.routeDom = routeDom || this.routeDom;
    };

    this.ensureDidMount = ref => {
      this.getRouteDom();
      this.wrapperedRef = ref;
    };

    this.performSideEffects = (sideEffects, range) => {
      debugLog(`${this.props.name} perform side effects:`, sideEffects, range);
      const sideEffectsToRun = sideEffects.filter(item => range.indexOf(item) >= 0);
      sideEffectsToRun.forEach((sideEffect, index) => {
        switch (sideEffect) {
          case SideEffect.SAVE_DOM_SCROLL:
            this.saveScrollPosition();
            break;

          case SideEffect.HIDE_DOM:
            this.hideRoute();
            break;

          case SideEffect.SHOW_DOM:
            this.showRoute();
            break;

          case SideEffect.RESTORE_DOM_SCROLL:
            this.restoreScrollPosition();
            break;

          case SideEffect.ON_REAPPEAR_HOOK:
            this.onHook('onReappear');
            break;

          case SideEffect.ON_HIDE_HOOK:
            this.onHook('onHide');
            break;

          case SideEffect.CLEAR_DOM_SCROLL:
            this.clearScroll();
            break;

          case SideEffect.RESET_SCROLL:
            this.resetScrollPosition();
            break;

          case SideEffect.CLEAR_DOM_DATA:
            this.clearScroll();
            this.clearDomData();
            break;
        }
      });
      this.currentSideEffect = sideEffects.filter(item => range.indexOf(item) < 0);
    };

    this.onHook = hookName => {
      const {
        exact = false,
        sensitive = false,
        strict = false,
        path,
        livePath,
        alwaysLive,
        // from withRouter, same as RouterContext.Consumer ⬇️
        history,
        location,
        match,
        staticContext // from withRouter, same as RouterContext.Consumer ⬆️

      } = this.props;
      const hook = this.props[hookName];
      const context = {
        history,
        location,
        match,
        staticContext
      };
      const matchOfPath = this.props.path ? matchPath(location.pathname, this.props) : context.match;
      const matchOfLivePath = this.isLivePathMatch(livePath, alwaysLive, location.pathname, {
        path,
        exact,
        strict,
        sensitive
      });
      const matchAnyway = matchOfPath || matchOfLivePath;

      if (this.wrapperedRef && hookName == 'onHide') {
        this.wrapperedRef.componentOnHide && this.wrapperedRef.componentOnHide(location, matchAnyway, history, livePath, alwaysLive);
      } else if (this.wrapperedRef && hookName == 'onReappear') {
        this.wrapperedRef.componentOnReappear && this.wrapperedRef.componentOnReappear(location, matchAnyway, history, livePath, alwaysLive);
      }

      if (typeof hook === 'function') {
        hook(location, matchAnyway, history, livePath, alwaysLive);
      }
    };
  }

  componentDidMount() {
    this.getRouteDom();
  }

  componentDidUpdate(prevProps, prevState) {
    this.performSideEffects(this.currentSideEffect, [SideEffect.ON_REAPPEAR_HOOK, SideEffect.CLEAR_DOM_DATA]);
    this.performSideEffects(this.currentSideEffect, [SideEffect.SHOW_DOM, SideEffect.RESTORE_DOM_SCROLL, SideEffect.CLEAR_DOM_SCROLL]);
    this.performSideEffects(this.currentSideEffect, [SideEffect.RESET_SCROLL]);
    this.getRouteDom();
  } // clear on unmounting


  componentWillUnmount() {
    this.clearDomData();
    this.clearScroll();
  }

  hideRoute() {
    if (this.routeDom && this.routeDom.style.display !== 'none') {
      this.previousDisplayStyle = this.routeDom.style.display;
      this.routeDom.style.display = 'none';
    }
  } // reveal DOM display


  showRoute() {
    if (this.routeDom && this.previousDisplayStyle !== null) {
      this.routeDom.style.display = this.previousDisplayStyle;
    }
  }

  doesRouteEnableLive() {
    return this.props.livePath || this.props.alwaysLive;
  } // save scroll position before hide DOM


  saveScrollPosition() {
    if (this.routeDom && this.scrollPosBackup === null) {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
      this.scrollPosBackup = {
        top: scrollTop,
        left: scrollLeft
      };
    }
  } // restore the scroll position before hide


  restoreScrollPosition() {
    const scroll = this.scrollPosBackup;

    if (scroll && this.routeDom) {
      window.scrollTo(scroll.left, scroll.top);
    }
  } // reset scroll position


  resetScrollPosition() {
    if (scroll && this.routeDom) {
      window.scrollTo(0, 0);
    }
  } // clear scroll position


  clearDomData() {
    if (this.doesRouteEnableLive()) {
      this.routeDom = null;
      this.previousDisplayStyle = null;
    }
  } // clear scroll position


  clearScroll() {
    if (this.doesRouteEnableLive()) {
      this.scrollPosBackup = null;
    }
  }

  isLivePathMatch(livePath, alwaysLive, pathname, options) {
    const pathArr = Array.isArray(livePath) ? livePath : [livePath];

    if (alwaysLive) {
      pathArr.push('*');
    }

    for (let currPath of pathArr) {
      if (typeof currPath !== 'string') {
        continue;
      }

      const currLiveOptions = Object.assign(Object.assign({}, options), {
        path: currPath
      });
      const currMatch = matchPath(pathname, currLiveOptions); // return if one of the livePaths is matched

      if (currMatch) {
        return currMatch;
      }
    } // not matched default fallback


    return null;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    this.performSideEffects(this.currentSideEffect, [SideEffect.ON_HIDE_HOOK, SideEffect.SAVE_DOM_SCROLL, SideEffect.HIDE_DOM]);
    return null;
  }

  render() {
    const {
      exact = false,
      sensitive = false,
      strict = false,
      forceUnmount,
      path,
      livePath,
      alwaysLive,
      component,
      render,
      // from withRouter, same as RouterContext.Consumer ⬇️
      history,
      location,
      match,
      staticContext // from withRouter, same as RouterContext.Consumer ⬆️

    } = this.props;
    let {
      children
    } = this.props;
    const context = {
      history,
      location,
      match,
      staticContext
    };
    !!!context ?  invariant(false) : void 0;
    const matchOfPath = this.props.path ? matchPath(location.pathname, this.props) : context.match;
    const matchOfLivePath = this.isLivePathMatch(livePath, alwaysLive, location.pathname, {
      path,
      exact,
      strict,
      sensitive
    });
    const matchAnyway = matchOfPath || matchOfLivePath; // no render

    if (!matchAnyway || matchAnyway && !matchOfPath && (this.liveState === LiveState.NORMAL_RENDER_ON_INIT || this.liveState === LiveState.NORMAL_RENDER_UNMATCHED)) {
      this.currentSideEffect = [SideEffect.CLEAR_DOM_SCROLL];
      this.liveState = LiveState.NORMAL_RENDER_UNMATCHED;
      return null;
    } // normal render || hide render


    if (matchOfPath) {
      this.currentSideEffect = [SideEffect.RESET_SCROLL]; // hide ➡️ show

      if (this.liveState === LiveState.HIDE_RENDER) {
        this.currentSideEffect = [SideEffect.SHOW_DOM, SideEffect.RESTORE_DOM_SCROLL, SideEffect.CLEAR_DOM_SCROLL, SideEffect.ON_REAPPEAR_HOOK];
      }

      this.liveState = LiveState.NORMAL_RENDER_MATCHED;
    } else {

      if (typeof forceUnmount === 'function' && forceUnmount(location, match, history, livePath, alwaysLive)) {
        this.liveState = LiveState.NORMAL_RENDER_UNMATCHED;
        this.currentSideEffect = [SideEffect.CLEAR_DOM_DATA];
        return null;
      } // show ➡️ hide


      if (this.liveState === LiveState.NORMAL_RENDER_MATCHED) {
        this.currentSideEffect = [SideEffect.ON_HIDE_HOOK, SideEffect.SAVE_DOM_SCROLL, SideEffect.HIDE_DOM];
      }

      this.liveState = LiveState.HIDE_RENDER;
    } // normal render


    const props = Object.assign(Object.assign({}, context), {
      location,
      match: matchOfPath,
      ensureDidMount: this.ensureDidMount
    }); // Preact uses an empty array as children by
    // default, so use null if that's the case.

    if (Array.isArray(children) && children.length === 0) {
      children = null;
    }

    if (typeof children === 'function') {
      children = children(props);

      if (children === undefined) {

        children = null;
      }
    }

    const componentInstance = component && createElement(component, props); // normal render from Route

    return children && !isEmptyChildren(children) ? children : matchAnyway ? component ? componentInstance : render ? render(props) : null : null;
  }

}

export default LiveRoute;
