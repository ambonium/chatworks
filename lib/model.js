
Messages = new Meteor.Collection('messages');

Meteor.methods({
  add_message: function (handle, ext, textbox, hue) {
    Messages.insert({
      handle: handle,
      room_id: ext,
      message: textbox,
      date_time: new Date(),
      color: hue,
      irc: false,
      action: false,
      bot: false,
      confirmed: !this.isSimulation
    });
  }
});