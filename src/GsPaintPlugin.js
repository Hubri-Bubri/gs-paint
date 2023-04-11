import Editor from "./Editor.vue";
import ModalEditor from "./ModalEditor.vue";

export default function GsEditorPlugin(Vue) {
    Vue.component('Editor', Editor)
    Vue.component('ModalEditor', ModalEditor)
}
