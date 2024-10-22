import { useCallback, useEffect, useRef, useReducer } from 'react';
import { Howler, Howl } from 'howler';

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

var ActionTypes;
(function (ActionTypes) {
  ActionTypes["START_LOAD"] = "START_LOAD";
  ActionTypes["ON_LOAD"] = "ON_LOAD";
  ActionTypes["ON_ERROR"] = "ON_ERROR";
  ActionTypes["ON_PLAY"] = "ON_PLAY";
  ActionTypes["ON_PAUSE"] = "ON_PAUSE";
  ActionTypes["ON_STOP"] = "ON_STOP";
  ActionTypes["ON_END"] = "ON_END";
  ActionTypes["ON_RATE"] = "ON_RATE";
  ActionTypes["ON_MUTE"] = "ON_MUTE";
  ActionTypes["ON_VOLUME"] = "ON_VOLUME";
  ActionTypes["ON_LOOP"] = "ON_LOOP";
})(ActionTypes || (ActionTypes = {}));
function initStateFromHowl(howl) {
  if (howl === undefined) {
    return {
      src: null,
      isReady: false,
      isLoading: false,
      looping: false,
      duration: 0,
      rate: 1,
      volume: 1,
      muted: false,
      playing: false,
      paused: false,
      stopped: false,
      error: null
    };
  }
  var position = howl.seek();
  var playing = howl.playing();
  return {
    isReady: howl.state() === "loaded",
    isLoading: howl.state() === "loading",
    // @ts-ignore _src exists
    src: howl._src,
    looping: howl.loop(),
    duration: howl.duration(),
    rate: howl.rate(),
    volume: howl.volume(),
    muted: howl.mute(),
    playing: playing,
    paused: !playing,
    stopped: !playing && position === 0,
    error: null
  };
}
function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.START_LOAD:
      return _extends({}, initStateFromHowl(), {
        isLoading: true
      });
    case ActionTypes.ON_LOAD:
      // in React 18 there is a weird race condition where ON_LOAD receives a Howl object that has been unloaded
      // if we detect this case just return the existing state to wait for another action
      if (action.howl.state() === "unloaded") {
        return state;
      }
      return initStateFromHowl(action.howl);
    case ActionTypes.ON_ERROR:
      return _extends({}, initStateFromHowl(), {
        error: action.message
      });
    case ActionTypes.ON_PLAY:
      return _extends({}, state, {
        playing: true,
        paused: false,
        stopped: false
      });
    case ActionTypes.ON_PAUSE:
      return _extends({}, state, {
        playing: false,
        paused: true
      });
    case ActionTypes.ON_STOP:
      {
        return _extends({}, state, {
          playing: false,
          paused: false,
          stopped: true
        });
      }
    case ActionTypes.ON_END:
      {
        return _extends({}, state, {
          playing: state.looping,
          stopped: !state.looping
        });
      }
    case ActionTypes.ON_MUTE:
      {
        var _action$howl$mute;
        return _extends({}, state, {
          muted: (_action$howl$mute = action.howl.mute()) !== null && _action$howl$mute !== void 0 ? _action$howl$mute : false
        });
      }
    case ActionTypes.ON_RATE:
      {
        var _action$howl$rate, _action$howl;
        return _extends({}, state, {
          rate: (_action$howl$rate = (_action$howl = action.howl) === null || _action$howl === void 0 ? void 0 : _action$howl.rate()) !== null && _action$howl$rate !== void 0 ? _action$howl$rate : 1.0
        });
      }
    case ActionTypes.ON_VOLUME:
      {
        var _action$howl$volume, _action$howl2;
        return _extends({}, state, {
          volume: (_action$howl$volume = (_action$howl2 = action.howl) === null || _action$howl2 === void 0 ? void 0 : _action$howl2.volume()) !== null && _action$howl$volume !== void 0 ? _action$howl$volume : 1.0
        });
      }
    case ActionTypes.ON_LOOP:
      {
        var _action$toggleValue = action.toggleValue,
          toggleValue = _action$toggleValue === void 0 ? false : _action$toggleValue,
          howl = action.howl;
        howl.loop(toggleValue);
        return _extends({}, state, {
          looping: toggleValue
        });
      }
    default:
      return state;
  }
}

function useHowlEventSync(howlManager, _ref) {
  var state = _ref[0],
    dispatch = _ref[1];
  var onLoad = useCallback(function () {
    var howl = howlManager.getHowl();
    if (howl === undefined) return;
    dispatch({
      type: ActionTypes.ON_LOAD,
      howl: howl
    });
  }, [dispatch, howlManager]);
  var onError = useCallback(function (_, errorCode) {
    dispatch({
      type: ActionTypes.ON_ERROR,
      message: errorCode
    });
  }, [dispatch]);
  var onPlay = useCallback(function () {
    var howl = howlManager.getHowl();
    // TODO since this is the sync layer i should really extract the info from the howl here and pass that in with the action payload
    if (howl === undefined) return;
    dispatch({
      type: ActionTypes.ON_PLAY,
      howl: howl
    });
  }, [dispatch, howlManager]);
  var onPause = useCallback(function () {
    var howl = howlManager.getHowl();
    if (howl === undefined) return;
    dispatch({
      type: ActionTypes.ON_PAUSE,
      howl: howl
    });
  }, [dispatch, howlManager]);
  var onEnd = useCallback(function () {
    var howl = howlManager.getHowl();
    if (howl === undefined) return;
    dispatch({
      type: ActionTypes.ON_END,
      howl: howl
    });
  }, [dispatch, howlManager]);
  var onStop = useCallback(function () {
    var howl = howlManager.getHowl();
    if (howl === undefined) return;
    dispatch({
      type: ActionTypes.ON_STOP,
      howl: howl
    });
  }, [dispatch, howlManager]);
  var onMute = useCallback(function () {
    var howl = howlManager.getHowl();
    if (howl === undefined) return;
    dispatch({
      type: ActionTypes.ON_MUTE,
      howl: howl
    });
  }, [dispatch, howlManager]);
  var onVolume = useCallback(function () {
    var howl = howlManager.getHowl();
    if (howl === undefined) return;
    dispatch({
      type: ActionTypes.ON_VOLUME,
      howl: howl
    });
  }, [dispatch, howlManager]);
  var onRate = useCallback(function () {
    var howl = howlManager.getHowl();
    if (howl === undefined) return;
    dispatch({
      type: ActionTypes.ON_RATE,
      howl: howl
    });
  }, [dispatch, howlManager]);
  useEffect(function () {
    return function () {
      var howl = howlManager.getHowl();
      // howl?.off("load", onLoad)
      howl === null || howl === void 0 ? void 0 : howl.off("loaderror", onError);
      howl === null || howl === void 0 ? void 0 : howl.off("playerror", onError);
      howl === null || howl === void 0 ? void 0 : howl.off("play", onPlay);
      howl === null || howl === void 0 ? void 0 : howl.off("pause", onPause);
      howl === null || howl === void 0 ? void 0 : howl.off("end", onEnd);
      howl === null || howl === void 0 ? void 0 : howl.off("stop", onStop);
      howl === null || howl === void 0 ? void 0 : howl.off("mute", onMute);
      howl === null || howl === void 0 ? void 0 : howl.off("volume", onVolume);
      howl === null || howl === void 0 ? void 0 : howl.off("rate", onRate);
    };
  }, []);
  // using ref bc we don't want identity of dispatch function to change
  // see talk: https://youtu.be/nUzLlHFVXx0?t=1558
  var wrappedDispatch = useRef(function (action) {
    if (action.type === ActionTypes.START_LOAD) {
      var howl = action.howl;
      // set up event listening
      howl.once("load", onLoad);
      howl.on("loaderror", onError);
      howl.on("playerror", onError);
      howl.on("play", onPlay);
      howl.on("pause", onPause);
      howl.on("end", onEnd);
      howl.on("stop", onStop);
      howl.on("mute", onMute);
      howl.on("volume", onVolume);
      howl.on("rate", onRate);
    }
    dispatch(action);
  });
  return [state, wrappedDispatch.current];
}

var _excluded = ["initialVolume", "initialRate", "initialMute"];
var HowlInstanceManager = /*#__PURE__*/function () {
  function HowlInstanceManager() {
    this.callbacks = new Map();
    this.howl = undefined;
    this.options = {};
    this.subscriptionIndex = 0;
  }
  var _proto = HowlInstanceManager.prototype;
  _proto.subscribe = function subscribe(cb) {
    var id = (this.subscriptionIndex++).toString();
    this.callbacks.set(id, cb);
    return id;
  };
  _proto.unsubscribe = function unsubscribe(subscriptionId) {
    this.callbacks["delete"](subscriptionId);
  };
  _proto.getHowl = function getHowl() {
    return this.howl;
  };
  _proto.getHowler = function getHowler() {
    return Howler;
  };
  _proto.getNumberOfConnections = function getNumberOfConnections() {
    return this.callbacks.size;
  };
  _proto.createHowl = function createHowl(options) {
    this.destroyHowl();
    this.options = options;
    var _this$options = this.options,
      initialVolume = _this$options.initialVolume,
      initialRate = _this$options.initialRate,
      initialMute = _this$options.initialMute,
      rest = _objectWithoutPropertiesLoose(_this$options, _excluded);
    var newHowl = new Howl(_extends({
      mute: initialMute,
      volume: initialVolume,
      rate: initialRate
    }, rest));
    this.callbacks.forEach(function (cb) {
      return cb({
        type: ActionTypes.START_LOAD,
        howl: newHowl
      });
    });
    this.howl = newHowl;
    return newHowl;
  };
  _proto.destroyHowl = function destroyHowl() {
    var _this$howl6;
    if (this.options.onload) {
      var _this$howl;
      (_this$howl = this.howl) === null || _this$howl === void 0 ? void 0 : _this$howl.off("load", this.options.onload);
    }
    if (this.options.onend) {
      var _this$howl2;
      (_this$howl2 = this.howl) === null || _this$howl2 === void 0 ? void 0 : _this$howl2.off("end", this.options.onend);
    }
    if (this.options.onplay) {
      var _this$howl3;
      (_this$howl3 = this.howl) === null || _this$howl3 === void 0 ? void 0 : _this$howl3.off("play", this.options.onplay);
    }
    if (this.options.onpause) {
      var _this$howl4;
      (_this$howl4 = this.howl) === null || _this$howl4 === void 0 ? void 0 : _this$howl4.off("pause", this.options.onpause);
    }
    if (this.options.onstop) {
      var _this$howl5;
      (_this$howl5 = this.howl) === null || _this$howl5 === void 0 ? void 0 : _this$howl5.off("stop", this.options.onstop);
    }
    (_this$howl6 = this.howl) === null || _this$howl6 === void 0 ? void 0 : _this$howl6.unload();
  };
  _proto.broadcast = function broadcast(action) {
    this.callbacks.forEach(function (cb) {
      return cb(action);
    });
  };
  return HowlInstanceManager;
}();
var HowlInstanceManagerSingleton = /*#__PURE__*/function () {
  function HowlInstanceManagerSingleton() {}
  HowlInstanceManagerSingleton.getInstance = function getInstance() {
    if (this.instance === undefined) {
      HowlInstanceManagerSingleton.instance = new HowlInstanceManager();
    }
    return HowlInstanceManagerSingleton.instance;
  };
  return HowlInstanceManagerSingleton;
}();
HowlInstanceManagerSingleton.instance = void 0;

var useAudioPlayer = function useAudioPlayer() {
  var howlManager = useRef(null);
  var howlerGlobal = useRef(null);
  function getHowlManager() {
    if (howlManager.current !== null) {
      return howlManager.current;
    }
    var manager = new HowlInstanceManager();
    howlManager.current = manager;
    howlerGlobal.current = manager.getHowler();
    return manager;
  }
  var _useHowlEventSync = useHowlEventSync(getHowlManager(), useReducer(reducer, getHowlManager().getHowl(), initStateFromHowl)),
    state = _useHowlEventSync[0],
    dispatch = _useHowlEventSync[1];
  var load = useCallback(function () {
    for (var _len = arguments.length, _ref = new Array(_len), _key = 0; _key < _len; _key++) {
      _ref[_key] = arguments[_key];
    }
    var src = _ref[0],
      _ref$ = _ref[1],
      options = _ref$ === void 0 ? {} : _ref$;
    // TODO investigate: if we try to avoid loading the same sound (existing howl & same src in call)
    // then there are some bugs like in the MultipleSounds demo, the "play" button will not switch to "pause"
    var howl = getHowlManager().createHowl(_extends({
      src: src
    }, options));
    dispatch({
      type: ActionTypes.START_LOAD,
      howl: howl
    });
  }, []);
  var seek = useCallback(function (seconds) {
    var howl = getHowlManager().getHowl();
    if (howl === undefined) {
      return;
    }
    howl.seek(seconds);
  }, []);
  var getPosition = useCallback(function () {
    var _howl$seek;
    var howl = getHowlManager().getHowl();
    if (howl === undefined) {
      return 0;
    }
    return (_howl$seek = howl.seek()) !== null && _howl$seek !== void 0 ? _howl$seek : 0;
  }, []);
  var play = useCallback(function () {
    var howl = getHowlManager().getHowl();
    if (howl === undefined) {
      return;
    }
    howl.play();
  }, []);
  var pause = useCallback(function () {
    var howl = getHowlManager().getHowl();
    if (howl === undefined) {
      return;
    }
    howl.pause();
  }, []);
  var togglePlayPause = useCallback(function () {
    var howl = getHowlManager().getHowl();
    if (howl === undefined) {
      return;
    }
    if (state.playing) {
      howl.pause();
    } else {
      howl.play();
    }
  }, [state]);
  var stop = useCallback(function () {
    var howl = getHowlManager().getHowl();
    if (howl === undefined) {
      return;
    }
    howl.stop();
  }, []);
  var fade = useCallback(function (from, to, duration) {
    var howl = getHowlManager().getHowl();
    if (howl === undefined) {
      return;
    }
    howl.fade(from, to, duration);
  }, []);
  var setRate = useCallback(function (speed) {
    var howl = getHowlManager().getHowl();
    if (howl === undefined) {
      return;
    }
    howl.rate(speed);
  }, []);
  var setVolume = useCallback(function (vol) {
    var howl = getHowlManager().getHowl();
    if (howl === undefined) {
      return;
    }
    howl.volume(vol);
  }, []);
  var mute = useCallback(function (muteOnOff) {
    var howl = getHowlManager().getHowl();
    if (howl === undefined) {
      return;
    }
    howl.mute(muteOnOff);
  }, []);
  var loop = useCallback(function (loopOnOff) {
    var howl = getHowlManager().getHowl();
    if (howl === undefined) {
      return;
    }
    // this differs from the implementation in useGlobalAudioPlayer which needs to broadcast the action to itself and all other instances of the hook
    // maybe these two behaviors could be abstracted with one interface in the future
    dispatch({
      type: ActionTypes.ON_LOOP,
      howl: howl,
      toggleValue: loopOnOff
    });
  }, []);
  var cleanup = useCallback(function () {
    var _getHowlManager;
    (_getHowlManager = getHowlManager()) === null || _getHowlManager === void 0 ? void 0 : _getHowlManager.destroyHowl();
  }, []);
  return _extends({}, state, {
    load: load,
    seek: seek,
    getPosition: getPosition,
    play: play,
    pause: pause,
    togglePlayPause: togglePlayPause,
    stop: stop,
    mute: mute,
    fade: fade,
    setRate: setRate,
    setVolume: setVolume,
    loop: loop,
    cleanup: cleanup,
    howlManager: howlManager,
    howlerGlobal: howlerGlobal
  });
};

function useGlobalAudioPlayer() {
  var howlManager = useRef(HowlInstanceManagerSingleton.getInstance());
  var _useHowlEventSync = useHowlEventSync(howlManager.current, useReducer(reducer, howlManager.current.getHowl(), initStateFromHowl)),
    state = _useHowlEventSync[0],
    dispatch = _useHowlEventSync[1];
  useEffect(function () {
    var howlOnMount = howlManager.current.getHowl();
    if (howlOnMount !== undefined) {
      dispatch({
        type: ActionTypes.START_LOAD,
        howl: howlOnMount
      });
      if (howlOnMount.state() === "loaded") {
        dispatch({
          type: ActionTypes.ON_LOAD,
          howl: howlOnMount
        });
      }
    }
    function sync(action) {
      dispatch(action);
    }
    var subscriptionId = howlManager.current.subscribe(sync);
    return function () {
      howlManager.current.unsubscribe(subscriptionId);
    };
  }, []);
  var load = useCallback(function () {
    for (var _len = arguments.length, _ref = new Array(_len), _key = 0; _key < _len; _key++) {
      _ref[_key] = arguments[_key];
    }
    var src = _ref[0],
      _ref$ = _ref[1],
      options = _ref$ === void 0 ? {} : _ref$;
    // the HowlInstanceManager will intercept this newly created howl and broadcast it to registered hooks
    howlManager.current.createHowl(_extends({
      src: src
    }, options));
  }, []);
  var seek = useCallback(function (seconds) {
    var howl = howlManager.current.getHowl();
    if (howl === undefined) {
      return;
    }
    howl.seek(seconds);
  }, []);
  var getPosition = useCallback(function () {
    var _howl$seek;
    var howl = howlManager.current.getHowl();
    if (howl === undefined) {
      return 0;
    }
    return (_howl$seek = howl.seek()) !== null && _howl$seek !== void 0 ? _howl$seek : 0;
  }, []);
  var play = useCallback(function () {
    var howl = howlManager.current.getHowl();
    if (howl === undefined) {
      return;
    }
    howl.play();
  }, []);
  var pause = useCallback(function () {
    var howl = howlManager.current.getHowl();
    if (howl === undefined) {
      return;
    }
    howl.pause();
  }, []);
  var togglePlayPause = useCallback(function () {
    var howl = howlManager.current.getHowl();
    if (howl === undefined) {
      return;
    }
    if (state.playing) {
      howl.pause();
    } else {
      howl.play();
    }
  }, [state]);
  var stop = useCallback(function () {
    var howl = howlManager.current.getHowl();
    if (howl === undefined) {
      return;
    }
    howl.stop();
  }, []);
  var fade = useCallback(function (from, to, duration) {
    var howl = howlManager.current.getHowl();
    if (howl === undefined) {
      return;
    }
    howl.fade(from, to, duration);
  }, []);
  var setRate = useCallback(function (speed) {
    var howl = howlManager.current.getHowl();
    if (howl === undefined) {
      return;
    }
    howl.rate(speed);
  }, []);
  var setVolume = useCallback(function (vol) {
    var howl = howlManager.current.getHowl();
    if (howl === undefined) {
      return;
    }
    howl.volume(vol);
  }, []);
  var mute = useCallback(function (muteOnOff) {
    var howl = howlManager.current.getHowl();
    if (howl === undefined) {
      return;
    }
    howl.mute(muteOnOff);
  }, []);
  var loop = useCallback(function (loopOnOff) {
    var howl = howlManager.current.getHowl();
    if (howl === undefined) {
      return;
    }
    howlManager.current.broadcast({
      type: ActionTypes.ON_LOOP,
      howl: howl,
      toggleValue: loopOnOff
    });
  }, []);
  return _extends({}, state, {
    load: load,
    seek: seek,
    getPosition: getPosition,
    play: play,
    pause: pause,
    togglePlayPause: togglePlayPause,
    stop: stop,
    mute: mute,
    fade: fade,
    setRate: setRate,
    setVolume: setVolume,
    loop: loop
  });
}

export { useAudioPlayer, useGlobalAudioPlayer };
//# sourceMappingURL=react-use-audio-player.esm.js.map
