
if (Options.mouse) {
  Options.drunkard = false;
}

Options.directions = Options.directions.split(',');
Options.stroke = Options.stroke.split(',');

let gs = GridShit(Options);
// gs.step();
