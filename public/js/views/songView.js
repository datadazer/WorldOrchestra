var WO = WO || {};
WO.SongView = Backbone.View.extend({
  id: 'songView',
  
  events: {
    'click .add-track-button' : 'addTrack'
  },
  
  initialize: function(params) {    
    this.render();
    
    this.collection.on("add remove", this.render, this);
  },

  addTrack: function(){
    var newTrack = new WO.Track();
    console.log(this);
    // var newTrackView = new WO.TrackView();
    this.collection.add(newTrack);
  },
  removeTrack: function(){
    
  },
  render: function() {
    this.$el.children().detach();
    this.collection.forEach(this.renderTrack, this);
    $('.appBody').prepend(this.el);
    return this;
  },
  renderTrack: function(track){
    var trackView = new WO.TrackView({model: track});
    this.$el.append(trackView.render());
  }
});
//

// this.collection.each(function(track){

// })