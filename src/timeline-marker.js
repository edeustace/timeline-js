window.com || (window.com = {});
com.adobe || (com.adobe = {});
com.adobe.bumblebee || (com.adobe.bumblebee = {});

com.adobe.bumblebee.TimelineMarker = (function() {
 
  /**
   * config options:
   * color = the base color eg: #ff99ff
   * dotColor = the dot color eg: #ffff99
   * dotSize = the size of the dot eg: 0.5
   */
  function TimelineMarker(config) 
  {
    console.log("TimelineMarker constructor");


    /**
     * Init the config object with sensible defaults if none provided.
     */
    this.initConfig = function(config)
    {
      var defaultConfig = { 
        color: "#A92C10", 
        dotColor: "#ffffff", 
        dotSize: 0.7 };

      if (typeof config == 'object') 
      {
        this.config = $.extend(defaultConfig, config);
      }
      else 
      {
        this.config = defaultConfig;
      }
    }

    this.initConfig(config);
  }


  TimelineMarker.prototype.draw = function(context, x, y, w, h, drawColor) {

    var halfHeight = h * 0.5;
    var halfWidth = w * 0.5;


    var color = drawColor == null ? this.config.color : drawColor
    console.log("TimelineMarker::draw color: " + color);
    var g = new Graphics();
    g.beginFill(color)
      .drawCircle(x,y,halfWidth)
      .draw(context);

    var nudgeX = x - halfWidth;
    
    g.beginFill(color)
      .moveTo(nudgeX, y )
      .lineTo(nudgeX + halfWidth, y + h)
      .lineTo(nudgeX + w, y )
      .closePath()
      .draw(context);

    g.beginFill(this.config.dotColor)
      .drawCircle(x,y, halfWidth * this.config.dotSize)
      .draw(context);

  };

  return TimelineMarker;

})();


