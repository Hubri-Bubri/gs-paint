<template>
  <div class="gs-paint-editor">

    <b-card header-tag="header" no-body bg-variant="light">
      <template #header>
        <b-button-toolbar>
          <b-button-group size="sm" class="mr-1">
            <slot name="left-btn-group"></slot>
          </b-button-group>

          <b-button-group size="sm" class="mr-1">
            <b-button @click="onClickSave" variant="primary">
              <b-icon icon="sd-card"></b-icon> Save
            </b-button>
          </b-button-group>

          <b-button-group size="sm" class="mr-1">
            <b-dropdown variant="primary">
              <template #button-content>
                <b-icon icon="plus"></b-icon> Object
              </template>

              <b-dropdown-item href="#" @click="onClickAddCircle">
                <b-icon icon="circle"></b-icon> Circle
              </b-dropdown-item>

              <b-dropdown-item href="#" @click="onClickAddSquare">
                <b-icon icon="square"></b-icon> Square
              </b-dropdown-item>

              <b-dropdown-item href="#" @click="onClickAddSquare">
                <b-icon icon="cursor-text"></b-icon> Text
              </b-dropdown-item>
            </b-dropdown>
          </b-button-group>

          <b-button-group size="sm" class="mr-1">
            <b-button @click="onClickToogleArrow" variant="primary">
              <b-icon :icon="mode == 'arrow' ? 'forward-fill' : 'forward'"></b-icon>
            </b-button>
          </b-button-group>

          <b-button-group size="sm" class="mr-1">
            <b-button @click="onClickToogleDraw" variant="primary">
              <b-icon :icon="mode == 'draw' ? 'pencil-fill' : 'pencil'"></b-icon>
            </b-button>
          </b-button-group>

          <b-button-group size="sm" class="mr-1">
            <b-form-select v-model="activeObjectColorProperty" :disabled="!oneOfModes('selection')">
              <b-form-select-option value="fill">Fill</b-form-select-option>
              <b-form-select-option value="stroke">Stroke</b-form-select-option>
            </b-form-select>

            <b-button @click="onClickColor('rgb(0, 123, 255)')" variant="primary" :disabled="!oneOfModes('selection')">
              <b-icon icon="droplet"></b-icon>
            </b-button>
            <b-button @click="onClickColor('rgb(40, 167, 69)')" variant="success" :disabled="!oneOfModes('selection')">
              <b-icon icon="droplet"></b-icon>
            </b-button>
            <b-button @click="onClickColor('rgb(255, 193, 7)')" variant="warning" :disabled="!oneOfModes('selection')">
              <b-icon icon="droplet"></b-icon>
            </b-button>
            <b-button @click="onClickColor('rgb(220, 53, 69)')" variant="danger" :disabled="!oneOfModes('selection')">
              <b-icon icon="droplet"></b-icon>
            </b-button>
            <b-button @click="onClickColor('rgb(0, 0, 0)')" variant="dark" :disabled="!oneOfModes('selection')">
              <b-icon icon="droplet"></b-icon>
            </b-button>
            <b-button variant="primary" @click="onClickOpacity('rgb(220, 53, 69)')" :disabled="!oneOfModes('selection')">
              <b-icon icon="brightness-high"></b-icon> {{activeObjectOpacity * 4}}
            </b-button>
          </b-button-group>

          <b-button @click="onClickStroke" variant="primary" :disabled="!oneOfModes('selection')" class="mr-1">
            <b-icon icon="dash-lg"></b-icon> {{activeObjectStrokeWidth}}
          </b-button>

          <b-button-group size="sm" class="mr-1">
            <b-button @click="onClickDelete" variant="primary" :disabled="!oneOfModes('selection')">
              <b-icon icon="trash2"></b-icon>
            </b-button>
          </b-button-group>

        </b-button-toolbar>
      </template>

      <b-card-body class="overflow-auto d-flex justify-content-center">
        <canvas id="canvas" ref="canvas"></canvas>
      </b-card-body>
    </b-card>
  </div>
</template>


<script lang="js">
import { fabric } from 'fabric'

export default {
  props: {
    url: {
      type: String,
      default: null,
    },

    schema: {
      type: [String, Object],
      default: null,
    },
  },

  data() {
    return {
      mode: 'waiting',
      activeObjectColorProperty: 'fill',
      activeObjectOpacity: 1,
      activeObjectStrokeWidth: 0,
    }
  },

  methods: {
    onClickDelete() {
      const object = this.canvas.getActiveObject()

      if (object == null) {
        return
      }

      this.canvas.remove(object)
    },

    onClickSave() {
      this.state = this.canvas.toJSON()
    },

    onClickLoad() {
      if (this.state) {
        this.canvas.loadFromJSON(this.state)
      }
    },

    onClickStroke() {
      const objects = this.canvas.getActiveObjects()

      this.activeObjectStrokeWidth += 2

      if (this.activeObjectStrokeWidth > 8) {
        this.activeObjectStrokeWidth = 0
      }

      for (const object of objects) {
        object.set({
          strokeWidth: this.activeObjectStrokeWidth,
        })
      }

      this.canvas.renderAll()
    },

    onClickColor(colorRgb, opacity) {
      if (colorRgb !== undefined && this.activeObjectOpacity === 0) {
        this.activeObjectOpacity = 1
      }

      for (const object of this.canvas.getActiveObjects()) {
        const color = fabric.Color.fromRgba(
          colorRgb === undefined ? object[this.activeObjectColorProperty] || this.emptyColor : colorRgb
        )

        color.setAlpha(
          opacity === undefined ? this.activeObjectOpacity : opacity
        )

        object.set({
          [this.activeObjectColorProperty]: color.toRgba(),
        })
      }

      this.canvas.renderAll()
    },

    onClickOpacity() {
      this.activeObjectOpacity += .25

      if (this.activeObjectOpacity > 1) {
        this.activeObjectOpacity = 0
      }

      this.onClickColor(undefined, this.activeObjectOpacity)
    },

    onClickToogleDraw() {
      if (this.mode === 'draw') {
        this.switchToMode('waiting')
      } else {
        this.switchToMode('draw')
      }

      this.canvas.isDrawingMode = this.mode === 'draw'
    },

    onClickToogleArrow() {
      if (this.mode == 'arrow') {
        this.switchToMode('waiting')
      } else {
        this.switchToMode('arrow')
        this.onClickAddArrow()
      }
    },

    onClickAddArrow() {
      const {left, top} = this.computeAllowablePosition()

      const line = new fabric.Line([left, top, left, top + 50], {
        fill: 'rgb(220, 53, 69)',
        stroke: 'rgb(220, 53, 69)',
        strokeWidth: 5,
        evented: true,
        originX: 'center',
        originY: 'center',
      })

      const triangle = new fabric.Triangle({
        left,
        top: top,
        width: 15,
        height: 10,
        stroke: 'rgb(0, 0, 0, 0)',
        strokeWidth: 0,
        fill: 'rgb(220, 53, 69)',
        originX: 'center',
        originY: 'bottom',
      })

      this.canvas.add(triangle)
      this.canvas.add(line)

      triangle.on('moving', event => {
        line.set({
          x1: triangle.left,
          y1: triangle.top,
        })
        line.setCoords()

        const hypotenuse = Math.sqrt(Math.pow(line.x1 - line.x2, 2) + Math.pow(line.y1 - line.y2, 2))
        const cathetus = Math.abs(line.x1 - line.x2)

        let angle = Math.acos(cathetus / hypotenuse) * 180 / Math.PI

        // console.log('angle', angle)

        triangle.set({
          angle: 90 - angle,
        })

        this.canvas.renderAll()
      })

      line.on('moving', event => {
        console.log(line.left)
        console.log(line.top)
      })

      line.on('removed', event => {
        this.canvas.remove(triangle)
      })

      triangle.on('removed', event => {
        this.canvas.remove(line)
      })
    },

    onClickAddCircle() {
      const {left, top} = this.computeAllowablePosition()

      var circle = new fabric.Circle({
        radius: 100,
        left,
        top,
        ...this.objectBaseConfig,
      });

      this.canvas.add(circle)
    },

    onClickAddSquare() {
      const {left, top} = this.computeAllowablePosition()

      var rect = new fabric.Rect({
        left,
        top,
        ...this.objectBaseConfig,
      })

      this.canvas.add(rect)
    },

    computeActiveObjectOpacity() {
      var opacyties = this.canvas.getActiveObjects().map(object => {
        return fabric.Color.fromRgba(object[this.activeObjectColorProperty] || this.emptyColor).getAlpha()
      })

      this.activeObjectOpacity = Math.min(...opacyties)
    },

    computeActiveObjectStrokeWidth() {
      var widthes = this.canvas.getActiveObjects().map(object => {
        return object.strokeWidth
      })

      this.activeObjectStrokeWidth = Math.min(...widthes)
    },

    setImageFromUrl(url) {
      fabric.Image.fromURL(url, image => {
        this.canvas.setHeight(image.height)
        this.canvas.setWidth(image.width)

        this.canvas.setBackgroundImage(image, () => {
          this.canvas.renderAll()
        });
      })
    },

    computeAllowablePosition() {
      return {
        left: 30,
        top: 30,
      }
    },
  
    oneOfModes(...modes) {
      return modes.includes(this.mode)
    },

    switchToMode(mode) {
      if (this.mode == mode) {
        return
      }

      if (this.mode == 'selection') {
        this.canvas.discardActiveObject()
        this.canvas.renderAll()
      }

      if (this.mode === 'draw') {
        this.canvas.isDrawingMode = false
      }

      this.mode = mode
    },

  },

  watch: {
    url: {
      handler(value) {
        this.setImageFromUrl(value)
      },
      immediate: true
    },
    activeObjectColorProperty: {
      handler(value) {
        this.computeActiveObjectOpacity()
      },
    },
  },

  mounted() {
    this.emptyColor = 'rgb(0, 0, 0, 0)'

    this.objectBaseConfig = {
        width: 200,
        height: 200,
        fill: 'rgba(0, 0, 0, 0)',
        stroke: 'rgba(0, 0, 0, 1)',
        strokeWidth: 2,
        strokeUniform: true,
        objectCaching: false,
    }

    this.canvas = new fabric.Canvas('canvas', {
      uniformScaling: false,
    })

    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);

    this.canvas.freeDrawingBrush.width = this.objectBaseConfig.strokeWidth * 2
    this.canvas.freeDrawingBrush.color = 'rgb(0, 0, 0)'

    this.canvas.on('selection:created', event => {
      this.switchToMode('selection')
      this.computeActiveObjectOpacity()
      this.computeActiveObjectStrokeWidth()
    })

    this.canvas.on('selection:updated', event => {
      this.computeActiveObjectOpacity()
      this.computeActiveObjectStrokeWidth()
    })

    this.canvas.on('selection:cleared', event => {
      this.switchToMode('waiting')
    })
  },

  destroyed() { }
}
</script>


<style lang="css" scoped>
.btn-group .custom-select {
  width: auto;
}
</style>
