<template>
<Layout class-prefix="statistics">
    <div class="navBar">
        <span class="title">统计</span>
    </div>
     <Tabs class-prefix="type" :data-source="recordTypeList" :value.sync="type"/>
    <ol class="statistics-list" v-if="groupedList.length>0">
        <li v-for="(group,index) in groupedList" :key="index">
        <h3 class="group-title">{{beautify(group.title)}}<span>￥{{group.total}}</span></h3>
        <ol>
            <li v-for="(item,index) in group.items" :key="index"
            class="record">
            <span>{{tagString(item.tags )}}</span>
            <span class="item-notes">{{item.notes}}</span>
            <span>￥{{item.amount}}</span>
            </li>
        </ol>
        </li>
    </ol>
    <div v-else class="noResult">目前没有相关记录</div>
</Layout>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component} from 'vue-property-decorator';
import Tabs from '../components/Tabs.vue';
import recordTypeList from "@/constants/recordTypeList";
import dayjs from 'dayjs'
import clone from '@/lib/clone';

@Component({components:{Tabs}})
    export default class Statistics extends Vue{
        beautify(string:string){
            const day=dayjs(string);
            const now=dayjs();
            if(day.isSame(now,'day')){return '今天';}
            else if(day.isSame(now.subtract(1,'day'),'day')){return '昨天';}
            else if(day.isSame(now.subtract(2,'day'),'day')){return '前天';
            }else if(day.isSame(now,'year')){
                return day.format('M月D日');
            }else{
                return day.format('YYYY年M月D日');
            }
        }
        tagString(tags:Tag[]){
            return tags.length===0?'无':tags.map(t => t.name).join(',');
        }
        get recordList(){
            return (this.$store.state as RootState).recordList;
        }
        get groupedList(){
            type Result={title:string,total?:number,items:RecordItem[]}[]
            const {recordList}=this;
            const newList=clone(recordList).filter(t=>t.type===this.type)
            .sort((a,b)=>dayjs(b.createdAt).valueOf()
            -dayjs(a.createdAt).valueOf());
            if(newList.length===0){return [];}
            const result:Result=[{title:dayjs(newList[0].createdAt).format('YYYY-MM-DD'),items:[newList[0]]}];
            for(let i=1;i<newList.length;i++){
            const current=newList[i];
            const last=result[result.length-1] ;         
            if(dayjs(last.title).isSame(dayjs(current.createdAt),'day')){
                last.items.push(current);
            }else{
                result.push({title:dayjs(current.createdAt).format('YYYY-MM-DD'),items:[current]});
            }
        }
            result.map(group => {
            group.total = group.items.reduce((sum, item) => {
                return sum + item.amount;
                 }, 0);
            });
            return result;
        }
        beforeCreate(){
             this.$store.commit('fetchRecords');
        }
        type='-';
        recordTypeList=recordTypeList;
}
</script>

<style lang="scss">
.statistics-content{
     display: flex;
     flex-direction: column;
}

</style>
<style lang="scss" scoped>
%item{
   padding: 8px 16px;
    line-height: 24px;
    display: flex;
    justify-content: space-between;
    align-content: center;
}
   .noResult {
    color: #555;
    padding: 16px;
    text-align: center;
  }
.statistics-list{
    overflow:auto;
    flex-grow: 1;
 
    .group-title{
    @extend %item;
}
.record{ 
    background: white;
    @extend %item
}
.item-notes{
    margin-right:auto ;
    margin-left: 16px;
    color: #999;
}

}

.navBar{
    text-align: center;
    padding: 12px 16px;
    background:rgb(248,210,197);
    display: flex;
    align-items: center;
    justify-content: center;
}
 ::v-deep ul{
    background: #eee !important;
    .type-tabs-item{
        height: 40px;
        background: white;
        &.selected{
        background: #c4c4c4;
        &::after{
            display: none;
        }
    }
}
}

</style>