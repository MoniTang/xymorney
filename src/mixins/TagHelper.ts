import Vue from 'vue'
import { Component } from 'vue-property-decorator';
const map: { [key: string]: string } = {
    'tag name duplicated': '标签名已存在'
}
@Component
export default class TagHelper extends Vue {
    createTag() {
        const name = window.prompt('请输入标签名');
        console.log(name);
        if (name === null) { return; }
        if (!name || name === '') { return window.alert('标签名不能为空'); }
        this.$store.commit('createTag', name)
        if (this.$store.state.createTagError) {
            window.alert(map[this.$store.state.createTagError.message] || '未知报错');
            return;
        }
        window.alert('添加成功');
    }
}