<template>
  <div class="demo-gs-paint-editor">
    <b-modal id="exploler" ref="exploler" title="Expoler" centered>
      <b-list-group>
        <b-list-group-item href="#" v-for="image in images" :key="image.url" @click="onClickImage(image)">
          {{image.url}} <b-icon icon="file-check" class="float-right" v-if="image.schema"></b-icon>
        </b-list-group-item>
      </b-list-group>
    </b-modal>

    <Editor :image="image" @change="onChange">
      <template #left-btn-group>
        <b-button v-b-modal.exploler variant="primary">
          <b-icon icon="folder2-open"></b-icon> Open
        </b-button>
        <b-button variant="primary">
          <b-icon icon="image"></b-icon> View
        </b-button>
      </template>
    </Editor>
  </div>
</template>


<script lang="js">
import Editor from "../Editor.vue";

export default {
  components: { Editor },
  model: {
    prop: 'image',
    event: 'change'
  },
  data () {
    return {
      image: {
        schema: null,
        url: null,
      },
      images: [
        {url: '/image/image-1.jpg', schema: null},
        {url: '/image/image-2.jpg', schema: null},
        {url: '/image/image-3.jpg', schema: null},
      ],
    }
  },

  methods: {
    onClickImage(image) {
      this.image = image
      this.$refs.exploler.hide()
    },

    onChange(image) {
      this.image.schema = image.schema
    },
  },
}
</script>
