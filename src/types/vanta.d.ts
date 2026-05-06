declare module 'vanta/dist/vanta.globe.min' {
  interface VantaEffect {
    destroy(): void
  }
  interface GlobeOptions {
    el: HTMLElement
    THREE: unknown
    mouseControls?: boolean
    touchControls?: boolean
    gyroControls?: boolean
    minHeight?: number
    minWidth?: number
    scale?: number
    scaleMobile?: number
    color?: number
    color2?: number
    size?: number
    backgroundColor?: number
  }
  function GLOBE(options: GlobeOptions): VantaEffect
  export default GLOBE
}
