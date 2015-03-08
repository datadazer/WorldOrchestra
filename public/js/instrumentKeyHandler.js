var WO = WO || {};

WO.instrumentKeyHandler = {
  keyDown: {},

  create: function(instrument){
    $(document).on('keydown', function(e){
      var note = getKey(e, false);
      var noteKeyPress = getKey(e, true);

      if( e.which === 88 || e.which === 90 ){
        setOctave(e.which);
        this.keyDown[e.which] = true;
      }

      if( note !== null ){
        if( this.keyDown[note] === null || this.keyDown[note] === undefined){
          instrument.triggerAttack(note);
          if (WO.transport.recording && instrument === WO.appView.songView.collection.settings.activeTrack.get('instrument')){
            WO.methods.recordNotes(note, Tone.Transport.getTransportTime(), 1.00);
          }
          this.keyDown[note] = true;
        }
        // trigger pianoKeyOn on piano keyboard
        $('body').trigger('pianoKeyOn', [noteKeyPress]);
      }
    }.bind(this));

    $(document).on('keyup', function(e){
      var currTrack;
      var note = getKey(e, false);
      var noteKeyPress = getKey(e, true);

        if (e.which === 46) {
          currTrack = WO.appView.songView.collection.settings.activeTrack;
          currTrack.get('mRender').deleteNote(currTrack);
        }

        if( e.which === 88 || e.which === 90 ){
            this.keyDown[e.which] = null;
        }

        //if there's a note and the note has being pressed
        if( note !== null && this.keyDown[note] ){
            instrument.triggerRelease(note);
            if (WO.transport.recording && instrument === WO.appView.songView.collection.settings.activeTrack.attributes.instrument){
                WO.methods.recordNotes(note, Tone.Transport.getTransportTime(), 0.00);
            }
            this.keyDown[note] = null;
            //trigger pianoKeyOff on piano keyboard
            $('body').trigger('pianoKeyOff', [noteKeyPress]);
        }
    }.bind(this));

    var keyMap = {
       65 : ["C",  0, "C"],
       87 : ["C#", 0, "Db"],
       83 : ["D",  0, "D"],
       69 : ["Eb", 0, "Eb"],
       68 : ["E",  0, "E"],
       70 : ["F",  0, "F"],
       84 : ["F#", 0, "Gb"],
       71 : ["G",  0, "G"],
       89 : ["G#", 0, "Ab"],
       72 : ["A",  0, "A"],
       85 : ["Bb", 0, "Bb"],
       74 : ["B",  0, "B"],
       75 : ["C",  1, "C"],
       79 : ["C#", 1, "Db"],
       76 : ["D",  1, "D"],
       80 : ["Eb", 1, "Eb"],
      186 : ["E",  1, "E"],
      222 : ["F",  1, "F"]
    };

  // Secondary map determines which mapping to send as a boolean.
    var getKey = function(event, secondaryMap){
        var note;

        if( keyMap[event.which] ){

          if(secondaryMap){
            note = keyMap[event.which][2] + (instrument.octave + keyMap[event.which][1]);
          } else {
            note = keyMap[event.which][0] + (instrument.octave + keyMap[event.which][1]);
          }

        }else{
          note = null;
        }
        return note;
    };

    var setOctave = function( key ){
      var octave = instrument.octave;
      if( this.keyDown[key] === null || this.keyDown[key] === undefined){
        if( key === 90 ){
          octave || octave--;
        } else {
          octave >=7 || octave++;
        }
        instrument.octave = octave;
        $('#octave').html(octave);
      }
    };

    $(document).ready(function() {
      $('#Container').on('mousedown','.anchor', function(){
          var note = $(this).attr("id");
          instrument.triggerAttack(note);
          if (WO.transport.recording){
              WO.methods.recordNotes(note, Tone.Transport.getTransportTime(), 1.00);
          }
      });
      $('#Container').on('mouseup','.anchor', function(){
          var note = $(this).attr("id");
          instrument.triggerRelease(note);
          if (WO.transport.recording){
              WO.methods.recordNotes(note, Tone.Transport.getTransportTime(), 0.00);
          }
      });
    });
  }
};
