
d3.select('.download')
  .style('display', function() {
    if (Options.save) {
      return 'block';
    }
    return 'none';
  })
  .on('click', function(d) {
    let download = document.getElementById('download');
    let image = document.getElementById('grid_canvas')
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    download.setAttribute('href', image);
  });