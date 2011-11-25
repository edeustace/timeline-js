window.com || (window.com = {});
com.adobe || (com.adobe = {});
com.adobe.bumblebee || (com.adobe.bumblebee = {});

com.adobe.bumblebee.Timeline = (function() {
 
  function Timeline(config) {
     
    /**
     * Init component with sensible defaults
     */
    this.initConfig = function(config)
    {

      var markerConfig = config == null ? {} : config.markerConfig;

      var defaultConfig = 
      {
          id: "timelineHolder", 
          bgColor: "#CCC",
          lineColor: "#232323",
          padding: 12,
          barThickness: 3,
          todayColor: "#99C5F5",
          tooltipHandler : new com.adobe.bumblebee.TimelineTooltipHandler(),
          marker : new com.adobe.bumblebee.TimelineMarker( markerConfig ),
          cornerRadius: 5
      };

      if (typeof config == 'object') 
      {
        this.config = $.extend(defaultConfig, config);
      }
      else 
      {
        this.config = defaultConfig;
      }
    }


    /**
     * Callback to allow the tooltip handler to get data for a potential tooltip.
     * If there is no interesting data a null object is returned.
     * @param x - the local x position of the mouse on the canvas
     * @param y - the local y position of the mouse on the canvas
     */
    this.getTooltipData = function( x, y )
    {
      console.log("Timeline::getTooltipData: " + x + ", "+ y);
      return { nudge: {x: 0, y: 0}, data: "Here is some data for you"}
    }

    
    this.initConfig(config);
    
    this.holder = document.getElementById(this.config.id);
    console.log("found holder: " + this.holder);

    this.canvasId = "__canvas__" + this.config.id;
    this.holder.innerHTML = "<canvas id='"+this.canvasId+"'> </canvas>";

    this.canvas = document.getElementById(this.canvasId);

    if( this.config.tooltipHandler != null )
    {
      this.config.tooltipHandler.init(this.canvasId, this.getTooltipData);
    }

    this.canvas.width = this.holder.offsetWidth;
    this.canvas.height = this.holder.offsetHeight;
    console.log("found canvas" + this.canvas);

    this.getDate = function(dateString)
    {
      //console.log("getDate: " + dateString);
      var arr = dateString.split(".");
      var year = parseInt(arr[2], 10);
      var month = parseInt(arr[1], 10) - 1;
      var date = parseInt(arr[0], 10);

      var out = new Date(year, month, date);
      //console.log("getDate: " + dateString + " >> " + out.toDateString() + "y,m,d:" + year + "," + month + "," + date);
      return out;
    };

    this.getNumberOfDays = function(startDate, endDate)
    {
      //console.log("getTotalNumberOfDays: start: " + startDate.toString());
      //console.log("getTotalNumberOfDays: end: " + endDate.toString());
      var millisDiff = endDate.getTime() - startDate.getTime();
      return millisDiff / 1000 / 60 / 60 / 24;
    }

    this.getContext = function()
    {
      return this.canvas.getContext("2d");
    }

    this.drawYears = function()
    {    	    	    	
      var daysDiff = this.getNumberOfDays(this.startDate, this.endDate);

//      if( daysDiff < 365 )
//      {
//        return;
//      }

      var numberOfYears = daysDiff / 365;

      var startYear = this.startDate.getFullYear();

      for( var i= 0 ; i < numberOfYears ; i++ )
      {
        var nextYear = startYear + i;  
        
        var nextYearDate = new Date(nextYear + 1, 0, 1);

        if ((nextYearDate < this.endDate) && (nextYearDate > this.startDate))
        	this.drawDateMarker(nextYearDate, 'YEAR');
      }

    }
    
    this.drawMonths = function()
    {

    	var daysDiff = this.getNumberOfDays(this.startDate, this.endDate);   

    	var numberOfMonths = daysDiff / 30;
    	
    	console.log("Number of months: " + numberOfMonths);

    	var startMonth = this.startDate.getMonth();
    	var nextYear = this.startDate.getFullYear();

    	var j = 0;
    	
    	for( var i= 0 ; i < numberOfMonths - 1 ; i++ )
    	{      		
    		var nextMonth = startMonth + j;    		    		
    		
    		//console.log("MONTH/YEAR " + nextMonth + "/" + nextYear);
    		
    		var nextMonthDate = new Date(nextYear, nextMonth, 1);

    		if ((nextMonthDate < this.endDate) && (nextMonthDate > this.startDate))
    			this.drawDateMarker(nextMonthDate, 'MONTH');
    		
    		j++;
    		
    		if (nextMonth > 10) {
    			startMonth = 0;
    			j = 0;
    			nextYear = nextYear + 1;
    		}    		
    	}
    }
    
    this.drawStartEndDates = function(data)
    {
    	var cfg = this.config;
    	var barThickness = this.config.barThickness;
    	var w = this.canvas.width;
        var h = this.canvas.height;
    	
    	var startDate = this.getDate(data.startDate);
    	var endDate = this.getDate(data.endDate);
    	var startDateStr = startDate.getFullYear();    	
    	var endDateStr = endDate.getFullYear();
        	
    	this.getContext().fillText(startDateStr,cfg.padding + 5 ,cfg.padding + 30);
    	this.getContext().fillText(endDateStr,w - (cfg.padding + barThickness) - 25 ,cfg.padding + 30);

    }
    
    this.drawDateMarker = function( date, granularity )
    {    

      var cfg = this.config;
      
      var daysDiff = this.getNumberOfDays(this.startDate, date);
      
      var xPos =  cfg.padding + daysDiff * this.dayPixelWidth;
      var g = new Graphics();
      g.beginFill(this.config.lineColor)
        .drawRect(Math.floor(xPos), 10, 2, this.canvas.height * 0.3 )
        .draw(this.getContext());
      
      var dimensions = {height: 8};
      var textXPos = Math.floor( xPos + 3);
      var textYPos = Math.floor( 10 + dimensions.height);
      if (granularity == 'MONTH'){
    	  if (date.getMonth() + 1 != 1)
    	  {
    		  this.getContext().fillText(date.getMonth() + 1, textXPos, textYPos);
    	  }
      } else if (granularity == 'YEAR') {
    	  this.getContext().fillText(date.getFullYear(), textXPos, textYPos);
      }
      
    }

    this.drawBackground = function()
    {
        if( this.getContext())
        {
          var context = this.getContext();
          
          var cfg = this.config;
          var w = this.canvas.width;
          var h = this.canvas.height;

          var g = new Graphics();
          //draw bg
          g.beginFill(cfg.bgColor)
            .drawRoundRect(0,0,w,h, cfg.cornerRadius)
            .draw(context);

          //draw line
          var barThickness = this.config.barThickness;
          g.beginFill(cfg.lineColor)
            .drawRect(cfg.padding, Math.floor((h - barThickness) * 0.5),  w - (cfg.padding * 2), barThickness)
            .draw(context);

          //draw bookends
          g.beginFill(cfg.lineColor)
            .drawRect(cfg.padding, cfg.padding, barThickness, h - (cfg.padding * 2))
            .draw(context);
          
          //draw right bookend
          g.beginFill(cfg.lineColor)
            .drawRect(w - (cfg.padding + barThickness), cfg.padding, barThickness, h - (cfg.padding * 2))
            .draw(context);
        }
    }

    this.drawToday = function()
    {    	
      var daysSinceStart = this.getNumberOfDays( this.startDate, this.today );

      console.log("drawToday: daysSinceStart: " + daysSinceStart);

      var context = this.getContext();

      var cfg = this.config;

      var radius = 10;

      
      this.config.marker.draw( 
            this.getContext(), 
            cfg.padding + Math.round(daysSinceStart) * this.dayPixelWidth, 
            cfg.padding - 2, 
            18, 
            22,
            cfg.todayColor);
    }
    
    this.drawMilestoneEvents = function(data)
    {
    	console.log("Enter drawMilestoneEvents");    	
    	
    	for (var i = 0; i < data.milestones.length; i++ ){

    		console.log("Milestones TO DRAW: " + data.milestones[i].startDate + " - " + data.milestones[i].description);

        var dateString = data.milestones[i].startDate;
    		var date = this.getDate(dateString);

        var daysSinceStartToStartDate = this.getNumberOfDays( this.startDate, date);

    		var cfg = this.config;
    		
    		var marker = this.config.marker;

    		marker.draw( this.getContext(), cfg.padding + Math.round(daysSinceStartToStartDate * this.dayPixelWidth),
    				cfg.padding, 15, 20);
    	}
    	
    }
    
    this.drawPhaseEvents = function(data)
    {
    	console.log("Enter drawPhaseEvents");
    	var colors = new Array ("#ff6600","#9900FF","#99CC00","0033FF","FFFF00");
    	
    	for (var i = 0; i < data.phases.length; i++ ){

    		console.log("PHASES TO DRAW: " + data.phases[i].startDate + " - " + data.phases[i].endDate + " - " + data.phases[i].description);

        var startDate = this.getDate(data.phases[i].startDate);
        var endDate = this.getDate(data.phases[i].endDate)
    		var daysSinceStartToStartDate = this.getNumberOfDays( this.startDate, startDate);
    		var daysSinceStartToEndDate = this.getNumberOfDays( this.startDate, endDate);

    		var cfg = this.config;
    		
    		var g = new Graphics();  
    		    		
            g.beginFill(colors[i%5])
              .drawRect(cfg.padding + Math.round(daysSinceStartToStartDate) * this.dayPixelWidth,cfg.padding*3,
            		  Math.round(daysSinceStartToEndDate - daysSinceStartToStartDate) * this.dayPixelWidth,cfg.padding,30)
              .draw(this.getContext());

    	}
    }

    this.clear = function()
    {
      this.getContext().clearRect( 0, 0, this.canvas.width, this.canvas.height );
    }
   }

  Timeline.prototype.drawTimeline = function(data) {

    this.startDate = this.getDate(data.startDate);
    this.endDate = this.getDate(data.endDate);
    this.today = this.getDate(data.today);

    var totalNumberOfDays = this.getNumberOfDays( this.startDate, this.endDate );
    console.log("totalNumberOfDays: " + totalNumberOfDays);

    this.dayPixelWidth = (this.canvas.width - (this.config.padding * 2)) / totalNumberOfDays;    
    console.log(this.dayPixelWidth);

    var daysDiff = this.getNumberOfDays(this.startDate, this.endDate);
    
    this.clear();
    this.drawBackground();
    this.drawStartEndDates(data); 
    this.drawMonths();
    this.drawYears();	
    this.drawToday();
    this.drawMilestoneEvents(data);
    this.drawPhaseEvents(data);
  };

  return Timeline;

})();


