<template>
  <b-modal ref="modal" :id="id" title="Popup" centered hide-header @shown="onShown" hide-footer>
    <Editor ref="editor" :image="image" :frame="frame" @change="onChange" @click-close="onClickClose">
      <template #left-btn-group>
        <slot name="left-btn-group"></slot>
      </template>
    </Editor>
  </b-modal>
</template>


<script lang="js">
export default {
  model: {
    prop: 'image',
    event: 'change'
  },

  props: {
    id: {
      type: String,
    },
    image: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      frame: null,
    }
  },

  methods: {
    onChange(image) {
      this.$emit('change', image)
    },

    onClickClose() {
      this.hide()
    },

    onShown() {
      this.frame = this.frameSizing()
    },

    onWindowResize() {
      this.onShown()
    },

    show() {
      this.$refs.modal.show()
    },

    hide() {
      this.$refs.modal.hide()
    },

    frameSizing() {
      const cardEl = this.$refs.editor.$refs.body
      const modalEl = this.$refs.modal.$refs.content

      return {
        width: cardEl.offsetWidth,
        height: document.documentElement.scrollHeight - (modalEl.offsetHeight - cardEl.offsetHeight),
      }
    },
  },

  mounted() {
    window.addEventListener('resize', this.onWindowResize)
  },

  destroyed() {
    window.removeEventListener('resize', this.onWindowResize)
  },
}
</script>

<style lang="css">
#popup .modal-dialog {
  max-width: 1000px !important;
}
</style>
