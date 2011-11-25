//little hack to reinstate the jquery $
if( $ == null || typeof($) == "undefined")
{
    $ = jQuery;
}

console.log("timeline component js!");
window.com || (window.com = {});
com.adobe || (com.adobe = {});
com.adobe.bumblebee || (com.adobe.bumblebee = {});

com.adobe.bumblebee.TimelineTooltipHandler = (function() {
 
  function TimelineTooltipHandler(config) 
  {

    this.getTipWidth = function()
    {
      return this.sumSizes("width","padding-left", "padding-right");
    }

    this.getTipHeight = function()
    {
      return this.sumSizes("height","padding-top", "padding-bottom");
    }

    this.sumSizes = function()
    {
      var out = 0;
      for( var x in arguments )
      {
         out += this.parseStyleSize( arguments[x]);
      }
      return out;
    }

    this.parseStyleSize = function( styleName )
    {
       return parseInt($("#" + this.tipUid).css(styleName).replace("px", ""));
    }

    this.initConfig = function(config)
    {
      var defaultConfig = { 
        nudge: 10,
        cssClassName : "tooltipContainer"};

      if (typeof config == 'object') 
      {
        this.config = $.extend(defaultConfig, config);
      }
      else 
      {
        this.config = defaultConfig;
      }
    }


    this.onMouseMove = function( event )
    {
        var data = this.getTooltipDataCallback( event.offsetX, event.offsetY);
        //console.log(data);
        this.updateTipText(data.data);
        var tipWidth = this.getTipWidth();
        var tipHeight = this.getTipHeight();
        var xPos = event.pageX - tipWidth - this.config.nudge;
        var yPos = event.pageY - tipHeight - this.config.nudge;

        $("#" + this.tipUid)
          .css("left", xPos + "px")
          .css("top", yPos + "px");
    }


    this.updateTipText = function( text )
    {
      $("#" + this.tipUid + " .content").html(text);
    }


    this.onMouseOver = function( event )
    {
        $("#" + this.tipUid)
          .css("opacity", "0.0")
          .css("visibility", "visible")
          .fadeTo('10', 0.8)
          .fadeIn('1000');
    }

    this.onMouseOut = function( event )
    {
      $("#" + this.tipUid).css("visibility", "hidden");
    }
    
    console.log("TimelineTooltipHandler :: constructor");
    this.tipUid = "__tip__" + Math.floor( Math.random() * 1000 );
    this.initConfig(config);

    $('body').append("<div id='"+ this.tipUid +"' class='"+ this.config.cssClassName +"'><div class='content'>text here</div></div>");

    $("#" + this.tipUid ).css("position", "absolute" )
        .css("left", "0px")
        .css("top", "0px")
        .css("background-color", "white")
        .css("visibility", "hidden")
        .mouseover(function(event){event.preventDefault();}); 
  }
  
  TimelineTooltipHandler.prototype.init = function( canvasId, getTooltipDataFn)
  {

    this.getTooltipDataCallback = getTooltipDataFn;
    //hook up the handlers
    $("#" + canvasId)
      .mousemove( $.proxy(this.onMouseMove,this))
      .mouseout( $.proxy(this.onMouseOut,this))
      .mouseover( $.proxy(this.onMouseOver,this));
  }

  return TimelineTooltipHandler;
})();
 

