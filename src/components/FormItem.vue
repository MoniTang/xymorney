<template>
    <div>
    <Label  class="formItem">
        <span class="name">{{fieldName}}</span>   
        <input type="text"
        :value="value" @input="onValueChanged($event.target.value)"
        :placeholder=placeholder >
    </Label>
    </div>
</template>

<script lang="ts">
import vue from 'vue';
import {Component,Prop,Watch} from 'vue-property-decorator';
@Component
    export default class FormItem extends vue{
    @Prop({required:true}) fieldName!:string;
    @Prop() placeholder?:string;
    @Prop({default: ''})  readonly value?:string; 
    onValueChanged(value:string){
        this.$emit('update:value',value);
    }
}
</script>

<style lang="scss" scoped>
.formItem{
    display: flex;
    font-size: 14px;
    padding-left:16px;
    align-items: center;
    .name{
        padding-right:16px;
    }
    input{
        height: 40px;
        flex-grow: 1;
        border: none;
        background: transparent;
        padding-right:16px;
    }
}
</style>