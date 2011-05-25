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
 
function DigitalWatch() {
  this.blank = "blank";
  this.digit = "digit";

  // Load images
  this.blankImage = new Image();
  this.blankImage.src = "images/" + this.blank + ".png";
  
  this.digits = [];
  
  for (var i = 0; i <= 9; i++) {
    this.digits[i] = new Image();
    this.digits[i].src = "images/" + this.digit + + i + ".png";
  }
  
  this.year    = 0;
  this.month   = 0;
  this.day     = 0;
  this.hours   = 0;
  this.minutes = 0;
  this.seconds = 0;
  this.pm = true;
  this.twentyfour = true

  this.updateDate();
  document.images.sep0.src = "images/m_dash.png";
  document.images.sep1.src = "images/m_dash.png";
}

DigitalWatch.prototype.setTwentyFourMode = function(twentyfour) {
  this.twentyfour = (twentyfour == true);
}

DigitalWatch.prototype.update = function() {
  var d = new Date();
  
  //if (opera) { opera.postError("Date: " + d); }  
  
  this.hours   = d.getHours();
  this.minutes = d.getMinutes();
  this.seconds = d.getSeconds();
  
  // Adjust for 12 hour clock if neccesary
  if (!this.twentyfour) {
    if (this.hours == 0) { // midnight
      this.am = true;
      this.hours = 12;
    }
    if (this.hours < 12) {
      this.am = true;    
    }
    else {
      this.am = false;
      if (this.hours > 12) { this.hours -= 12; }
    }
    
    if (this.am) { document.images.ampm.src = "images/am.png"; }   
    else         { document.images.ampm.src = "images/pm.png"; } 
  }
  else {
    document.images.ampm.src = "images/blank.png";
  }
  
  // hours
  if (this.hours >= 10) {
    document.images.hour1.src = "images/" + this.digit + (this.hours+"").charAt(0) + ".png";
    document.images.hour2.src = "images/" + this.digit + (this.hours+"").charAt(1) + ".png";
  }
  else {
    document.images.hour1.src = "images/" + this.blank + ".png";
    document.images.hour2.src = "images/" + this.digit + this.hours + ".png";
  }

  // minutes
  if (this.minutes >= 10) {
    document.images.minute1.src = "images/" + this.digit + (this.minutes+"").charAt(0) + ".png";
    document.images.minute2.src = "images/" + this.digit + (this.minutes+"").charAt(1) + ".png";
  }
  else {
    document.images.minute1.src = "images/" + this.digit + "0.png"
    document.images.minute2.src = "images/" + this.digit + this.minutes + ".png";
  }

  // seconds
  if (this.seconds >= 10) {
    document.images.second1.src = "images/" + this.digit + (this.seconds+"").charAt(0) + ".png";
    document.images.second2.src = "images/" + this.digit + (this.seconds+"").charAt(1) + ".png";
  }
  else {
    document.images.second1.src = "images/" + this.digit + "0.png"
    document.images.second2.src = "images/" + this.digit + this.seconds + ".png";
  }
  
  // check if it is neccesary to update the date
  if (this.year  != d.getFullYear() ||
      this.month != d.getMonth()+1  ||
      this.day   != d.getDate()) {
    this.updateDate();
  }  
}

DigitalWatch.prototype.updateDate = function() {
  var d = new Date();
  this.year = d.getFullYear();
  this.month = d.getMonth() + 1;
  this.day = d.getDate();

  document.images.year0.src = "images/m_digit" + (this.year+"").charAt(0) + ".png";
  document.images.year1.src = "images/m_digit" + (this.year+"").charAt(1) + ".png";
  document.images.year2.src = "images/m_digit" + (this.year+"").charAt(2) + ".png";
  document.images.year3.src = "images/m_digit" + (this.year+"").charAt(3) + ".png";

  if (this.month < 10) {
    document.images.month0.src = "images/m_digit0.png";
    document.images.month1.src = "images/m_digit" + (this.month+"").charAt(0) + ".png";  
  }
  else {
    document.images.month0.src = "images/m_digit" + (this.month+"").charAt(0) + ".png";
    document.images.month1.src = "images/m_digit" + (this.month+"").charAt(1) + ".png";
  }

  if (this.day < 10) {
    document.images.day0.src = "images/m_digit0.png";
    document.images.day1.src = "images/m_digit" + (this.day+"").charAt(0) + ".png";
  }
  else {
    document.images.day0.src = "images/m_digit" + (this.day+"").charAt(0) + ".png";
    document.images.day1.src = "images/m_digit" + (this.day+"").charAt(1) + ".png";  
  }
}