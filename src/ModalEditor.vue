<template>
  <b-modal :id="id" :size="size" ref="modal" title="Popup" hide-header @shown="onShown" hide-footer dialog-class="gs-paint-modal-editor">
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
    size: {
      default: 'xl'
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
      if (this.$refs.editor === undefined || this.$refs.modal === undefined) {
        return
      }

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
  .gs-paint-modal-editor.modal-dialog {
    margin: 0 auto;
  }
  .gs-paint-modal-editor .modal-content {
    background: none;
    border: none;
  }
</style>
