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
                <b-icon icon="plus-circle"></b-icon> Shape
              </template>

              <b-dropdown-item href="#" @click="onClickAddCircle">
                <b-icon icon="circle"></b-icon> Circle
              </b-dropdown-item>

              <b-dropdown-item href="#" @click="onClickAddSquare">
                <b-icon icon="square"></b-icon> Square
              </b-dropdown-item>

              <b-dropdown-item href="#" @click="onClickAddText">
                <b-icon icon="cursor-text"></b-icon> Text
              </b-dropdown-item>

              <b-dropdown-item @click="onClickAddArrow">
                <b-icon icon="forward"></b-icon> Arrow
              </b-dropdown-item>

              <b-dropdown-item @click="onClickAddLine">
                <b-icon icon="arrow-right"></b-icon> Line
              </b-dropdown-item>
            </b-dropdown>
          </b-button-group>

          <b-button-group size="sm" class="mr-1">
            <b-button @click="onClickToogleDraw" variant="primary">
              <b-icon :icon="mode == 'draw' ? 'pencil-fill' : 'pencil'"></b-icon> Draw
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
          
          <b-button-group class="mr-1">
            <b-button variant="primary">
              A
            </b-button>
            <b-button variant="primary">
              a
            </b-button>
          </b-button-group>

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

    onClickAddArrow() {
      const left = 0
      const top = 0
      const strokeWidth = 2

      const line = new fabric.Rect({
      ...this.objectBaseConfig,
        width: 10,
        height: 200,
        stroke: 'rgb(0, 0, 0, 1)',
        strokeWidth,
        evented: true,
        originX: 'center',
      })

      const triangle = new fabric.Triangle({
      ...this.objectBaseConfig,
        left,
        top: top + strokeWidth,
        width: 25,
        height: 25,
        stroke: 'rgb(0, 0, 0, 1)',
        strokeWidth,
        originX: 'center',
        originY: 'bottom',
      })

      const group = new fabric.Group([line, triangle], {
        left,
        top,
        objectCaching: false,
      })

      this.canvas.add(group)
    },

    onClickAddCircle() {
      var circle = new fabric.Circle({
        radius: 100,
        left: 0,
        top: 0,
        ...this.objectBaseConfig,
      });

      this.canvas.add(circle)
    },

    onClickAddSquare() {
      var rect = new fabric.Rect({
        left: 0,
        top: 0,
        width: 200,
        height: 200,
        ...this.objectBaseConfig,
      })

      this.canvas.add(rect)
    },

    onClickAddLine() {},

    onClickAddText() {
      var textbox = new fabric.Textbox('Text', {
        ...this.objectBaseConfig,
        fill: 'rgb(0, 0, 0, 1)',
        width: 200,
      })

      this.canvas.add(textbox)
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

    this.canvas.on('object:added', event => {
      if (this.mode === 'draw') {
        return
      }

      event.target.center()
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
