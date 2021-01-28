'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var ReactDOM = require('react-dom');
var reactRouter = require('react-router');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

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

function debugLog() {
  var message = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    message[_i] = arguments[_i];
  }
}

function isEmptyChildren(children) {
  return React.Children.count(children) === 0;
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

var LiveRoute =
/*#__PURE__*/

/** @class */
function (_super) {
  __extends(LiveRoute, _super);

  function LiveRoute() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.routeDom = null;
    _this.scrollPosBackup = null;
    _this.previousDisplayStyle = null;
    _this.liveState = LiveState.NORMAL_RENDER_ON_INIT;
    _this.currentSideEffect = [SideEffect.NO_SIDE_EFFECT];
    _this.wrapperedRef = null; // get DOM of Route

    _this.getRouteDom = function () {
      var routeDom = null;

      try {
        routeDom = ReactDOM.findDOMNode(_this);
      } catch (_a) {// TODO:
      }

      _this.routeDom = routeDom || _this.routeDom;
    };

    _this.ensureDidMount = function (ref) {
      _this.getRouteDom();

      _this.wrapperedRef = ref;
    };

    _this.performSideEffects = function (sideEffects, range) {
      debugLog(_this.props.name + " perform side effects:", sideEffects, range);
      var sideEffectsToRun = sideEffects.filter(function (item) {
        return range.indexOf(item) >= 0;
      });
      sideEffectsToRun.forEach(function (sideEffect, index) {
        switch (sideEffect) {
          case SideEffect.SAVE_DOM_SCROLL:
            _this.saveScrollPosition();

            break;

          case SideEffect.HIDE_DOM:
            _this.hideRoute();

            break;

          case SideEffect.SHOW_DOM:
            _this.showRoute();

            break;

          case SideEffect.RESTORE_DOM_SCROLL:
            _this.restoreScrollPosition();

            break;

          case SideEffect.ON_REAPPEAR_HOOK:
            _this.onHook('onReappear');

            break;

          case SideEffect.ON_HIDE_HOOK:
            _this.onHook('onHide');

            break;

          case SideEffect.CLEAR_DOM_SCROLL:
            _this.clearScroll();

            break;

          case SideEffect.RESET_SCROLL:
            _this.resetScrollPosition();

            break;

          case SideEffect.CLEAR_DOM_DATA:
            _this.clearScroll();

            _this.clearDomData();

            break;
        }
      });
      _this.currentSideEffect = sideEffects.filter(function (item) {
        return range.indexOf(item) < 0;
      });
    };

    _this.onHook = function (hookName) {
      var _a = _this.props,
          _b = _a.exact,
          exact = _b === void 0 ? false : _b,
          _c = _a.sensitive,
          sensitive = _c === void 0 ? false : _c,
          _d = _a.strict,
          strict = _d === void 0 ? false : _d,
          path = _a.path,
          livePath = _a.livePath,
          alwaysLive = _a.alwaysLive,
          // from withRouter, same as RouterContext.Consumer ⬇️
      history = _a.history,
          location = _a.location,
          match = _a.match,
          staticContext = _a.staticContext // from withRouter, same as RouterContext.Consumer ⬆️
      ;
      var hook = _this.props[hookName];
      var context = {
        history: history,
        location: location,
        match: match,
        staticContext: staticContext
      };
      var matchOfPath = _this.props.path ? reactRouter.matchPath(location.pathname, _this.props) : context.match;

      var matchOfLivePath = _this.isLivePathMatch(livePath, alwaysLive, location.pathname, {
        path: path,
        exact: exact,
        strict: strict,
        sensitive: sensitive
      });

      var matchAnyway = matchOfPath || matchOfLivePath;

      if (_this.wrapperedRef && hookName == 'onHide') {
        _this.wrapperedRef.componentOnHide && _this.wrapperedRef.componentOnHide(location, matchAnyway, history, livePath, alwaysLive);
      } else if (_this.wrapperedRef && hookName == 'onReappear') {
        _this.wrapperedRef.componentOnReappear && _this.wrapperedRef.componentOnReappear(location, matchAnyway, history, livePath, alwaysLive);
      }

      if (typeof hook === 'function') {
        hook(location, matchAnyway, history, livePath, alwaysLive);
      }
    };

    return _this;
  }

  LiveRoute.prototype.componentDidMount = function () {
    this.getRouteDom();
  };

  LiveRoute.prototype.componentDidUpdate = function (prevProps, prevState) {
    this.performSideEffects(this.currentSideEffect, [SideEffect.ON_REAPPEAR_HOOK, SideEffect.CLEAR_DOM_DATA]);
    this.performSideEffects(this.currentSideEffect, [SideEffect.SHOW_DOM, SideEffect.RESTORE_DOM_SCROLL, SideEffect.CLEAR_DOM_SCROLL]);
    this.performSideEffects(this.currentSideEffect, [SideEffect.RESET_SCROLL]);
    this.getRouteDom();
  }; // clear on unmounting


  LiveRoute.prototype.componentWillUnmount = function () {
    this.clearDomData();
    this.clearScroll();
  };

  LiveRoute.prototype.hideRoute = function () {
    if (this.routeDom && this.routeDom.style.display !== 'none') {
      debugLog('--- hide route ---');
      this.previousDisplayStyle = this.routeDom.style.display;
      this.routeDom.style.display = 'none';
    }
  }; // reveal DOM display


  LiveRoute.prototype.showRoute = function () {
    if (this.routeDom && this.previousDisplayStyle !== null) {
      this.routeDom.style.display = this.previousDisplayStyle;
    }
  };

  LiveRoute.prototype.doesRouteEnableLive = function () {
    return this.props.livePath || this.props.alwaysLive;
  }; // save scroll position before hide DOM


  LiveRoute.prototype.saveScrollPosition = function () {
    if (this.routeDom && this.scrollPosBackup === null) {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
      debugLog("saved top = " + scrollTop + ", left = " + scrollLeft);
      this.scrollPosBackup = {
        top: scrollTop,
        left: scrollLeft
      };
    }
  }; // restore the scroll position before hide


  LiveRoute.prototype.restoreScrollPosition = function () {
    var scroll = this.scrollPosBackup;
    debugLog(scroll);

    if (scroll && this.routeDom) {
      window.scrollTo(scroll.left, scroll.top);
    }
  }; // reset scroll position


  LiveRoute.prototype.resetScrollPosition = function () {
    if (scroll && this.routeDom) {
      window.scrollTo(0, 0);
    }
  }; // clear scroll position


  LiveRoute.prototype.clearDomData = function () {
    if (this.doesRouteEnableLive()) {
      this.routeDom = null;
      this.previousDisplayStyle = null;
    }
  }; // clear scroll position


  LiveRoute.prototype.clearScroll = function () {
    if (this.doesRouteEnableLive()) {
      this.scrollPosBackup = null;
    }
  };

  LiveRoute.prototype.isLivePathMatch = function (livePath, alwaysLive, pathname, options) {
    var e_1, _a;

    var pathArr = Array.isArray(livePath) ? livePath : [livePath];

    if (alwaysLive) {
      pathArr.push('*');
    }

    try {
      for (var pathArr_1 = __values(pathArr), pathArr_1_1 = pathArr_1.next(); !pathArr_1_1.done; pathArr_1_1 = pathArr_1.next()) {
        var currPath = pathArr_1_1.value;

        if (typeof currPath !== 'string') {
          continue;
        }

        var currLiveOptions = __assign(__assign({}, options), {
          path: currPath
        });

        var currMatch = reactRouter.matchPath(pathname, currLiveOptions); // return if one of the livePaths is matched

        if (currMatch) {
          return currMatch;
        }
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (pathArr_1_1 && !pathArr_1_1.done && (_a = pathArr_1.return)) _a.call(pathArr_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    } // not matched default fallback


    return null;
  };

  LiveRoute.prototype.getSnapshotBeforeUpdate = function (prevProps, prevState) {
    this.performSideEffects(this.currentSideEffect, [SideEffect.ON_HIDE_HOOK, SideEffect.SAVE_DOM_SCROLL, SideEffect.HIDE_DOM]);
    return null;
  };

  LiveRoute.prototype.render = function () {
    var _a = this.props,
        _b = _a.exact,
        exact = _b === void 0 ? false : _b,
        _c = _a.sensitive,
        sensitive = _c === void 0 ? false : _c,
        _d = _a.strict,
        strict = _d === void 0 ? false : _d,
        forceUnmount = _a.forceUnmount,
        path = _a.path,
        livePath = _a.livePath,
        alwaysLive = _a.alwaysLive,
        component = _a.component,
        render = _a.render,
        // from withRouter, same as RouterContext.Consumer ⬇️
    history = _a.history,
        location = _a.location,
        match = _a.match,
        staticContext = _a.staticContext // from withRouter, same as RouterContext.Consumer ⬆️
    ;
    var children = this.props.children;
    var context = {
      history: history,
      location: location,
      match: match,
      staticContext: staticContext
    };
    !!!context ?  invariant(false) : void 0;
    var matchOfPath = this.props.path ? reactRouter.matchPath(location.pathname, this.props) : context.match;
    var matchOfLivePath = this.isLivePathMatch(livePath, alwaysLive, location.pathname, {
      path: path,
      exact: exact,
      strict: strict,
      sensitive: sensitive
    });
    var matchAnyway = matchOfPath || matchOfLivePath; // no render

    if (!matchAnyway || matchAnyway && !matchOfPath && (this.liveState === LiveState.NORMAL_RENDER_ON_INIT || this.liveState === LiveState.NORMAL_RENDER_UNMATCHED)) {
      debugLog('--- not match ---');
      this.currentSideEffect = [SideEffect.CLEAR_DOM_SCROLL];
      this.liveState = LiveState.NORMAL_RENDER_UNMATCHED;
      return null;
    } // normal render || hide render


    if (matchOfPath) {
      debugLog('--- normal match ---');
      this.currentSideEffect = [SideEffect.RESET_SCROLL]; // hide ➡️ show

      if (this.liveState === LiveState.HIDE_RENDER) {
        this.currentSideEffect = [SideEffect.SHOW_DOM, SideEffect.RESTORE_DOM_SCROLL, SideEffect.CLEAR_DOM_SCROLL, SideEffect.ON_REAPPEAR_HOOK];
      }

      this.liveState = LiveState.NORMAL_RENDER_MATCHED;
    } else {
      debugLog('--- hide match ---'); // force unmount

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


    var props = __assign(__assign({}, context), {
      location: location,
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

    var componentInstance = component && React.createElement(component, props); // normal render from Route

    return children && !isEmptyChildren(children) ? children : matchAnyway ? component ? componentInstance : render ? render(props) : null : null;
  };

  return LiveRoute;
}(React.Component);

exports.default = LiveRoute;
