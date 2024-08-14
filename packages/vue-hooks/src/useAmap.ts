import { loadScript } from '@cqfe/utils'
import { onMounted, Ref, shallowRef } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

/**
 * 使用 AMap 高德地图库，并返回 mapInstance 地图实例对象和 AMapObj 高德地图对象。
 *
 * @param key 地图访问密钥
 * @param code 高德地图安全验证代码
 * @param config 地图初始化配置参数
 * @param mapRef 地图容器元素的引用
 * @param offline 是否使用离线地图，默认为 false
 * @param imgUrl 离线地图瓦片图片地址，默认为空字符串
 * @returns 返回一个对象，包含 map 地图实例对象、AMap 高德地图对象和 initMap 初始化地图的函数
 */
export function useAmap(
  key: string,
  code: string,
  config: Record<string, any>,
  mapRef: Ref<Element>,
  offline = false,
  imgUrl = location.origin,
) {
  const AMapObj = shallowRef(null)
  const mapInstance = shallowRef(null)

  function initOfflineMap() {
    // 自定义地图层
    const layers = [
      new (window as any).AMap.TileLayer({
        getTileUrl: function (x: string, y: string, z: string) {
          return `${imgUrl}/normal/${z}/${x}/${y}/tile.png`
        },
        opacity: 1,
        zIndex: 99,
      }),
    ]

    AMapObj.value = (window as any).AMap
    mapInstance.value = new (window as any).AMap.Map(mapRef.value, {
      ...config,
      layers,
    })
    const [layerDom] = document.getElementsByClassName('amap-layers')
    if (layerDom && layerDom?.children?.[0]?.nodeName === 'CANVAS') {
      ;(layerDom.children[0] as any).style.filter =
        'grayscale(100%) invert(100%) sepia(20%) hue-rotate(180deg) saturate(1600%) brightness(60%) contrast(70%)'
    }
  }

  function initOnlineMap(): Promise<void> {
    ;(window as any)._AMapSecurityConfig = {
      securityJsCode: code,
    }
    return new Promise((resolve, reject) => {
      AMapLoader.load({
        key,
        version: '2.0',
      })
        .then((AMap: any) => {
          AMapObj.value = AMap
          mapInstance.value = new AMap.Map(mapRef.value, config)
          resolve()
        })
        .catch((err: Error) => {
          console.error(err)
          reject(err)
        })
    })
  }

  function initMap() {
    return new Promise((resolve, reject) => {
      if (!mapRef.value) throw new Error('地图容器不存在')
      if (offline) {
        loadScript(`${location.pathname}/amap/AMap3.js`)
          .then(() => {
            initOfflineMap()
            resolve(undefined)
          })
          .catch((err: Error) => reject(err))
      } else {
        initOnlineMap()
          .then(() => resolve(undefined))
          .catch((err: Error) => reject(err))
      }
    })
  }

  onMounted(() => {
    initMap()
  })

  return { map: mapInstance, AMap: AMapObj, initMap }
}
