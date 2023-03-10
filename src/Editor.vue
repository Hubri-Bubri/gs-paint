<template>
  <div class="gs-paint-editor">

    <b-card header-tag="header" no-body bg-variant="light">
      <template #header>
        <b-button-toolbar>
          <b-button-group size="sm" class="mr-1">

            <b-button @click="onClickSave" variant="secondary">
              <b-icon icon="sd-card"></b-icon> Save
            </b-button>

            <b-button @click="onClickLoad" variant="secondary">
              <b-icon icon="folder2-open"></b-icon> Open
            </b-button>
          </b-button-group>

          <b-button-group size="sm" class="mr-1">
            <b-dropdown>
              <template #button-content>
                <b-icon icon="plus-square"></b-icon> Insert
              </template>

              <b-dropdown-item href="#" @click="onClickAddArrow">
                <b-icon icon="forward"></b-icon> Arrow
              </b-dropdown-item>

              <b-dropdown-item href="#" @click="onClickAddCircle">
                <b-icon icon="circle"></b-icon> Circle
              </b-dropdown-item>

              <b-dropdown-item href="#" @click="onClickAddSquare">
                <b-icon icon="square"></b-icon> Square
              </b-dropdown-item>

              <b-dropdown-item href="#" @click="onClickAddSquare">
                <b-icon icon="cursor-text"></b-icon> Text
              </b-dropdown-item>

              <b-dropdown-item href="#" @click="onClickEnebleDraw">
                <b-icon icon="pencil"></b-icon> Draw
              </b-dropdown-item>

            </b-dropdown>
          </b-button-group>

          <b-button-group size="sm" class="mr-1">
            <b-button @click="onClickBorder" variant="secondary" :disabled="!active">
              <b-icon icon="dash-lg"></b-icon> Border
            </b-button>
          </b-button-group>

          <b-button-group size="sm" class="mr-1">
            <b-button @click="onClickFill('rgb(40, 167, 69)')" variant="success" :disabled="!active">
              <b-icon icon="brush-fill"></b-icon>
            </b-button>
            <b-button @click="onClickFill('rgb(255, 193, 7)')" variant="warning" :disabled="!active">
              <b-icon icon="brush-fill"></b-icon>
            </b-button>
            <b-button @click="onClickFill('rgb(220, 53, 69)')" variant="danger" :disabled="!active">
              <b-icon icon="brush-fill"></b-icon>
            </b-button>
          </b-button-group>

          <b-button-group size="sm" class="mr-1">
            <b-button @click="onClickDelete" variant="secondary" :disabled="!active">
              <b-icon icon="trash2"></b-icon> Delete
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

    json: {
      type: [String, Object],
      default: null,
    },
  },

  data() {
    return {
      active: false,
      mode: 'ready',
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

    onClickBorder() {
      const objects = this.canvas.getActiveObjects()

      for (const object of objects) {
        object.set({
          strokeWidth: object.strokeWidth ? 0 : 5,
        })
      }

      this.canvas.renderAll()
    },

    onClickFill(fill) {
      const objects = this.canvas.getActiveObjects()

      for (const object of objects) {
        object.set({
          fill,
        })
      }

      this.canvas.renderAll()
    },

    onClickAddCircle() {
      const {left, top} = this.computeAllowablePosition()

      var circle = new fabric.Circle({
        radius: 100,
        left,
        top,
        ...this.getObjectBaseValues(),
      });

      this.canvas.add(circle)
    },

    onClickEnebleDraw() {

    },

    onClickAddArrow() {},

    onClickAddSquare() {
      const {left, top} = this.computeAllowablePosition()

      var rect = new fabric.Rect({
        left,
        top,
        ...this.getObjectBaseValues(),
      })

      this.canvas.add(rect)
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

    setActiveObjectValues(values) {},
    getActiveObjectValue(name) {},
    oneOfModes(...modes) {

    },

    getObjectBaseValues() {
      return {
        width: 200,
        height: 200,
        fill: 'rgba(0, 0, 0, 0)',
        stroke: 'red',
        strokeWidth: 3,
        strokeUniform: true,
        objectCaching: false,
      }
    },
  },

  watch: {
    url: {
      handler () {
        this.setImageFromUrl(this.url)
      },
      immediate: true
    }
  },

  mounted() {
    this.canvas = new fabric.Canvas('canvas', {uniformScaling: false})

    this.canvas.on('selection:created', event => {
      this.active = true
    })

    this.canvas.on('selection:cleared', event => {
      this.active = false
    })
  },

  destroyed() { }
}
</script>
