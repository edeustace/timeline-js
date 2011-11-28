package "come.ee.timeline"

class @com.ee.timeline.TimelineTooltipHandler
  
  constructor: (config) ->
    
    @initConfig = (config) ->
      defaultConfig = tipClassId: "tooltipContainer"

      if( config? )
        @config = $.extend defaultConfig, config
      else
        @config = defaultConfig

    @tipUid = "__tip__#{Math.floor( Math.random() * 10000 )}"
    @initConfig config
    $('body').append("<div id='#{@tipUid}' class='#{@config.tipClassId}'><div >text here</div></div>");
  

  showTooltip: (x, y, text) ->
    $("##{@tipUid}").html text

    $("#" + this.tipUid ).css("position", "absolute" )
      .css("left", "#{x - @getTipWidth() - 5}px")
      .css("top", "#{y - @getTipHeight() - 5}px")
      .css("background-color", "white")
      .css("opacity", "0.0")
      .css("visibility", "visible")
      .fadeTo('10', 0.9)
      .fadeIn('600');


    null
  
  hideTooltip: ->
    $("##{@tipUid}").css('visibility', 'hidden')
    null

  getTipWidth: -> @sumSizes "width","padding-left", "padding-right"
  getTipHeight: -> @sumSizes "height","padding-top", "padding-bottom"
  
  sumSizes: ->
    out = 0;
    for x in arguments
      out += @parseStyleSize x
    out

  parseStyleSize: ( styleName ) ->
    parseInt( $("##{@tipUid}").css(styleName).replace("px", ""))


