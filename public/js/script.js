// Attach d to window if it doesn't exist
window.d = window.d || function(c, ...children) {
    let e = $(`<div class="${c}">`);
    for (let child of children) {
        child.appendTo(e);
    }
    return e;
}

// Attach input to window if it doesn't exist
window.input = window.input || function(c, attributes) {
    let e = $(`<input class="${c}">`);
    for (let k in attributes) {
        e.attr(k, attributes[k]);
    }
    return e;
}

// Constants
const MIN = 3;
const INC = 2;

// Attach all functions to window.d
window.d.row = function({name='', clocks=[], minimized=false}={name: '', clocks: [], minimized: false}) {
    let e = d('row', 
        d('handle row-handle'), 
        d('inner', 
            input('name', {placeholder: 'Row'}).val(name), 
            d('clocks', 
                ...clocks.map(c => d.clock(c)), 
                d.spawner(), 
            ), 
        ), 
    );
    if (minimized) {
        e.attr('minimized', '');
    }
    let s = Sortable.create(e.find('.clocks').get(0), {
        handle: '.clock-handle',
        animation: 150, 
        ghostClass: 'dragged-item', 
        onStart: event => $('.rows').attr('dragging', ''), 
        onEnd: event => {
            $('.row').each((i, r) => {
                let e = $(r);
                e.find('.spawner').insertAfter(e.find('.clock').last());
            });
            $('.rows').removeAttr('dragging');
        }, 
    });
    s.option('group', {
        name: 'clocks', 
        pull: true, 
        put: ['clocks'], 
    });
    e.find('.row-handle').on('click', event => {
        if (event.shiftKey) {
            e.is('[minimized]') ? e.removeAttr('minimized') : e.attr('minimized', '');
        }
    });
    e.find('.row-handle').on('dblclick', event => {
        s.destroy();
        e.remove();
    });
    e.find('.button.bad').on('click', event => add_clock(false, e));
    e.find('.button.good').on('click', event => add_clock(true, e));
    return e;
}

window.d.spawner = function() {
    return d('spawner', 
        d('button bad', 
            d('icon'), 
        ), 
        d('bar', 
            d('paint', 
                d('strokes', 
                    d('stroke s1'), 
                    d('stroke s2'), 
                ), 
            ), 
        ), 
        d('button good', 
            d('icon'), 
        ), 
    );
}

window.d.clock = function({description='', good=false, max=4, progress=undefined}={description: '', good: false, max: 4, progress: undefined}) {
  let e = d('clock', 
      d('banner', 
          d('handle clock-handle'), 
          input('description', {placeholder: 'Clock'}).val(description), 
      ), 
      d('widget', 
          d('core'), 
          d('disc'), 
          d('segment-count').text(max), // Add this line
      ), 
  ).attr(good ? 'good' : 'bad', '')
  d.clock.populate(e, max, progress);
  e.on('click', event => click_clock(e, event));
  e.find('.widget').on('wheel', event => scale_clock(e, event));
  e.find('.clock-handle').on('click', event => toggle_clock(e, event));
  e.find('.clock-handle').on('dblclick', event => remove(e, event));
  return e;
}

window.d.clock.populate = function(e, n, progress=undefined) {
    let core = e.find('.core');
    core.empty();
    let slices = [];
    for (let i = 0; i < n; i++) {
        let slice = d('slice').attr('i', i).appendTo(core);
        slice.get(0).style.setProperty('--i', i);
        slice.mouseenter(() => update_clock(e, i, true));
        slice.mouseleave(() => update_clock(e, i, false));
        if (i < progress) {
            slice.attr('filled', '');
        }
    }
    for (let i = 0; i < n; i++) {
        let bar = d('bar', d('paint')).attr('i', i).appendTo(core);
        bar.get(0).style.setProperty('--i', i);
    }
    e.attr('n', n);
    e.get(0).style.setProperty('--n', n);
    return e;
}

let add_row = function() {
  let newRow = d.row().appendTo($('.rows'));
  updateJsonText(); // Call this after adding a row
  return newRow;
}

let add_clock = function(good=false, row=undefined) {
  row = row ? row : $('.row').last();
  if (row.length == 0) {
      row = add_row();
  }
  let e = d.clock({good: good}).appendTo(row.find('.clocks'));
  row.find('.spawner').insertAfter(e);
  
  if (!good) {
      playSound('432198__surfaceknight68__monster-says-whats-that_short.wav');
  }

  updateJsonText(); // Call this after adding a clock
  return e;
}

let click_clock = function(clock, event) {
  let target = $(event.target);
  if (!target.is('.slice')) {
      return;
  }
  let i = parseInt(target.attr('i'));
  let filling = clock.find(`.slice[i="${i}"]`).attr('filled') == undefined;
  clock.find('.slice').each((j, e) => {
      if (j > i || (j == i && !filling)) {
          $(e).removeAttr('filled');
      } else {
          $(e).attr('filled', '');
      }
  });
  update_clock(clock, i, true);

  // Play stone on stone impact sound
  playSound('30008__thanvannispen__stone_on_stone_impact_loud1.mp3');
  updateJsonText(); // update state
}


let isScaling = false; // Flag to indicate max segment count display

let update_clock = function(clock, i, inside) {
  // Respect the isScaling flag
  if (isScaling) {
      return; // Do nothing if the max segment count is being displayed
  }

  let currentFilled = clock.find('.slice[filled]').length;
  let delta = 0;

  if (inside) {
      let filling = clock.find(`.slice[i="${i}"]`).attr('filled') == undefined;
      clock.find('.slice').each((j, e) => {
          let slice = $(e);
          let filled = slice.attr('filled') != undefined;
          let change = filling ? 
              j <= i && !filled : 
              j > i && filled;

          if (change) {
              slice.attr('will-change', '');
          } else {
              slice.removeAttr('will-change');
          }
      });

      // Calculate the delta
      if (filling) {
          delta = i + 1 - currentFilled;
      } else {
          delta = i - currentFilled;
      }
      
      // Show the delta in the center
      let segmentCount = clock.find('.segment-count');
      segmentCount.text(delta > 0 ? `+${delta}` : `${delta}`);
      segmentCount.css('opacity', '1'); // Ensure the text is visible during mouseover

      // Play the hover sound
      playSound('159698__qubodup__scroll-step-hover-sound-for-user-interface.FLAC');

  } else {
      clock.find('.slice').removeAttr('will-change');
      
      // Hide the delta when the mouse leaves
      let segmentCount = clock.find('.segment-count');
      segmentCount.css('opacity', '0'); // Fade out the text
  }
  updateJsonText(); // update state
}



let scale_clock = function(clock, event) {
  if (!event.shiftKey) {
      return;
  }
  event.preventDefault();
  let size = parseInt(clock.attr('n'));
  let modifier = event.originalEvent.deltaY > 0 ? -INC : INC;
  if (size == MIN && modifier > 0) {
      modifier = 1; // Special sauce to allow MIN=3 but INC=2
  }
  let n = Math.max(MIN, size + modifier);
  if (n != size) {
      d.clock.populate(clock, n);
      let segmentCount = clock.find('.segment-count');
      segmentCount.text(n); // Show the segment count
      segmentCount.css('opacity', '1'); // Make the text visible

      isScaling = true; // Set the flag to indicate scaling mode
      clearTimeout(segmentCount.data('timeout')); // Clear any existing timeout
      let timeout = setTimeout(() => {
          segmentCount.css('opacity', '0'); // Fade out after 2 seconds
          isScaling = false; // Reset the flag after timeout
      }, 500);

      segmentCount.data('timeout', timeout); // Store the timeout ID
  }
  updateJsonText(); // update state
}


let toggle_clock = function(clock, event) {
    if (!event.shiftKey) {
        return;
    }
    if (clock.attr('good') == undefined) {
        clock.removeAttr('bad');
        clock.attr('good', '');
    } else {
        clock.removeAttr('good');
        clock.attr('bad', '');
    }
    updateJsonText(); // update state
}



let remove = function(e, event) {
  if (event.shiftKey) {
      return;
  }

  playSound('648969__atomediadesign__dying.wav');
  e.remove();
  updateJsonText(); // Call this after removing an element
}


let help = function() {
    let e = $('.help-info');
    if (e.length) {
        e.remove();
    } else {
        e = d('help-info', 
            d('text').html('<b>Click</b> a clock\'s segments to fill or clear them.'), 
            d('text').html('<b>Shift+scrollwheel</b> while over a clock to resize it.'), 
            d('text').html('<b>Drag</b> any clock or row via its grey bar.'), 
            d('text').html('<b>Double click</b> a grey bar to remove that clock or row.'), 
            d('text').html('<b>Shift+click</b> a grey bar to toggle that clock\'s color.'), 
            d('text').html('<b>Shift+click</b> a grey bar to hide or unhide that row.'), 
        ).appendTo($('.main'));
        e.get(0).style.setProperty('--w', `${e.width()}px`);
        e.one('click', event => e.remove());
    }
}


let load = function() {
    let rows = $('.rows');
    let data = JSON.parse(window.localStorage.getItem('data'));
    for (let row of data) {
        d.row(row).appendTo(rows);
    }
}
let save = function() {
    let data = $('.row')
        .map((i, r) => ({
            name: $(r).find('.name').val().trim(), 
            clocks: $(r).find('.clock')
                .map((j, c) => ({
                    description: $(c).find('.description').val().trim(), 
                    good: $(c).attr('good') != undefined, 
                    max: parseInt($(c).attr('n')), 
                    progress: $(c).find('[filled]').length, 
                }))
                .get(), 
            minimized: $(r).is('[minimized]'), 
        }))
        .get();
    window.localStorage.setItem('data', JSON.stringify(data));
}


let initialize = function() {
  $(document).ready(function() {
    // Create main structure first
    let main = d('main', 
        d('menu', 
            d('button new-row', 
                d('text').text('Row'), 
            ), 
            d('button bad-clock', 
                d('text').text('Clock (bad)'), 
            ), 
            d('button good-clock', 
                d('text').text('Clock (good)'), 
            ), 
            d('button state-button', 
                d('text').text('State'), 
            ), 
            d('button help', 
                d('text').text('?'), 
            ), 
        ), 
        d('rows'), 
    ).appendTo($('body'));

    // Bind click events
    main.find('.new-row').on('click', e => add_row());
    main.find('.bad-clock').on('click', e => add_clock());
    main.find('.good-clock').on('click', e => add_clock(true));
    main.find('.state-button').on('click', e => showStateModal());
    main.find('.help').on('click', e => help());

    // Initialize Sortable AFTER the rows element exists
    const rowsEl = main.find('.rows').get(0);
    if (rowsEl) {
        Sortable.create(rowsEl, {
            handle: '.row-handle',
            animation: 150, 
            ghostClass: 'dragged-item', 
        });
    }

    window.addEventListener('beforeunload', save);
    load();
  });
}

// Function to show the modal when State button is clicked
function showStateModal() {
  updateJsonText(); // Update the JSON text area with the current state
  $('#state-modal').show(); // Show the modal
}

// Utility function to update JSON in the modal textarea
function updateJsonText() {
  let data = $('.row')
      .map((i, r) => ({
          name: $(r).find('.name').val().trim(), 
          clocks: $(r).find('.clock')
              .map((j, c) => ({
                  description: $(c).find('.description').val().trim(), 
                  good: $(c).attr('good') != undefined, 
                  max: parseInt($(c).attr('n')), 
                  progress: $(c).find('[filled]').length, 
              }))
              .get(), 
          minimized: $(r).is('[minimized]'), 
      }))
      .get();
  $('#json-text').val(JSON.stringify(data, null, 2)); // Populate the JSON text area
}

// Utility function to play an audio file
let playSound = function(filename) {
  let audio = new Audio(`../audio/${filename}`);
  audio.play();
}


// Hide modal on cancel or click outside
$(document).ready(function() {
  let modal = $('#state-modal');
  $('#cancel-state').on('click', function() {
      modal.hide(); // Hide the modal on cancel
  });

  $(window).on('click', function(event) {
      if ($(event.target).is(modal)) {
          modal.hide(); // Close modal when clicking outside
      }
  });

  $('#import-state').on('click', function() {
      loadFromJson(); // Load JSON from text area
      modal.hide(); // Hide modal after import
  });
});

function loadFromJson() {
  try {
      let data = JSON.parse($('#json-text').val()); // Get JSON from the text area
      
      // Clear existing rows
      $('.rows').empty();

      // Loop through the data and recreate each row and its clocks
      for (let row of data) {
          let newRow = d.row({
              name: row.name,
              clocks: row.clocks.map(clock => ({
                  description: clock.description,
                  good: clock.good,
                  max: clock.max,
                  progress: clock.progress
              })),
              minimized: row.minimized
          }).appendTo($('.rows'));
      }

      // Update the JSON text area to reflect the loaded state
      updateJsonText();

  } catch (e) {
      alert('Invalid JSON!');
      console.error('Error parsing JSON: ', e);
  }
}


initialize();