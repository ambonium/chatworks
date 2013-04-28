ext = window.location.pathname.split('/').pop().substring(0,75);

Template.rooms.roomslist = function() {
  return Rooms.find();
};

Template.chatroom.messages = function() {
  return Messages.find({'room_id': ext});
};

Template.message.helpers({
  linkify: function() {
    var val = this["message"];
    if(!val) return "";
    val = Handlebars._escape(val);
    var link = val;
    var exp = /((http|https):\/\/([ \S]+\.(jpg|jpeg|png|gif)))/ig;
    if(val.match(exp)) {
      link = val.replace(exp, '<a href="$1" target="_blank"><img src="$1" width="200" height="200"></a>');
    } else {
      exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
      link = val.replace(exp, '<a href="$1" target="_blank">$1</a>');
    }
    return link;
  },
  prettyTime: function() {
    var val = this["date_time"];
    if(!val) return "";
    var parsed = new Date(val);
    return ('0'+parsed.getHours()).substr(-2,2)+':'+('0'+parsed.getMinutes()).substr(-2,2);
  }
});

Template.chatroom.helpers({
  currentRoom: function() {
    return ext;
  }
});

Template.chatroom.events = {
  'click': function(evt) {
    SCROLL = false;
  }
};

Template.inputbox.events = {
  'click button, keyup input, focusin input': function(evt) {
    SCROLL = true;
    // trim handle & textbox
    var handle = $('#handle').val().substring(0,32);
    var textbox = $('#message').val().substring(0,200);

    // if we tapped the button or hit enter
    if (evt.type === 'click' || (evt.type === 'keyup' && evt.which === 13)) {

      if (Meteor.user()) { // must be logged in to use a real nickname
        handle = Meteor.user().username;
      } else {
        handle = 'anonymous';
      }

      var hue = colorHandle(handle);
      Meteor.call('add_message', handle, ext, textbox, hue);

      $("#handle").val(handle);
      $("#handle-counter").text(32 - $("#handle").val().length);
      $("#message-counter").text(200);
      $("#message").val('');
      $("#message").focus();
      scrollToBottom();
    }
    if (evt.type === 'keyup') {
      var remainingx = 32 - $("#handle").val().length;
      $("#handle-counter").text(remainingx);
      var remainingy = 200 - $("#message").val().length;
      $("#message-counter").text(remainingy);
      var text = $('label#handle').text();
    }
  }
};

Template.chatroom.messagesLoaded = function () {
  return Session.get('messagesLoaded');
};

Template.currentUser = function () {
  return Meteor.currentUser();
};