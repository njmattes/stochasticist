# Stochastic.ist

`stochastic.ist` makes pretty (dumb) pictures in your browser. 
Drawings are constructed on a square grid, with strokes
moving in 45 degree increments.  

## Interface

The interface is entirely in the URL. Construct a path 
containing key and value pairs. Usable keys are below. 

An example URL: [http://stochastic.ist/scale/2/stroke/5/colorspace/hex/fg/222222,343434/bg/454545](http://stochastic.ist/scale/2/stroke/5/colorspace/hex/fg/222222,343434/bg/454545)

* `size`. The size of the grid cells in pixels. A positive 
   integer less than the smaller of your browser's height 
   or width. (An integer greater than 0. Defaults to `10`.) 
* `stroke`. The width of the strokes in pixels. 
   A positive integer or a comma-separated list of two 
   integers representing the minimum and maximum size 
   of randomized stroke widths. (An integer greater than 0. 
   Defaults to `2`.)
* `scale`. Adjusts stroke length relative to the grid. (A 
   number greater than 0. Defaults to `1`.)
* `cap`. Style of stroke ends. (A string equal to `square`. 
  `round`, `square`, or `butt`. Defaults to `square`.)
* `dirs`. Cardinal directionality of the strokes. 
   (A comma-separated list of strings equal to `n`, `ne`, 
  `e`, `se`, `s`, `sw`, `w`, `nw`. Defaults to
  `n,ne,e,se,s,sw,w,nw`.)
* `colorspace`. Determines the type of values passed to
  `fg` and `bg`. (Accepts a string equal to either `names`
   or `hex`. Defaults to `names`.)  
* `bg`. Background color of the browser. (A string equal to 
   either an HTML color name or a HEX color code (less the 
   initial #). Defaults to `white`.)
* `fg`. Foreground color(s) of the strokes. (A comma-separated
   list of strings equal to either HTML color names or HEX color 
   codes (less the initial #); or a named palette (currently 
   only supports [`universal`](/fg/universal)). Defaults to 
   `black`.)  
* `mouse`. Should the drawing follow the mouse. (Accepts
   [`true`](/mouse/true), [`false`](/mouse/false), 
   [`1`](/mouse/1), [`0`](/mouse/0). Defaults to `false`.) 
* `drunkard`. The drawing performs a 2-dimensional
   drunkard's walk. (Accepts [`true`](/drunkard/true), 
   [`false`](/drunkard/false), [`1`](/drunkard/1), 
   [`0`](/drunkard/0). Defaults to `true`.)
   
### Note 

`mouse` and `drunkard` are mutually exclusive 
(with `mouse` taking precedence).

Some values that can't be parsed fall back to defaults.
Others generate 403 errors. Consistency amongst errros 
may or may not be obtained future versions.
