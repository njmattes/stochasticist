const GridShit = function GridShit(opts) {

  const that = this;

  let screenScale = window.devicePixelRatio || 1;
  if (opts.save) {
    screenScale = 8;
  }

  const width = document.body.clientWidth;
  const height = document.body.clientHeight;
  const t = 50;
  const x = Math.floor(width / opts.grid_size) - 1;
  const y = Math.floor(height / opts.grid_size) - 1;
  const xs = Array.from(Array(x),
    (d, index) => index * opts.grid_size +
      (width - (x - 1) * opts.grid_size) / 2);
  const ys = Array.from(Array(y),
    (d, index) => index * opts.grid_size +
      (height - (y - 1) * opts.grid_size) / 2);

  const directions = {
    n: [0, -1], ne: [1, -1], e: [1, 0], se: [1, 1],
    s: [0, 1], sw: [-1, 1], w: [-1, 0], nw: [-1, -1]
  };
  let matrix = [];
  for (let i = 0; i < opts.directions.length; ++i) {
    matrix.push(directions[opts.directions[i]]);
  }

  let mouse_x = .5;
  let mouse_y = .5;

  let point0 = [Math.floor(x/2), Math.floor(y/2)];
  let point1 = point0;

  const stroke_offset = (1 - opts.scale) / 2 * opts.grid_size;
  let scale = {offset_x: 0, offset_y: 0};
  let sox = 0;
  let soy = 0;

  // d3.select('.grid').style('background-color', opts.background);
  const canvas = d3.select('.grid').append('canvas')
    .attr('id', 'grid_canvas')
    .attr('width', width * screenScale)
    .attr('height', height * screenScale)
    .style('width', `${width}px`)
    .style('height', `${height}px`)
    .on('mousemove', function() {
      let mouse = d3.mouse(this);
      mouse_x = mouse[0];
      mouse_y = mouse[1];
    })
    .on('mousedown', function() {
      opts.stop = !opts.stop;
      if (!opts.stop) {
        that.step();
      }
    });

  this.ctx = canvas.node().getContext('2d');

  this.ctx.scale(screenScale, screenScale);
  this.ctx.fillStyle = (opts.colorspace === 'hex')
    ? `#${opts.background}`
    : opts.background;
  this.ctx.fillRect(0, 0, width, height);

  if (opts.colorspace === 'hex') {
    this.ctx.fillStyle = `#${opts.background}`;
  } else {
    this.ctx.fillStyle = opts.background;
  }

  this.get_color_palette = function get_color_palette() {
    opts.foreground = opts.foreground.split(',');
    let palette = [];
    for (let i = 0; i < opts.foreground.length; ++i) {
      if (opts.foreground[i] === 'universal') {
        palette = palette.concat(universal);
      } else {
        if (opts.colorspace === 'hex') {
          palette = palette.concat(`#${opts.foreground[i]}`);
        } else {
          palette = palette.concat(opts.foreground[i]);
        }
      }
    }
    return palette;
  };


  this.randn_bm = function randn_bm(min, max, skew) {
    /**
     * From Stackoverflow user @joshuakcockrell
     * https://stackoverflow.com/questions/25582882/
     * javascript-math-random-normal-distribution-gaussian-bell-curve
     */
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) *
      Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5;
    if (num > 1 || num < 0) num = that.randn_bm(min, max, skew);
    num = Math.pow(num, skew);
    num *= max - min;
    num += min;
    return num;
  };


  this.get_first_point = function get_first_point(point1) {

    let point = [];

    if (opts.mouse) {
      let rnd_x = that.randn_bm(0, 1,
        ((1 - mouse_x / width) * 2) ** 1.5);
      let rnd_y = that.randn_bm(0, 1,
        ((1 - mouse_y / height) * 2) ** 1.5);
        point = [Math.floor(rnd_x * x), Math.floor(rnd_y * y)];
    } else if (!opts.drunkard) {
      point = [Math.floor(Math.random() * x), Math.floor(Math.random() * y)];
    } else {
      point = point1;
    }

    return point;

  };


  this.get_valid_first_point = function get_valid_first_point() {

    point0 = that.get_first_point(point1);

    while (matrix.map(d => [d[0] + point0[0], d[1] + point0[1]])
      .filter(d => d[0] >= 0)
      .filter(d => d[0] <= x)
      .filter(d => d[1] >= 0)
      .filter(d => d[1] <= y).length === 0) {
      point0 = that.get_first_point(point1);
    }

    return point0;

  };


  this.set_line_weight = function get_line_weight() {

    if (opts.stroke.length > 1) {
      that.ctx.lineWidth = Math.floor(Math.random() *
        (opts.stroke[1] - opts.stroke[0]) + opts.stroke[0]);
    } else {
      that.ctx.lineWidth = opts.stroke[0];
    }
  };


  this.set_stroke_color = function get_stroke_color() {
    that.ctx.strokeStyle = that.palette[Math.floor(Math.random() *
                                        that.palette.length)];
  };


  this.get_stroke_scale = function get_stroke_scale(point0, point1) {
    if (point0[0] === point1[0]) {
      sox = 0;
    } else if (point0[0] > point1[0]) {
      sox = -stroke_offset;
    } else {
      sox = stroke_offset;
    }

    if (point0[1] === point1[1]) {
      soy = 0;
    } else if (point0[1] > point1[1]) {
      soy = -stroke_offset;
    } else {
      soy = stroke_offset;
    }

    return {offset_x: sox, offset_y: soy};
  };


  this.get_skitter = function get_skitter() {
    return (Math.random() - .5) * Options.skitter;
  };


  this.step = function step() {
    if (!opts.stop) {
      that.draw_line();
      setTimeout(step, t);
    }
  };


  this.draw_line = function draw_line() {

    point0 = that.get_valid_first_point();

    let adj = matrix.map(d => [d[0] + point0[0], d[1] + point0[1]])
      .filter(d => d[0] >= 0)
      .filter(d => d[0] <= x)
      .filter(d => d[1] >= 0)
      .filter(d => d[1] <= y);

    point1 = adj[Math.floor(Math.random() * adj.length)];

    that.set_line_weight();

    scale = {offset_x: 0, offset_y: 0};

    if (Options.scale) {
      scale = that.get_stroke_scale(point0, point1);
    }

    if (Options.skitter) {
      let skitter = that.get_skitter();
      scale.offset_x += skitter;
      scale.offset_y += skitter;
    }

    that.set_stroke_color();
    that.ctx.beginPath();
    that.ctx.lineCap = opts.line_cap;
    that.ctx.moveTo(xs[point0[0]] + scale.offset_x,
                    ys[point0[1]] + scale.offset_y);
    that.ctx.lineTo(xs[point1[0]] - scale.offset_x,
                    ys[point1[1]] - scale.offset_y);
    that.ctx.stroke();

    if (opts.drunkard) {
      point0 = point1;
    }

  };


  this.draw_error = function draw_error(path) {
    that.set_line_weight();
    that.set_stroke_color();
    that.ctx.beginPath();
    that.ctx.lineCap = opts.line_cap;
    let p = path[0];
    let i = 1;
    function foo(p) {
      that.ctx.beginPath();
      that.ctx.moveTo(xs[p[0]], ys[p[1]]);
      p[0] += path[i][0];
      p[1] += path[i][1];
      that.ctx.lineTo(xs[p[0]] - scale.offset_x,
                      ys[p[1]] - scale.offset_y);
      that.ctx.stroke();
      if (i < path.length-1) {
        setTimeout(function() { foo(p); }, t);
      }
      i++;
    }
    foo(p);

  };


  this.draw_403 = function draw_403() {
    let rel_path = [
      // [3, 2],
      // [0, 1], [1, -1], [0, 1], [0, 1], [1, 0],
      [3, 3],
      [-1, 0], [1, -1], [0, 1], [0, 1], [1, 0],
      [1, 0], [0, -1], [0, -1], [-1, 0], [0, 1], [0, 1], [1, 0], [1, 0],
      [1, 0], [0, -1], [-1, 0], [1, -1], [-1, 0], [1, 0], [1, 0],
      [1, 0],
      [1, 0], [-1, 0], [1, 1], [-1, 0], [0, 1], [1, 0], [1, 0],
      [1, 0], [0, -1], [0, -1], [-1, 0], [0, 1], [0, 1], [1, 0], [1, 0],
      [0, -1], [0, -1], [1, 0], [-1, 1], [1, 0], [0, 1], [1, 0],
      [0, -1], [0, -1], [1, 0], [-1, 1], [1, 0], [-1, 1], [1, 0], [1, 0],
      [0, -1], [0, -1], [0, 1], [0, 1], [1, 0],
      [0, -1], [0, -1], [1, 0], [0, 1], [-1, 1], [1, 0], [1, 0],
      [0, -1], [0, -1], [1, 0], [0, 1], [-1, 1], [1, 0], [1, 0],
      [1, 0],
      [-1, -1], [1, 0], [-1, -1], [1, 0], [1, 0],
      [0, 1], [0, 1], [0, -1], [0, -1], [1, 1], [0, 1], [0, -1], [0, -1],
    ];
    that.draw_error(rel_path);
  };


  this.palette = this.get_color_palette();


  return this;

};
