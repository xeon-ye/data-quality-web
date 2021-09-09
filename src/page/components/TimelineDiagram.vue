<template>
  <div>
    <div id="myDiagramDiv"></div>
  </div>
</template>

<script>
import go from 'gojs';

export default {
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      var $ = go.GraphObject.make;
      var myDiagram = $(go.Diagram, "myDiagramDiv", {
        initialContentAlignment: go.Spot.Center,
        "undoManager.isEnabled": true,
        layout: $(go.TreeLayout, { angle: 90, layerSpacing: 35 })
      });

      myDiagram.nodeTemplate =
        $(go.Node, "Horizontal", {
          locationSpot: go.Spot.Center,  // Node.location is the center of the Shape
          locationObjectName: "TITLE",
          selectionAdorned: false,
        },
          $(go.TextBlock, { margin: new go.Margin(0, 22, 0, 0), stroke: "#303133", maxSize: new go.Size(130, NaN) },
            new go.Binding("text", "timestamp"), new go.Binding("visible", "visibleContent")),

          $(go.TextBlock, { margin: 4, stroke: "#303133", maxSize: new go.Size(110, NaN) },
            new go.Binding("text", "content"), new go.Binding("visible", "visibleTime")),

          $(go.Panel, "Spot", new go.Binding("visible", "visibleTime"),
            $(go.Shape, "Circle",
              {
                name: "SHAPE",
                fill: "white",
                strokeWidth: 2,
                stroke: 'red',
                desiredSize: new go.Size(12, 12),
              },
              new go.Binding("stroke", "color"),
            ),
            $(go.Shape, "Circle",
              {
                name: "SHAPE",
                fill: "white",
                strokeWidth: 0,
                desiredSize: new go.Size(6, 6),
              },
              new go.Binding("fill", "color"),
            )
          ),

          $(go.Shape, "LineH",
            {
              stroke: "red", strokeWidth: 2,
              width: 15,
              stretch: go.GraphObject.Horizontal
            },
            new go.Binding("stroke", "color"),
            new go.Binding("visible", "visibleTime")
          ),


          $(go.Panel, "Spot",
            $(go.Shape, "RoundedRectangle",
              {
                name: "TITLE",
                fill: "red", strokeWidth: 0, cursor: "pointer",
                portId: "",//不可省略，连接线会以当前为节点
                maxSize: new go.Size(90, 42),
              },
              new go.Binding("fill", "color")),
            $(go.TextBlock,
              {
                margin: 8,
                stroke: "white",
                maxSize: new go.Size(84, 42)
              },
              new go.Binding("text", "title").makeTwoWay(),
              new go.Binding("visible", "", function (s) {
                return !s.visibleSelect;
              })),
            $("CheckBox", "choice1",
              $(go.TextBlock, "default", { stroke: "white" }),
              new go.Binding("text", "years").makeTwoWay(),
              new go.Binding("visible", "visibleSelect")),
          ),

          $(go.Shape, "LineH",
            {
              stroke: "red", strokeWidth: 2,
              width: 15,
              stretch: go.GraphObject.Horizontal
            },
            new go.Binding("stroke", "color"),
            new go.Binding("visible", "visibleContent")
          ),

          $(go.Panel, "Spot", new go.Binding("visible", "visibleContent"),
            $(go.Shape, "Circle",
              {
                name: "SHAPE",
                fill: "white",
                strokeWidth: 2,
                stroke: 'red',
                desiredSize: new go.Size(12, 12),
              },
              new go.Binding("stroke", "color"),
            ),
            $(go.Shape, "Circle",
              {
                name: "SHAPE",
                fill: "white",
                strokeWidth: 0,
                desiredSize: new go.Size(6, 6),
              },
              new go.Binding("fill", "color"),
            )
          ),

          $(go.TextBlock, { margin: new go.Margin(0, 0, 0, 22), stroke: "#303133", maxSize: new go.Size(130, NaN) },
            new go.Binding("text", "timestamp"), new go.Binding("visible", "visibleTime")),
          $(go.TextBlock, { margin: 4, stroke: "#303133", maxSize: new go.Size(110, NaN) },
            new go.Binding("text", "content"), new go.Binding("visible", "visibleContent"))
        );

      myDiagram.linkTemplate = $(go.Link, { routing: go.Link.Orthogonal, corner: 3 }, $(go.Shape, { strokeWidth: 4, stroke: "#c5d2ea" }))

      var model = $(go.TreeModel);
      model.nodeDataArray = [{ key: "1", parent: "2", title: "【1】新建数据", content: "修改表YY_KSDBMK中字段ysdm为varchar(64)", timestamp: "2018-04-15 14:02:23", color: "#bd80ff" },
      { key: "2", parent: "3", title: "【2】修改数据", content: "修改表YY_KSDBMK中字段ysdm为varchar(64)", timestamp: "2018-04-15 14:02:23", color: "#ff9900" },
      { key: "3", parent: "4", title: "【3】修改数据", content: "修改表YY_KSDBMK中字段ysdm为varchar(64)", timestamp: "2018-04-15 14:02:23", color: "#00b865" },
      { key: "4", parent: "5", title: "【4】修改数据", content: "修改表YY_KSDBMK中字段ysdm为varchar(64)", timestamp: "2018-04-15 14:02:23", color: "#bd80ff" },
      { key: "5", parent: "6", title: "【5】修改数据", content: "修改表YY_KSDBMK中字段ysdm为varchar(64)", timestamp: "2018-04-15 14:02:23", color: "#ff9900" },
      { key: "6", parent: "7", title: "【6】修改数据类型", content: "修rchar(64)修改表YY_KSDBMK中字段ysdm为varchar(64)", timestamp: "2018-04-15 14:02:23", color: "#00b865" },
      // { key: "7", parent: "", years: ["2021", "2020", "2019"], color: "#3366cc" }
      ];

      model.nodeDataArray.forEach((element, index) => {
        element.visibleSelect = null
        if (index % 2 == 0) {
          element.visibleContent = true
          element.visibleTime = false
        } else {
          element.visibleContent = false
          element.visibleTime = true
        }
      });

      //select
      // model.nodeDataArray[model.nodeDataArray.length - 1].visibleContent = false
      // model.nodeDataArray[model.nodeDataArray.length - 1].visibleTime = false
      // model.nodeDataArray[model.nodeDataArray.length - 1].visibleSelect = true

      console.log(model.nodeDataArray)
      myDiagram.model = model;

    }
  }
}
</script>

<style scoped>
#myDiagramDiv {
  border: solid 1px #0e183f;
  width: 100%;
  height: 600px;
  /* background-color: #283259; */
  background-color: white;
}
</style>