<template>
  <div class="gs-paint-editor">

    <b-card header-tag="header" no-body>
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
            <b-button @click="onClickAddArrow" variant="secondary">
              <b-icon icon="forward"></b-icon> Arrow
            </b-button>

            <b-button @click="onClickAddCircle" variant="secondary">
              <b-icon icon="circle"></b-icon> Circle
            </b-button>

            <b-button @click="onClickAddSquare" variant="secondary">
              <b-icon icon="square"></b-icon> Square
            </b-button>

            <b-button @click="onClickAddSquare" variant="secondary">
              <b-icon icon="cursor-text"></b-icon> Text
            </b-button>

            <b-button @click="onClickDelete" variant="secondary">
              <b-icon icon="trash2"></b-icon> Delete
            </b-button>
          </b-button-group>

          <b-button-group size="sm" class="mr-1">
            <b-button @click="onClickBorder" variant="secondary">
              <b-icon icon="dash-lg"></b-icon> Border
            </b-button>
          </b-button-group>

          <b-button-group size="sm" class="mr-1">
            <b-button @click="onClickFill('rgb(40, 167, 69)')" variant="success">
              <b-icon icon="brush-fill"></b-icon>
            </b-button>
            <b-button @click="onClickFill('rgb(255, 193, 7)')" variant="warning">
              <b-icon icon="brush-fill"></b-icon>
            </b-button>
            <b-button @click="onClickFill('rgb(220, 53, 69)')" variant="danger">
              <b-icon icon="brush-fill"></b-icon>
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
    return {}
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
      const object = this.canvas.getActiveObject()

      if (object == null) {
        return
      }

      let strokeWidth = object.strokeWidth

      if (strokeWidth > 0) {
        strokeWidth = 0
      } else {
        strokeWidth = 5
      }

      object.set({
        strokeWidth,
      })

      this.canvas.renderAll()
    },

    onClickFill(fill) {
      const object = this.canvas.getActiveObject()

      if (object == null) {
        return
      }

      object.set({
        fill,
      })

      this.canvas.renderAll()
    },

    onClickAddCircle() {
      var circle = new fabric.Circle({
        radius: 100,
        fill: 'green',
        left: 100,
        top: 100,
        stroke: 'red',
        strokeWidth: 5,
        strokeUniform: true,
      });

      this.canvas.add(circle)
    },

    onClickAddArrow() {},

    onClickAddSquare() {
      const {left, top} = this.computeAllowablePosition()

      var rect = new fabric.Rect({
        left,
        top,
        fill: 'rgba(0, 0, 0, 0)',
        width: 200,
        height: 200,
        stroke: 'red',
        strokeWidth: 5,
        strokeUniform: true,
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
    this.canvas = new fabric.Canvas('canvas')
  },

  destroyed() { }
}
</script>
