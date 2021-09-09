<template>
  <ul class="timeline">
    <li class="timeline-item">
      <el-row>
        <el-col :span="6" :offset="9" class="text-center">
          <el-select class="select" v-model="value" placeholder="全部" @change="changeYear">
            <el-option v-for="item in years" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </li>
    <li class="timeline-item" :class="index%2==0?'right':'left'" v-for="(item, index) in activities" :key="index">
      <el-row>
        <el-col :span="9">
          <div class="timeline-text timeline-left" :class="index%2==0?'':'text'">
            {{index%2==0?item.content:item.timestamp}}
          </div>
        </el-col>
        <el-col :span="6" :class="'color'+(index+1)">
          <div class="timeline-center">
            <div class="timeline-title">{{"【"+(activities.length-index)+"】"+item.title}}</div>
            <div class="node">
              <div class="no"></div>
            </div>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="timeline-text timeline-right" :class="index%2==0?'text':''">
            {{index%2==0?item.timestamp:item.content}}
          </div>
        </el-col>
      </el-row>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    activities: {
      type: Array,
      default: []
    },
    years: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      value: ''
    }
  },
  methods:{
    changeYear(){
      console.log(this.value)
    }
  },
  mounted() {
    this.activities = this.activities.reverse()
    this.years = this.years.reverse()
  },
}
</script>

<style lang="scss" scoped>
// 布局的背景色
$color1: #bd80ff;
$color2: #ff9900;
$color3: #00b865;
$color4: #bd80ff;
$color5: #ff9900;
$color6: #00b865;
.timeline {
  margin-bottom: 20px;

  .timeline-item {
    margin-bottom: 30px;
    height: 48px;

    &:last-child .timeline-center::before {
      display: none;
    }
  }
  .timeline-center {
    text-align: center;
    border: 1px solid #ccc;
    padding: 0 5px;
    width: 80px;
    margin: 0 auto;
    position: relative;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;

    background: yellowgreen;
    color: #fff;

    .timeline-title {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &::before {
      content: '';
      border-left: 4px solid #c5d2ea;
      height: 65px;
      position: absolute;
      left: 50%;
      top: calc(100% + 1px);
    }

    .node {
      width: 12px;
      height: 12px;
      background: white;
      position: absolute;
      left: calc(100% + 21px);
      top: calc(50% - 6px);
      border-radius: 100%;
      border: 1px solid yellow;

      .no {
        width: 6px;
        height: 6px;
        border-radius: 100%;
        background: yellow;
        position: absolute;
        left: 3px;
        top: 3px;
      }
    }
  }
  .left .timeline-title::after {
    content: '';
    width: 20px;
    border-top: 2px solid red;
    position: absolute;
    left: calc(100% + 1px);
    top: 50%;
  }
  .right {
    .node {
      left: -35px;
    }

    .timeline-title::after {
      content: '';
      width: 20px;
      border-top: 2px solid red;
      position: absolute;
      left: calc(0% - 21px);
      top: 50%;
    }
  }

  .timeline-text {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    text-overflow: ellipsis;
  }

  .text {
    height: 32x;
    line-height: 32px;
  }

  .text-center {
    text-align: center;
  }

  .timeline-right {
    padding-left: 32px;
  }

  .timeline-left {
    padding-right: 32px;
  }

  /deep/ .select {
    width: 80px;
    text-align: center;
    .el-input__inner {
      background: #3366cc !important;
      color: #fff !important;
      &::placeholder {
        color: #fff !important;
      }
    }
    .el-input__icon {
      color: #fff !important;
    }
    &::before {
      content: '';
      border-left: 4px solid #c5d2ea;
      height: 66px;
      position: absolute;
      left: 50%;
      top: 100%;
    }
  }

  @mixin get-color($color: red) {
    .node {
      border: 1px solid $color;
      .no {
        background: $color;
      }
    }
    .timeline-title::after {
      border-top: 2px solid $color;
    }
    .timeline-center {
      background: $color;
    }
  }

  .color1 {
    @include get-color($color: $color1);
  }
  .color2 {
    @include get-color($color: $color2);
  }
  .color3 {
    @include get-color($color: $color3);
  }
  .color4 {
    @include get-color($color: $color4);
  }
  .color5 {
    @include get-color($color: $color5);
  }
  .color6 {
    @include get-color($color: $color6);
  }
}
</style>