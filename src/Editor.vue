<template>
  <div class="gs-paint-editor">

    <b-card header-tag="header" no-body>
      <template #header>
        <b-button-toolbar>
          <b-button-group size="sm" class="mr-1">

            <b-button @click="onClickSave" variant="primary">
              <b-icon icon="sd-card"></b-icon> Save
            </b-button>

            <b-button @click="onClickLoad" variant="primary">
              <b-icon icon="folder2-open"></b-icon> Open
            </b-button>
          </b-button-group>

          <b-button-group size="sm" class="mr-1">
            <b-button @click="onClickSetBackground" variant="primary">
              <b-icon icon="file-earmark-image"></b-icon> Image
            </b-button>
          </b-button-group>

          <b-button-group size="sm" class="mr-1">
            <b-button @click="onClickAddArrow" variant="primary">
              <b-icon icon="forward"></b-icon> Arrow
            </b-button>

            <b-button @click="onClickAddCircle" variant="primary">
              <b-icon icon="circle"></b-icon> Circle
            </b-button>

            <b-button @click="onClickAddSquare" variant="primary">
              <b-icon icon="square"></b-icon> Square
            </b-button>
          </b-button-group>

          <b-button-group size="sm" class="mr-1">
            <b-button @click="onClickSave" variant="primary">
              <b-icon icon="dash-lg"></b-icon> Border
            </b-button>
          </b-button-group>

          <b-button-group size="sm" class="mr-1">
            <b-button @click="onClickLoad" variant="success">
              <b-icon icon="brush-fill"></b-icon>
            </b-button>
            <b-button @click="onClickLoad" variant="warning">
              <b-icon icon="brush-fill"></b-icon>
            </b-button>
            <b-button @click="onClickLoad" variant="danger">
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

  methods: {
    onClickSave() {
      this.state = this.canvas.toJSON()

      console.log(this.state)
    },

    onClickLoad() {
      if (this.state) {
        this.canvas.loadFromJSON(this.state)
      }
    },

    onClickAddCircle() {},

    onClickAddArrow() {},

    onClickResize() {
      this.setCanvasAutoSize()
    },

    setCanvasAutoSize() {},

    onClickAddSquare() {
      var rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 20,
        height: 20,
      })

      this.canvas.add(rect)
    },

    onClickSetBackground() {},

    setImageFromUrl(url) {
      fabric.Image.fromURL(url, image => {
        this.canvas.setHeight(image.height)
        this.canvas.setWidth(image.width)

        this.canvas.setBackgroundImage(image, () => {
          this.canvas.renderAll()
        });
      })
    }
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


<style lang="css">
</style>