/*
 * Solar System Clock
 * Copyright (c) 2006, Per Johan Groland
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the University of California, Berkeley nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE REGENTS AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var canvas, ctx;
var orrery;
var watch;

// options
var pluto_is_a_planet;
var tentyfourhourclock;
var speed;
var view;

window.addEventListener('load', function(ev) {
  // add behavior to the flip button on the front side
  document.getElementById('flipfront').addEventListener('click', function(ev) {
    flipWidget("back");
    orrery.setPause();
  }, false);

  // add behavior to the flip button on the back side
  document.getElementById('flipback').addEventListener('click', function(ev) {
    flipWidget("front");
    orrery.unsetPause();
  }, false);

  // add behavior to the close button
  document.getElementById('closefront').addEventListener('click', function(ev) {
    window.close();
  }, false);

  document.getElementById('closeback').addEventListener('click', function(ev) {
    window.close();
  }, false);
  
}, false);

function flipWidget(to) {
  switch (to) {
    case "back":
      readOptions(false);
      document.getElementById('front').style.display = "none";
      document.getElementById('back').style.display = "block";
      break;
    case "front":
      writeOptions();
      document.getElementById('back').style.display = "none";
      document.getElementById('front').style.display = "block";
      break;
    default:
      break;
  }
}

function init() {
  canvas = document.getElementById("cv");
  ctx = canvas.getContext("2d");
  orrery = new Orrery(canvas.width, canvas.height);    
  watch = new DigitalWatch();

  // set defaults  
  pluto_is_a_planet = true;
  tentyfourhourclock = true;
  speed = 2; // 1(very slow), 2(slow), 3(normal), 4(fast), 5(very fast)
  view  = 3; // 1 (high), 2 (med), 3 (low), 4 (xlow)
    
  if (typeof widget != "undefined") {
    if (getPref("view") == "") {
      setPref("view", 3);
      setPref("speed", 2);
      setPref("pluto_is_a_planet", true);
      setPref("tentyfourhourclock", true);
    }
  }
  
  readOptions(true);
  
  watchloop();
  loop();
}

function readOptions(loadfromfile) {
  if (loadfromfile) {
    if (typeof widget != "undefined") { // load settings from file for opera widget mode
      view = getPref("view", 3);
      speed = getPref("speed", 3);
      pluto_is_a_planet = getPref("pluto_is_a_planet", true);
      tentyfourhourclock = getPref("tentyfourhourclock", true);
    }
  }
  else { // write to select boxes
    document.getElementById('view').value = view;
    document.getElementById('speed').value = speed;
    document.getElementById('politics').value = pluto_is_a_planet ? 1 : 0;
    document.getElementById('time').value = tentyfourhourclock ? 24 : 12;
  }

  /*  
  if (opera) { opera.postError("readOptions: view: " + view + 
                               "speed: " + speed +  	
                               "pluto: " + pluto_is_a_planet +  	
                               "clock: " + tentyfourhourclock); }  	
   */
  
  // set options
  orrery.setViewPoint(view);
  orrery.setSpeed(speed);
  watch.setTwentyFourMode(tentyfourhourclock);
}

function writeOptions() {
  // get from select boxes
  view = document.getElementById('view').value;
  speed = document.getElementById('speed').value;
  pluto_is_a_planet = (document.getElementById('politics').value == 1); 
  tentyfourhourclock = (document.getElementById('time').value == 24);
  
  // write to file for opera widget mode
  if (typeof widget != "undefined") {
    setPref("view", view);
    setPref("speed", speed);
    setPref("pluto_is_a_planet", pluto_is_a_planet);
    setPref("tentyfourhourclock", tentyfourhourclock);  
  }
  
  /*
  if (opera) { opera.postError("writeOptions: view: " + view + 
                               "speed: " + speed +  	
                               "pluto: " + pluto_is_a_planet +  	
                               "clock: " + tentyfourhourclock); }
   */
  
  // set options
  orrery.setViewPoint(view);
  orrery.setSpeed(speed);
  watch.setTwentyFourMode(tentyfourhourclock);
  watch.update();
}

function loop() {
  orrery.move();
  orrery.sort();
  draw();
  setTimeout(loop, 1);
}

function watchloop() {
  watch.update();
  setTimeout(watchloop, 1000);
}

function draw() {
  var planet;

  ctx.clearRect(0, 0, canvas.width, canvas.height);	
  //ctx.lineWidth = "1.0";	
    
  for (var i = 0; i < orrery.planets.length; i++) {
    planet = orrery.planets[i];
 
    if (planet.name == "Pluto" && !pluto_is_a_planet) continue;
     
    ctx.drawImage(planet.image, planet.x - planet.getScaledWidth()/2, planet.y - planet.getScaledWidth()/2,
                  planet.getScaledWidth(), planet.getScaledWidth());
  }  
}

function setPref(name, value) {
  if (!widget) { return; }

  if (typeof value == "boolean" && value == true)       { widget.setPreferenceForKey("true", name);  }
  else if (typeof value == "boolean" && value == false) { widget.setPreferenceForKey("false", name); }
  else                                                  { widget.setPreferenceForKey(value+"", name);    }
}

function getPref(name) {
  if (!widget) { return def; }
  
  var v = widget.preferenceForKey(name);

  if (v == "true") { return true; }
  else if (v == "false") { return false; }
  else if (v.match(/^[0-9]+$/)) { return parseInt(v); }
  return v;
}
