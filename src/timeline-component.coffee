package "com.ee.timeline"

class @com.ee.timeline.Timeline
  
  constructor: (config)->

    @_buildLayers = (id)->
      for k,v of @_LAYER_KEYS
        @_buildLayer v
    

    @_buildLayer = ( name ) ->
      @_layers || (@_layers ={});
      @_layers[name] = {};
      @_layers[name].id = "__#{name}__#{@_config.id}"
      $("#" + @_config.id).append "<canvas id='" + @_layers[name].id + "' style='position:absolute;'> </canvas>"
      null

    @_initConfig = (config) =>
      if config?
        markerConfig = config.markerConfig

      defaultConfig = 
        id: "timelineHolder"
        bgColor: "#CCC"
        lineColor: "#232323"
        todayColor: "#99c5f5"
        padding: 12
        tooltipHandler: new com.ee.timeline.TimelineTooltipHandler()
        barThickness: 3
        cornerRadius: 5

      if( config? )
        @_config = $.extend defaultConfig, config
      else
        @_config = defaultConfig
      null

    ###
    Apply the width to all the drawing layers
    ###
    @_applyWidthToLayers = (w,h) ->
      #console.log "applyWidthToLayers..#{w}, #{h}"
      for k,v of @_LAYER_KEYS
        c = @_getCanvas v
        c.width =  @_holder.offsetWidth
        c.height = @_holder.offsetHeight
      null

    @_LAYER_KEYS =  BG: "BG", EVENTS: "EVENTS" 
    #console.log this
    @_initConfig config
    @_holder = document.getElementById @_config.id
    @_buildLayers @_config.id
    
    @_applyWidthToLayers @_holder.offsetWidth, @_holder.offsetHeight
   
  #private methods are prefixed with an underscore  _)

  _getTooltipData: (x,y) ->
    return { nudge : { x: 0, y: 0 } }

  _parseDateString: (dateString) ->
    arr = dateString.split "."
    year = parseInt arr[2], 10
    month = (parseInt arr[1], 10) - 1
    date = parseInt arr[0], 10
    new Date(year,month,date)

  _getNumberOfDays: (startDate, endDate) ->
    millis = endDate.getTime() - startDate.getTime()
    Math.round(millis/1000/60/60/24)

  _getContext: (name) ->
    if !name?
      throw "_getContext : IllegalArgument : name == null"
    @_getCanvas(name).getContext "2d"

  _drawYears : ->
    daysDiff = @_getNumberOfDays @_startDate, @_endDate
    noOfYears = daysDiff / 365
    startYear = @_startDate.getFullYear()

    for i in [0..noOfYears]
      nextYearDate = new Date(startYear + i, 0, 1)
      if nextYearDate < @_endDate && nextYearDate > @_startDate
        @_drawDateMarker nextYearDate, 'YEAR'
    null

  _drawMonths: ->
    daysDiff = @_getNumberOfDays @_startDate, @_endDate
    noOfMonths = daysDiff / 30
    startMonth = @_startDate.getMonth()
    nextYear = @_startDate.getFullYear()

    j = 0

    for i in [0..noOfMonths]
      nextMonth = startMonth + j
      nextMonthDate = new Date( nextYear, nextMonth, 1)

      if nextMonthDate < @_endDate && nextMonthDate > @_startDate
        @_drawDateMarker nextMonthDate, 'MONTH'
        
      j++
      
      if nextMonth > 10
        startMonth = 0
        j = 0
        nextYear++
    null

  _drawStartAndEndDateLabels: (data)->
    barThickness = @_config.barThickness
    w = @_getBgCanvas().width
    h = @_getBgCanvas().height
    startDate = @_parseDateString data.startDate
    endDate = @_parseDateString data.endDate
    
    @_getBgContext().fillText startDate.getFullYear(), @_config.padding + 5, @_config.padding + 30
    @_getBgContext().fillText endDate.getFullYear(), w - (@_config.padding + barThickness) - 25, @_config.padding + 30
    null

  _drawDateMarker: (date, granularity)->
    daysDiff = @_getNumberOfDays @_startDate, date

    #console.log "_drawDateMarker date: #{date}, granularity: #{granularity}, daysDiff: #{daysDiff}, pixelWidth: #{@_dayPixelWidth}"
    xPos = @_config.padding + (daysDiff * @_dayPixelWidth)
    
    g = new Graphics()

    g.beginFill(@_config.lineColor)
      .drawRect(Math.floor(xPos), 10, 2, @_getBgCanvas().height * 0.3 )
      .draw(@_getBgContext())
    
    dimensions = height:8
    textXPos = Math.floor xPos + 3
    textYPos = Math.floor 10 + dimensions.height

    if granularity == 'MONTH'
      if date.getMonth() + 1 != 1
        @_getBgContext().fillText date.getMonth() + 1, textXPos, textYPos
    else if granularity == 'YEAR'
      @_getBgContext().fillText date.getFullYear(), textXPos, textYPos
    
    null

  _drawBackground: ->
    w = @_getBgCanvas().width
    h = @_getBgCanvas().height

    g = new Graphics()
    context = @_getBgContext()

    g.beginFill(@_config.bgColor)
      .drawRoundRect(0,0,w,h,@_config.cornerRadius)
      .draw(context)

    g.beginFill(@_config.lineColor)
      .drawRect(@_config.padding, Math.floor((h-@_config.barThickness) * 0.5), w - (@_config.padding * 2), @_config.barThickness)
      .draw(context)
    
    g.beginFill(@_config.lineColor)
      .drawRect(@_config.padding, @_config.padding, @_config.barThickness, h - (@_config.padding * 2))
      .draw(context)

    #draw right bookend
    g.beginFill(@_config.lineColor)
      .drawRect(w - (@_config.padding + @_config.barThickness), @_config.padding, @_config.barThickness, h - (@_config.padding * 2))
      .draw(context)
    
    null

  _drawToday: -> @_drawEvent @_today, @_config.todayColor
  
  _drawEvents: ->
    for m in @_data.milestones
      @_drawEvent @_parseDateString(m.startDate)
    null

  _drawEvent: (mileStoneDate, color) ->
    daysSinceStartToStartDate = @_getNumberOfDays @_startDate, mileStoneDate
    cfg = @_config
   
    xPos = cfg.padding + Math.round(daysSinceStartToStartDate * @_dayPixelWidth)
    yPos = cfg.padding

    marker = new com.ee.timeline.Marker @_config.id, mileStoneDate, 18, 26, xPos, yPos, @_config.tooltipHandler, color
    null

  _drawPhaseEvents : (data) ->
    colors = ["#ff6600", "#9900FF", "#99CC00", "0033FF", "FFFF00"]

    for p,i in data.phases
      startDate = @_parseDateString p.startDate
      endDate = @_parseDateString p.endDate
      daysSinceStartToStartDate = @_getNumberOfDays @_startDate, startDate
      daysSinceStartToEndDate = @_getNumberOfDays @_startDate, endDate

      cfg = @_config
      xPos = cfg.padding + Math.round(daysSinceStartToStartDate) * @_dayPixelWidth
      yPos = Math.floor( @_getBgCanvas().height * 0.5 + @_config.barThickness ) - 1
      w = Math.round(daysSinceStartToEndDate - daysSinceStartToStartDate) * @_dayPixelWidth
      h = Math.floor( @_getBgCanvas().height * 0.5 - @_config.barThickness) + 2
      phase = new com.ee.timeline.Phase @_config.id, p, w, h, xPos, yPos, @_config.tooltipHandler, colors[i%5]
    null

  _clearLayer: (name) ->
    @_getContext(@_LAYER_KEYS[name])
      .clearRect(0, 0, @_getBgCanvas().width, @_getBgCanvas().height);

  _clear : -> 
    for k,v of @_LAYER_KEYS
      @_clearLayer k

  _getBgCanvas: ->  @_getCanvas @_LAYER_KEYS.BG
  _getBgContext: -> @_getBgCanvas().getContext "2d"
  _getCanvas: (id) -> @_getElement @_layers[id].id
  _getElement: (id) -> $("#" + id )[0]
   
   
  drawTimeline: (data) ->
    @_data = data
    @_startDate = @_parseDateString data.startDate
    @_endDate = @_parseDateString data.endDate
    @_today = @_parseDateString data.today

    totalNumberOfDays = @_getNumberOfDays @_startDate, @_endDate

    @_dayPixelWidth =  (@_getBgCanvas().width -  @_config.padding * 2) / totalNumberOfDays;

    @_clear() 
    @_drawBackground() 
    @_drawStartAndEndDateLabels data
    @_drawMonths() 
    @_drawYears() 
    @_drawToday() 
    @_drawEvents()
    @_drawPhaseEvents data
    null


 
