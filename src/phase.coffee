package "com.ee.timeline"

class @com.ee.timeline.Phase
  constructor:  (@parentId, @data, @w, @h, @x, @y, @tooltipHandler, @color) ->
    uid = "#{@data.startDate}-#{@data.endDate}"
    console.log  "Phase x: #{@x}, y: #{@y}, w: #{@w}, h: #{@h}"
    @id = "__phase__#{uid}"
    @id = @id.replace(/\./g, "_") 
    $("##{parentId}")
      .append """<canvas id='#{@id}'
              class='__marker_canvas'
              style='position:absolute; 
              width: #{@w}px; 
              height: #{@h}px;
              opacity: 0.5;
              background-color: #{@color};
              left: #{@x}px;
              top: #{y}px;
              '></canvas>"""
    @canvas = $("##{@id}")[0]
    @canvas.width = @w
    @canvas.height = @h
    
    $("##{@id}").mouseover (event) =>
      $("##{@id}").css('opacity', 1)

      if @tooltipHandler?
        @tooltipHandler.showTooltip event.pageX, event.pageY, "#{@data.startDate}-#{@data.endDate}"
    
    .mouseout (event)=>
      $("##{@id}").css('opacity', 0.5)
      if @tooltipHandler?
        @tooltipHandler.hideTooltip()

