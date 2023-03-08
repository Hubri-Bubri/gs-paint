<template>
  <div class="demo-gs-paint-editor">
    <Editor :url="url"/>
  </div>
</template>


<script lang="js">
import Editor from "../Editor.vue";

export default {
  data () {
    return {
      url: '/image/image-1.jpg'
    }
  },
  components: { Editor },
}
</script>
