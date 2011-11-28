package "com.ee.timeline"

class @com.ee.timeline.Marker
  constructor: (@parentId, @date, @w, @h, @x, @y, @tooltipHandler, @color)->
    console.log "marker: w: #{@w}, h: #{@h}, x: #{@x}, y: #{@y}"

    @id = "__marker__#{@date.getDate()}_#{@date.getMonth()}_#{@date.getFullYear()}"
    $("##{parentId}")
      .append """<canvas id='#{@id}'
              class='__marker_canvas'
              style='position:absolute; 
              width: #{@w}px; 
              height: #{@h}px;
              left: #{@x - Math.floor(@w * 0.5)}px;
              top: 4px;
              '></canvas>"""
    
    $("##{@id}")
    .mouseover (event)=>
      @drawer.draw @context, Math.floor(@w * 0.5), Math.floor(@w * 0.5), @w, @h, "#ff99ff"
      if @tooltipHandler?
        @tooltipHandler.showTooltip event.pageX, event.pageY, "#{@date.getDate()}.#{@date.getMonth() + 1}.#{@date.getFullYear()}"
    
    .mouseout (event)=>
      @drawer.draw @context, Math.floor(@w * 0.5), Math.floor(@w * 0.5), @w, @h, @color
      if @tooltipHandler?
        @tooltipHandler.hideTooltip()
    
    @canvas = $("##{@id}")[0]
    @canvas.width = @w
    @canvas.height = @h
    @context = @canvas.getContext "2d"
    @drawer = new com.ee.timeline.TimelineMarker()
    @drawer.draw @context, Math.floor(@w * 0.5), Math.floor(@w * 0.5), @w, @h, @color

    
    
