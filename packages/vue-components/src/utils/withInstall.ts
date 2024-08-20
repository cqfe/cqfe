import { App, DefineComponent } from 'vue'

const withInstall = function (component: DefineComponent<Record<string, never>, Record<string, never>, any>) {
  component.install = function (Vue: App<Element>) {
    Vue.component(component.name as string, component)
  }
  return component
}

export default withInstall
