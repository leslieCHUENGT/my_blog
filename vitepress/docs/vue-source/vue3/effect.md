# vue3 源码 effect 的测试用例分析

## 测试一
```js
it('should run the passed function once (wrapped by a effect)', () => {
  const fnSpy = jest.fn(() => {})
  effect(fnSpy)
  expect(fnSpy).toHaveBeenCalledTimes(1)
})
```
这里模拟了一个函数fnSpy，用effect包裹了fnSpy,但是呢fnSpy自动执行了一次。首次effect内部包裹的函数将自动执行。
```js
/packages/reactivity/src/effect.ts
export function effect<T = any>(
  fn: () => T,
  options?: ReactiveEffectOptions
): ReactiveEffectRunner {
  if ((fn as ReactiveEffectRunner).effect) {
    fn = (fn as ReactiveEffectRunner).effect.fn
  }

  const _effect = new ReactiveEffect(fn)
  if (options) {
    extend(_effect, options)
    if (options.scope) recordEffectScope(_effect, options.scope)
  }
  if (!options || !options.lazy) {
    _effect.run()
  }
  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect
  return runner
}
```
- 因为new ReactiveEffect(fn)后返回的实例的执行机制由配置的options决定，没有配置options，那么就会直接执行effect.run- ()
- ReactiveEffect类的实现
```javascript   
export class ReactiveEffect<T = any> {
  active = true
  deps: Dep[] = []

  // can be attached after creation
  computed?: boolean
  allowRecurse?: boolean
  onStop?: () => void
  // dev only
  onTrack?: (event: DebuggerEvent) => void
  // dev only
  onTrigger?: (event: DebuggerEvent) => void

  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null,
    scope?: EffectScope | null
  ) {
    recordEffectScope(this, scope)
  }

  run() {
		···
      return this.fn()

		···
  }
	···
}
```

测试二
```js
it('should observe basic properties', () => {
    let dummy
    const counter = reactive({ num: 0 })
    effect(() => (dummy = counter.num))

    expect(dummy).toBe(0)
    counter.num = 7
    expect(dummy).toBe(7)
})
```
effect传入一个函数，在这个函数有响应式数据，当响应式数据发生变化的时候，传入的函数会再次执行

再次回到effect函数中，每次执行effect都会new ReactiveEffect，得到_effect实例，然后执行_effect.run
```js
const effectStack: ReactiveEffect[] = []
let activeEffect: ReactiveEffect | undefined
export class ReactiveEffect<T = any> {
  active = true
  deps: Dep[] = []

  // can be attached after creation
  computed?: boolean
  allowRecurse?: boolean
  onStop?: () => void
  // dev only
  onTrack?: (event: DebuggerEvent) => void
  // dev only
  onTrigger?: (event: DebuggerEvent) => void

  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null,
    scope?: EffectScope | null
  ) {
    recordEffectScope(this, scope)
  }

  run() {
    if (!this.active) {
      return this.fn()
    }
    if (!effectStack.includes(this)) {
      try {
        effectStack.push((activeEffect = this))
        enableTracking()

        trackOpBit = 1 << ++effectTrackDepth

        if (effectTrackDepth <= maxMarkerBits) {
          initDepMarkers(this)
        } else {
          cleanupEffect(this)
        }
        return this.fn()
      } finally {
        if (effectTrackDepth <= maxMarkerBits) {
          finalizeDepMarkers(this)
        }

        trackOpBit = 1 << --effectTrackDepth

        resetTracking()
        effectStack.pop()
        const n = effectStack.length
        activeEffect = n > 0 ? effectStack[n - 1] : undefined
      }
    }
  }
}
```
提前定义了两个变量 effectStack、activeEffect。当执行run的时候，会判断effectStack中**是否已经存过**activeEffect,如果没有存过则执行effectStack.push((activeEffect = this))这里做了两步操作，一个是将this赋值给activeEffect, 然后将activeEffect保存在effectStack。然后执行了this.fn。当执行了this.fn就出触发依赖收集，触发get，则会执行track。然后把activeEffect收集到dep中，完成依赖收集。
```js
// 依赖收集
export function track(target: object, type: TrackOpTypes, key: unknown) {
  if (!isTracking()) {
    return
  }
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = createDep()))
  }
  trackEffects(dep, eventInfo)
}

export function trackEffects(
  dep: Dep,
  debuggerEventExtraInfo?: DebuggerEventExtraInfo
) {
	···
  dep.add(activeEffect!)
	···
}
```
当响应式数据发生了变化，则会触发set。然后会触发trigger去触发依赖更新
```js
export function triggerEffects(
  dep: Dep | ReactiveEffect[],
  debuggerEventExtraInfo?: DebuggerEventExtraInfo
) {
  // spread into array for stabilization
  for (const effect of isArray(dep) ? dep : [...dep]) {
    ···
    effect.run()
    ···
  }
}
```
因为执行了run ,所以之前传入的fn会再次执行，所以测试可以通过




