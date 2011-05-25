/*
 * orrery.js
 * (C) Per Johan Groland 2006
 *
 * Based on similar applications:
 *
 * http://widgets.yahoo.com/gallery/view.php?widget=39980
 * http://www.raingod.com/raingod/resources/Programming/Java/Software/Orrery/Orrery.html
 *
 */
 
function Planet(name, radius, period, width) {
	this.name         = name;
	this.radius       = radius;
	this.period       = period;
	
	this.theta = Planet.PI; // current radian position
	this.x   = -10;
	this.y   = -10;
	this.zorder = 0;
	this.yscale = 0.2;
		
	this.mode = Planet.PLANETS_ALL;
	
	// Make image
	this.image = new Image();
	this.image.src = "images/" + name.toLowerCase() + ".png";
	this.width = width;
	
    //if (opera) { opera.postError("Created " + name + "!"); }  	
}

Planet.PI  = 3.1416;
Planet.PI2 = 6.2832;
Planet.PLANETS_ALL = 0;
Planet.PLANETS_INNER = 1;

Planet.prototype.toggleMode = function() {
    if (this.mode = Planet.PLANETS_ALL) {
      this.mode = Planets.PLANETS_INNER;
    }
    else {
      this.mode = Planets.PLANETS_ALL;
    }
}

Planet.prototype.getScaledWidth = function() {
  var divider = 1;
  if      (this.yscale >= 0.8) { divider = 4; }
  else if (this.yscale >= 0.5) { divider = 3; }
  else if (this.yscale >= 0.2) { divider = 2; }

  var factor = Math.abs(this.zorder) / divider;
  factor = factor / 100;
  var scaledWidth = this.width;
  //if (this.name == "Jupiter" && opera) { opera.postError(this.name + " zorder: " + this.zorder + " factor: " + factor); }  	

  if (this.zorder < 0) { scaledWidth = this.width - this.width * factor; }
  else if (this.zorder > 0) { scaledWidth = this.width + this.width * factor; }
  
  if (scaledWidth < 3) { scaledWidth = 3 };
  
  return scaledWidth;
}

Planet.prototype.move = function(width, height, day, yscale) {
    this.theta = Planet.PI2 * (day / this.period) + Planet.PI;
    this.yscale = yscale;
		
	if (this.theta > Planet.PI2) {
	    this.theta -= Planet.PI2;
	}
	
	this.x = Math.cos(this.theta) * this.radius;
	this.y = Math.sin(this.theta) * this.radius;
	
	this.zorder = this.y;
	this.y *= this.yscale; 
		
	// Move relative to center of image
	this.x += (width / 2);
	this.y += (height / 2);
}

// For the sun
function Sun(x, y, width) {
  this.name = "Sun";
  this.radius = 0;
  this.period = 0;
  this.theta = 0;
  this.x = x;
  this.y = y;
  this.zorder = 0;
  //this.day = 0;
  //this.stepsize = 0;

  // Make image
  this.image = new Image();
  this.image.src = "images/sun.png";
  this.width = width;
}

Sun.prototype.getScaledWidth = function() {
  return this.width;
}

Sun.prototype.toggleMode = function() {}
Sun.prototype.move = function(width, height) {}

function Orrery(width, height) {
    this.planets = [];
    
    if (height > width) {
        height = width;
    }
        
    // y scale used to draw ellipsis
    var yscale = height / width;
    
    // calculate scaling factor for radius
    var innerScaling = (width*0.95/2) / 40; 
    var outerScaling = (width*0.95/2) / 100;

    // Normalized
    this.planets[0] = new Planet("Mercury", 15  * outerScaling,    87.96,   8);
	this.planets[1] = new Planet("Venus",   22  * outerScaling,   224.68,  15);
	this.planets[2] = new Planet("Earth",   31  * outerScaling,   365.25,  17);
	this.planets[3] = new Planet("Mars",    40  * outerScaling,   686.98,  10);
	this.planets[4] = new Planet("Jupiter", 52  * outerScaling,   4329.63, 35);
	this.planets[5] = new Planet("Saturn",  68  * outerScaling,  10751.44, 45);
	this.planets[6] = new Planet("Uranus",  82  * outerScaling,  30685.55, 20);
	this.planets[7] = new Planet("Neptune", 92  * outerScaling,  60155.65, 20);
	this.planets[8] = new Planet("Pluto",   100 * outerScaling, 90410.5,    7);
	
	this.planets[9] = new Sun(width/2, height/2, 32);
	
	this.width = width;
	this.height = height;
	
	this.day = 4200;
	this.stepsize = 4;
	this.yscale = 0.2;
	
	this.paused = false;	
}

function dosort(a, b) {
  return a.zorder - b.zorder;
}

Orrery.prototype.sort = function() {
  this.planets.sort(dosort);
}

Orrery.prototype.togglePause = function() {
  this.paused = !this.paused;
}

Orrery.prototype.setPause = function() {
  this.paused = true;
}

Orrery.prototype.unsetPause = function() {
  this.paused = false;
}

Orrery.prototype.move = function() {
  if (this.paused) { return; }

  for (var i = 0; i < this.planets.length; i++) {
    this.planets[i].move(this.width, this.height, this.day, this.yscale, this.divider)
  }
  
  this.day += this.stepsize;
}

Orrery.prototype.setViewPoint = function(view) {
  if      (view == 1) { this.yscale = 0.8; }  // high
  else if (view == 2) { this.yscale = 0.5; }  // medium
  else if (view == 3) { this.yscale = 0.2; }  // low
  else                { this.yscale = 0.05; } // very low
}

Orrery.prototype.setSpeed = function(speed) {
  if      (speed == 1) { this.stepsize = 0.25; } // very slow
  else if (speed == 2) { this.stepsize = 1; } // slow
  else if (speed == 3) { this.stepsize = 4; } // normal
  else if (speed == 4) { this.stepsize = 10; } // fast
  else if (speed == 5) { this.stepsize = 20; } // very fast
}
