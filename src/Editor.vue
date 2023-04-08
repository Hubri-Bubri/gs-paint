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

              <b-dropdown-item @click="onClickAddArrow">
                <b-icon icon="forward"></b-icon> Arrow
              </b-dropdown-item>

              <b-dropdown-item href="#" @click="onClickAddText">
                <b-icon icon="cursor-text"></b-icon> Text
              </b-dropdown-item>
            </b-dropdown>
          </b-button-group>

          <b-button-group size="sm" class="mr-1">
            <b-button @click="onClickToogleDraw" variant="primary">
              <b-icon :icon="mode == 'draw' ? 'pencil-fill' : 'pencil'"></b-icon> Draw
            </b-button>
          </b-button-group>

          <b-button-group size="sm" class="mr-1">
            <b-button @click="onClickRotate" variant="primary">
              <b-icon icon="arrow-clockwise"></b-icon>
            </b-button>
          </b-button-group>

          <b-button-group size="sm" class="mr-1">
            <b-form-select v-model="activeObjectColorProperty" :disabled="!oneOfModes('selection')">
              <b-form-select-option value="full">Full</b-form-select-option>
              <b-form-select-option value="fill">Background</b-form-select-option>
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

      <b-card-body class="overflow-auto d-flex justify-content-center p-0">
        <canvas id="canvas" ref="canvas"></canvas>
      </b-card-body>
    </b-card>
  </div>
</template>


<script lang="js">
import { fabric } from 'fabric'

export default {
  props: {
    image: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      mode: 'waiting',
      activeObjectColorProperty: 'full',
      activeObjectOpacity: 1,
      activeObjectStrokeWidth: 0,
      ready: false,
    }
  },

  methods: {
    onClickRotate() {
      const angle = (this.canvas.backgroundImage.angle + 90) % 360

      if (angle % 180 === 0) {
        this.canvas.setHeight(this.canvas.backgroundImage.height)
        this.canvas.setWidth(this.canvas.backgroundImage.width)
      } else {
        this.canvas.setHeight(this.canvas.backgroundImage.width)
        this.canvas.setWidth(this.canvas.backgroundImage.height)
      }

      this.canvas.backgroundImage.center()
      this.canvas.backgroundImage.rotate(angle)

      this.canvas.renderAll()
    },

    onClickDelete() {
      const object = this.canvas.getActiveObject()

      if (object == null) {
        return
      }

      this.canvas.remove(object)
    },

    onClickSave() {
      this.$emit('change', {
        url: this.image.url,
        dataUrl: this.canvas.toDataURL(),
        schema: {
          height: this.canvas.getHeight(),
          width: this.canvas.getWidth(),
          json: this.canvas.toJSON(),
        },
      })
    },

    onClickStroke() {
      const objects = this.getAsFlatActiveObjects()

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
      if (this.activeObjectColorProperty == 'full') {
        this.setActiveObjectPropertyColor('fill', colorRgb, opacity)
        this.setActiveObjectPropertyColor('stroke', colorRgb, opacity)
      } else {
        this.setActiveObjectPropertyColor(this.activeObjectColorProperty, colorRgb, opacity)
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

    setActiveObjectPropertyColor(property, colorRgb, opacity) {
      if (colorRgb !== undefined && this.activeObjectOpacity === 0) {
        this.activeObjectOpacity = 1
      }

      for (const object of this.getAsFlatActiveObjects()) {
        const color = fabric.Color.fromRgba(
          colorRgb === undefined ? object[property] || this.emptyColor : colorRgb
        )

        color.setAlpha(opacity === undefined ? this.activeObjectOpacity : opacity)

        object.set({
          [property]: color.toRgba(),
        })
      }
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
      const {fill, stroke, strokeWidth, strokeUniform, objectCaching} = this.objectDefaultConfig
      const left = 0, top = 0

      const rect = new fabric.Rect({
        width: 10,
        height: 200,
        originX: 'center',

        strokeWidth,
        fill,
        stroke,
        strokeUniform,
        objectCaching,
      })

      const triangle = new fabric.Triangle({
        left,
        top: top + strokeWidth,
        width: 25,
        height: 25,
        originX: 'center',
        originY: 'bottom',

        strokeWidth,
        fill,
        stroke,
        strokeUniform,
        objectCaching,
      })

      const group = new fabric.Group([rect, triangle], {
        left,
        top,
        objectCaching,
        strokeUniform,
      })

      this.addShapeToCanvas(group)
    },

    onClickAddCircle() {
      const {fill, stroke, strokeWidth, strokeUniform, objectCaching} = this.objectDefaultConfig

      var circle = new fabric.Circle({
        radius: 100,
        left: 0,
        top: 0,

        strokeWidth,
        fill,
        stroke,
        strokeUniform,
        objectCaching,
      });

      this.addShapeToCanvas(circle)
    },

    onClickAddSquare() {
      const {fill, stroke, strokeWidth, strokeUniform, objectCaching} = this.objectDefaultConfig

      var rect = new fabric.Rect({
        left: 0,
        top: 0,
        width: 200,
        height: 200,

        fill,
        stroke,
        strokeWidth,
        strokeUniform,
        objectCaching,
      })

      this.addShapeToCanvas(rect)
    },

    onClickAddText() {
      const {objectCaching} = this.objectDefaultConfig

      var textbox = new fabric.Textbox('Text', {
        objectCaching,
      })

      this.addShapeToCanvas(textbox)
    },

    addShapeToCanvas(shape, position='center') {
      this.canvas.add(shape)

      if (position === 'center') {
        shape.center()
      }
    },

    getAsFlatActiveObjects() {
      return this.canvas.getActiveObjects().reduce((array, value) => {
        return array.concat(value.type == 'group' ? value.getObjects() : [value])
      }, [])
    },

    computeActiveObjectOpacity() {
      var opacyties = this.getAsFlatActiveObjects().map(object => {
        return fabric.Color.fromRgba(object[this.activeObjectColorProperty] || this.emptyColor).getAlpha()
      })

      this.activeObjectOpacity = Math.min(...opacyties)
    },

    computeActiveObjectStrokeWidth() {
      var widthes = this.getAsFlatActiveObjects().map(object => {
        return object.strokeWidth
      })

      this.activeObjectStrokeWidth = Math.min(...widthes)
    },

    loadFromUrl(url) {
      fabric.Image.fromURL(url, (image, isError) => {
        this.canvas.setHeight(image.height)
        this.canvas.setWidth(image.width)

        this.canvas.setBackgroundImage(image, () => {
          this.canvas.renderAll()
        })
      })
    },

    loadFromSchema(schema) {
      this.canvas.setHeight(schema.height)
      this.canvas.setWidth(schema.width)
      this.canvas.loadFromJSON(schema.json)
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

    load() {
      this.canvas.clear()

      if (this.image && this.image.schema) {
        this.loadFromSchema(this.image.schema)
      } else if (this.image && this.image.url) {
        this.loadFromUrl(this.image.url)
      } else {
        this.canvas.setHeight(0)
        this.canvas.setWidth(0)
      }
    },

    removeTabIndex(renameTo='data-tabindex') {
      var element = this.$el

      while (element = element.parentElement) {
        if (element.hasAttribute('tabindex')) {
          if (renameTo) {
            element.setAttribute(renameTo, element.getAttribute('tabindex'))
          }
          element.removeAttribute('tabindex')
          break
        }
      }
    },
  },

  watch: {
    image: {
      handler() {
        this.load()
      },
    },
  
    activeObjectColorProperty: {
      handler(value) {
        this.computeActiveObjectOpacity()
      },
    },
  },

  mounted() {
    this.emptyColor = 'rgb(0, 0, 0, 0)'

    this.objectDefaultConfig = {
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

    this.canvas.freeDrawingBrush.width = this.objectDefaultConfig.strokeWidth * 2
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

    this.removeTabIndex()
    this.load()
  },

  destroyed() {
    this.canvas.clear()
  }
}
</script>


<style lang="css" scoped>
.btn-group .custom-select {
  width: auto;
}
.card-header {
  border-bottom: none;
}
</style>
