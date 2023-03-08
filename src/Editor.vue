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
              <b-icon icon="arrow-right-short"></b-icon> Arrow
            </b-button>

            <b-button @click="onClickAddCircle" variant="primary">
              <b-icon icon="circle-fill"></b-icon> Circle
            </b-button>

            <b-button @click="onClickAddSquare" variant="primary">
              <b-icon icon="square-fill"></b-icon> Square
            </b-button>
          </b-button-group>
        </b-button-toolbar>
      </template>

      <b-card-body class="overflow-auto">
        <canvas id="area" ref="canvas" width="500" height="500"></canvas>
      </b-card-body>
    </b-card>
  </div>
</template>


<script lang="js">
import { fabric } from 'fabric'

export default {
  methods: {
    onClickSave() {
      this.state = this.canvas.toJSON()
    },

    onClickLoad() {
      if (this.state) {
        this.canvas.loadFromJSON(this.state)
      }
    },

    onClickAddArrow() {
    },

    onClickAddCircle() {
    },

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

    onClickSetBackground() {
      this.setBackground()
    },

    setBackground() {
      fabric.Image.fromURL('/image/image-1.jpg', image => {
        this.canvas.insertAt(image, 0);
      })
    }
  },

  mounted() {
    this.canvas = new fabric.Canvas('area')
  },

  destroyed() { }
}
</script>


<style lang="css">
</style>