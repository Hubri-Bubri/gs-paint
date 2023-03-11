<template>
  <div class="demo-gs-paint-editor">
    <b-modal id="exploler" title="Expoler" centered>
      <b-list-group>
        <b-list-group-item href="#" v-for="url in urls" :key="url">
          {{url}} <b-icon icon="file-check" class="float-right"></b-icon>
        </b-list-group-item>
      </b-list-group>
    </b-modal>

    <Editor :url="url">
      <template #left-btn-group>
        <b-button v-b-modal.exploler variant="primary">
          <b-icon icon="folder2-open"></b-icon> Open
        </b-button>
      </template>
    </Editor>
  </div>
</template>


<script lang="js">
import Editor from "../Editor.vue";

export default {
  components: { Editor },
  data () {
    return {
      url: '/image/image-1.jpg',
      urls: [
        '/image/image-1.jpg',
        '/image/image-2.jpg',
        '/image/image-3.jpg',
      ],
    }
  },

  methods: {
    onClickOpen () {},
  },
}
</script>
